import weaviate from "weaviate-ts-client";

const client = weaviate.client({
  scheme: "http",
  host: "localhost:8080",
});
const resp = await fetch(
  "https://www.stepmode.dz/wp-json/wc/store/products?per_page=100"
);

const data = await resp.json();

const promises = data.map(async (product) => {
  const img = await fetch(product.images[0]?.src);
  if (!img.ok) {
    return product;
  }
  const imgBuffer = await img.arrayBuffer();
  const imgBase64 = Buffer.from(imgBuffer).toString("base64");

  await client.data
    .creator()
    .withClassName("Images")
    .withProperties({
      image: imgBase64,
      text: "Image " + i,
    })
    .do();
});

await Promise.all(promises);

console.log(data.length);
