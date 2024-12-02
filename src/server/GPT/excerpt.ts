import fs from "fs-extra";
import path from "path";

/**
 * Recursively searches for a file in a directory and its subdirectories.
 * If the filePath includes directory components, it will navigate through those directories.
 * @param baseDir - The base directory to start the search.
 * @param relativePath - The relative path of the target file, potentially with nested directories.
 * @returns The full path of the file if found; otherwise, null.
 */
async function findFileRecursively(
  baseDir: string,
  relativePath: string
): Promise<string | null> {
  const segments = relativePath.split(path.sep); // Split the relative path into segments
  const currentSegment = segments.shift(); // Get the first segment

  if (!currentSegment) {
    return null; // No segments left, end of recursion
  }

  const currentPath = path.join(baseDir, currentSegment);

  // Check if the current segment is a directory
  if (await fs.pathExists(currentPath)) {
    const stats = await fs.stat(currentPath);

    if (stats.isDirectory()) {
      // Recurse into the directory with the remaining path segments
      return await findFileRecursively(currentPath, segments.join(path.sep));
    } else if (stats.isFile() && segments.length === 0) {
      // File found, and there are no more path segments
      return currentPath;
    }
  }

  // If the current path does not exist or is not a match, return null
  return null;
}

/**
 * Generates an excerpt from a specified file within a directory or its subdirectories.
 * @param dirPath - The root directory to start the search.
 * @param filePath - The relative path of the file to generate an excerpt from.
 * @returns An object containing the file path, its excerpt, and the reason, or null if the file is not found.
 */
export async function generateFileExcerpt(dirPath: string, filePath: string) {
  const foundFilePath = await findFileRecursively(dirPath, filePath);

  if (!foundFilePath) {
    console.log(`File not found: ${filePath}`);
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

async function summarizeFileExcerpts(
  excerptObjects: {
    file: string;
    excerpt: string;
    reason: string;
  }[]
) {
  // Construct the File Excerpts section from the excerpt objects
  let fileExcerptsText = "";

  for (const excerpt of excerptObjects) {
    fileExcerptsText += `
  File: ${excerpt.file}
  Excerpt: ${excerpt.excerpt}
  Reason: ${excerpt.reason}
  `;
  }

  // Create the summarization prompt
  const summarizationPrompt = `
  Based on the following file excerpts, please summarize the key information, highlighting agriculture-related data. Use AGROVOC terms where appropriate. The summary should be in free-form text.
  
  File Excerpts:
  ${fileExcerptsText}
  `;

  console.log("Summarization Prompt:", summarizationPrompt);

  // Call the OpenAI API to get the summary
  const summaryResponse = await openai.beta.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: summarizationPrompt }],
  });

  const summary = summaryResponse.choices[0].message.content;

  console.log("Summary:", summary);

  return summary;
}
