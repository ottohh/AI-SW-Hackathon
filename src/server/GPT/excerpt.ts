import fs from "fs/promises";
import path from "path";

/**
 * Recursively searches for a file in a directory and its subdirectories.
 * @param dir - The directory to search in.
 * @param filename - The name of the file to find.
 * @returns The full path of the file if found; otherwise, null.
 */
async function findFileRecursively(
  dir: string,
  filename: string
): Promise<string | null> {
  const items = await fs.readdir(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      const result = await findFileRecursively(fullPath, filename);
      if (result) return result;
    } else if (item.isFile() && item.name === filename) {
      return fullPath;
    }
  }

  return null;
}

/**
 * Generates an excerpt from a specified file within a directory or its subdirectories.
 * @param dirPath - The root directory to start the search.
 * @param filename - The name of the file to generate an excerpt from.
 * @returns An object containing the file path and its excerpt.
 */
export async function generateFileExcerpt(
  dirPath: string,
  filename: string
): Promise<{ filePath: string; excerpt: string } | null> {
  const segments = filename.split(path.sep);
  const targetFile = segments.pop();
  const targetDir = path.join(dirPath, ...segments);

  const foundFilePath = await findFileRecursively(targetDir, targetFile!);

  if (!foundFilePath) {
    console.log(`File not found: ${filename}`);
    return null;
  }

  console.log(`Reading file: ${foundFilePath}`);
  const content = await fs.readFile(foundFilePath, "utf-8");

  // Remove non-ASCII characters and replace whitespace sequences with a single space
  const clearedContent = content
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/\s+/g, " ");

  // Take the first 5000 characters or less
  const EXCERPT_LENGTH = 5000;
  const excerpt = clearedContent.slice(0, EXCERPT_LENGTH);

  return { filePath: foundFilePath, excerpt };
}
