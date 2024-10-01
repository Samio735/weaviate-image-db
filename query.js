import { readFileSync, writeFileSync } from "fs";
import weaviate from "weaviate-client";
import sharp from "sharp";

// Convert .avif to .jpg
const avifBuffer = readFileSync("./adrun-noir_1.avif");

async function convertAndSearchImage() {
  try {
    // Convert .avif to .jpg using sharp
    const jpgBuffer = await sharp(avifBuffer).jpeg().toBuffer();

    // save the .jpg buffer to disk
    writeFileSync("./adrun-noir_1.jpg", jpgBuffer);

    const jpgBuffer2 = readFileSync("./adrun-noir_1.jpg");

    // Convert the .jpg buffer to base64
    const base64Image = jpgBuffer.toString("base64");

    // Weaviate client setup
    const client = await weaviate.connectToLocal();
    const images = client.collections.get("Images");

    // Perform image search in Weaviate
    const result = await images.query.nearImage(jpgBuffer, {
      returnProperties: ["text"],
      limit: 20,
    });

    console.log(JSON.stringify(result.objects, null, 2));
  } catch (error) {
    console.error("Error during image conversion or search:", error);
  }
}

// Run the conversion and search function
convertAndSearchImage();
