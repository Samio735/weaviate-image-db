import { readdirSync, readFileSync } from "fs";
import weaviate from "weaviate-ts-client";

// Create a Weaviate client instance
const client = weaviate.client({
  scheme: "http",
  host: "localhost:8080",
});

let i = 0;
const imageDir = "./img";

// Loop through all the files in the directory
for (const imgFileName of readdirSync(imageDir)) {
  const imgPath = `${imageDir}/${imgFileName}`;
  // Read the image file and convert it to base64
  const imgBuffer = readFileSync(imgPath);
  const b64 = imgBuffer.toString("base64");

  // Create an object in Weaviate with the image data
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
