import weaviate from "weaviate-ts-client";

const client = weaviate.client({
  scheme: "http",
  host: "localhost:8080",
});

async function clearAllContent() {
  try {
    // Get all class names
    const schema = await client.schema.getter().do();
    const classNames = schema.classes.map((c) => c.class);

    // Delete all objects from each class
    for (const className of classNames) {
      console.log(`Deleting all objects from class: ${className}`);
      await client.data
        .deleter()
        .withClassName(className)
        .withWhere({
          operator: "NotEqual",
          valueString: "placeholder_value_that_doesnt_exist",
          path: ["id"],
        })
        .do();
    }

    console.log("All content has been cleared from the database.");
  } catch (error) {
    console.error("Error clearing content:", error);
  }
}

clearAllContent();
