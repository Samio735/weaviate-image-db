import { readFileSync, writeFileSync } from "fs";
import weaviate from "weaviate-ts-client";

const test = Buffer.from(readFileSync("./test.png")).toString("base64");

const resImage = await client.graphql
  .get()
  .withClassName("Images")
  .withFields(["image"])
  .withNearImage({ image: test })
  .withLimit(1)
  .do();

// Write result to filesystem
const result = resImage.data.Get.Images[0].image;
writeFileSync("./result.jpg", result, "base64");
