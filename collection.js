import weaviate from "weaviate-client";
import sharp from "sharp";

const client = await weaviate.connectToLocal();

// console.log(client);

const images = client.collections.get("Images");

const result = await images.query.fetchObjects();

console.log(JSON.stringify(result, null, 2).length);
client.close();
