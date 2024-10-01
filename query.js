import { readFileSync, writeFileSync } from "fs";
import weaviate from "weaviate-client";
import sharp from "sharp";

// Convert .avif to .jpg
const avifBuffer = readFileSync(
  "./461718068_2029650090786594_9194112910550426398_n.webp"
);

async function convertAndSearchImage() {
  try {
    // Convert .avif to .jpg using sharp
    const jpgBuffer = await sharp(avifBuffer).jpeg().toBuffer();

    // Convert the .jpg buffer to base64
    const base64Image = jpgBuffer.toString("base64");

    // Weaviate client setup
    const client = await weaviate.connectToLocal();
    const images = client.collections.get("Images");

    // Perform image search in Weaviate
    const result = await images.query.nearImage(jpgBuffer, {
      returnProperties: ["text"],
      limit: 4,
    });

    console.log(JSON.stringify(result.objects, null, 2));
  } catch (error) {
    console.error("Error during image conversion or search:", error);
  }
}

// Run the conversion and search function
convertAndSearchImage();
