import weaviate from "weaviate-ts-client";
import sharp from "sharp";

const client = weaviate.client({
  scheme: "http",
  host: "localhost:8080",
});
const list = [];
for (let page = 1; page < 2; page++) {
  const resp = await fetch(
    `https://www.stepmode.dz/wp-json/wc/store/products?per_page=50&page=${page}`
  );
  if (!resp.ok) {
    console.log("error");
    break;
  }
  const data = await resp.json();

  list.push(...data);
}

console.log(list.length);

// remove duplicates

const seen = new Set();
const newList = list.filter((el) => {
  const duplicate = seen.has(el.id);
  seen.add(el.id);
  return !duplicate;
});

const promises = newList.map(async (product, i) => {
  if (i > 21) {
    return;
  }
  if (!product.images[0]?.src || !product.slug) {
    return;
  }

  const img = await fetch(product.images[0]?.src);
  if (!img.ok) {
    return product;
  }
  const contentType = img.headers.get("content-type");
  console.log("content type : ", contentType);

  const imgBuffer = await img.arrayBuffer();
  let imgBase64 = Buffer.from(imgBuffer).toString("base64");
  if (!contentType.includes("avif")) {
    const jpgBuffer = await sharp(imgBuffer).jpeg().toBuffer();

    // Convert the .jpg buffer to base64
    imgBase64 = jpgBuffer.toString("base64");
  }
  console.log("done");
  console.log("product : ", product.slug);
  console.log("image : ", imgBase64);

  const resppp = await client.data
    .creator()
    .withClassName("Images")
    .withProperties({
      image: imgBase64,
      text: product.slug,
    })
    .do();

  console.log("done1 : ", resppp);
  console.log("done2\n");
});

await Promise.all(promises);

console.log("length list : ", newList.length);
