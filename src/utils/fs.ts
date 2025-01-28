import fs from "fs";

export const readJsonFile = async <T>(path: string): Promise<T> => {
  try {
    const data = await fs.promises.readFile(path, "utf-8");
    return JSON.parse(data) as T;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }
};

// Function to write to a JSON file
export const writeJsonFile = async (
  path: string,
  data: object,
  merge?: boolean,
): Promise<void> => {
  try {
    let serealizableData = { ...data };
    if (merge) {
      const current = await readJsonFile<object>(path);
      serealizableData = { ...serealizableData, ...current };
    }
    const jsonString = JSON.stringify(serealizableData, null, 2); // Beautify JSON with 2 spaces
    await fs.promises.writeFile(path, jsonString, "utf-8");
    console.log("File successfully written!");
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }
};
