import fs from "fs-extra";
import path from "path";
import { openai } from "./openai";

/**
 * Finds a file in the directory tree that ends with the given relative path.
 * @param baseDir - The base directory to start the search.
 * @param relativePath - The relative path to search for.
 * @returns The full path to the file if found; otherwise, null.
 */
async function findFileByRelativePath(baseDir: string, relativePath: string) {
  let foundFile: string | null = null;

  const normalizedRelativePath = path.normalize(relativePath);

  async function searchDir(currentDir: string) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await searchDir(entryPath);
        if (foundFile) {
          return;
        }
      } else if (entry.isFile()) {
        const relPath = path.relative(baseDir, entryPath);
        const normalizedRelPath = path.normalize(relPath);
        if (normalizedRelPath.endsWith(normalizedRelativePath)) {
          foundFile = entryPath;
          return;
        }
      }
    }
  }

  await searchDir(baseDir);

  return foundFile;
}

/**
 * Generates an excerpt from a specified file within a directory or its subdirectories.
 * @param dirPath - The root directory to start the search.
 * @param filePath - The relative path of the file to generate an excerpt from.
 * @returns An object containing the file path, its excerpt, and the reason, or null if the file is not found.
 */
export async function generateFileExcerpt(dirPath: string, filePath: string) {
  const foundFilePath = await findFileByRelativePath(dirPath, filePath);

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

export async function summarizeFileExcerpts(
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
  const summaryResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: summarizationPrompt }],
  });

  const summary = summaryResponse.choices[0].message.content;

  console.log("Summary:", summary);

  return summary;
}
