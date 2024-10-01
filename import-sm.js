import weaviate from "weaviate-ts-client";

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

const promises = list.map(async (product) => {
  if (!product.images[0]?.src) {
    return product;
  }
  const img = await fetch(product.images[0]?.src);
  if (!img.ok) {
    return product;
  }
  const imgBuffer = await img.arrayBuffer();
  const imgBase64 = Buffer.from(imgBuffer).toString("base64");
  console.log("done");
  await client.data
    .creator()
    .withClassName("Images")
    .withProperties({
      image: imgBase64,
      text: product.slug,
    })
    .do();
  console.log("done2\n");
});

await Promise.all(promises);

console.log(data.length);
