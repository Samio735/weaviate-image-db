import weaviate from "weaviate-ts-client";
import { readDirSync } from "fs";
const client = weaviate.client({
  scheme: "http",
  host: "localhost:8080",
});
let i = 0;
for (const img of readDirSync("./img")) {
  const b64 = Buffer.from(img).toString("base64");

  await client.data
    .creator()
    .withClassName("Images")
    .withProperties({
      image: b64,
      text: "Image " + i,
    })
    .do();
  i++;
}
