import { readFileSync, writeFileSync } from "fs";
import weaviate from "weaviate-ts-client";
import sharp from "sharp";

// Convert .avif to .jpg
const avifBuffer = readFileSync("./adrun-noir_1.avif");

async function convertAndSearchImage() {
  try {
    // Convert .avif to .jpg using sharp
    const jpgBuffer = await sharp(avifBuffer).jpeg().toBuffer();

    // Convert the .jpg buffer to base64
    const base64Image = jpgBuffer.toString("base64");

    // Weaviate client setup
    const client = weaviate.client({
      scheme: "http",
      host: "localhost:8080",
    });

    // Perform image search in Weaviate
    const resImage = await client.graphql
      .get()
      .withClassName("Images")
      .withFields(["image"])
      .withNearImage({ image: base64Image }) // Use the base64 encoded .jpg image
      .withLimit(1)
      .do();

    // Retrieve and decode the result
    const resultImage = resImage.data.Get.Images[0].image;

    // Write the result back to a .jpg file
    writeFileSync("./result.jpg", resultImage, "base64");
    console.log(
      "Image search and conversion completed. Result saved as result.jpg"
    );
  } catch (error) {
    console.error("Error during image conversion or search:", error);
  }
}

// Run the conversion and search function
convertAndSearchImage();
