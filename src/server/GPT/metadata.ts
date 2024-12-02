import fs from "fs/promises";
import { zodResponseFormat } from "openai/helpers/zod";
import path from "path";
import type { z } from "zod";
import type { FilesOfInterestSchema } from "./filesOfInterest";
import { openai } from "./openai";
import { dublinCoreSchema, type DublinCoreMetadata } from "./schema";

/**
 * Generates DCMI metadata for the dataset using OpenAI's GPT model.
 * @param dirPath - The relative path to the directory.
 * @param filesOfInterest - List of files of interest with reasons.
 * @param dirStructure - The directory structure as a string.
 * @returns The generated DCMI metadata.
 */
export async function _generateDCMIMetadata(
  dirPath: string,
  filesOfInterest: z.infer<typeof FilesOfInterestSchema>,
  dirStructure: string
): Promise<DublinCoreMetadata> {
  let fileExcerpts = "";

  for (const file of filesOfInterest) {
    const filePath = path.join(dirPath, file.file);

    // If the file doesn't exist, skip it
    try {
      await fs.access(filePath);
    } catch (error) {
      console.log(`File not found: ${filePath}`);
      continue;
    }

    console.log(`Reading file: ${filePath}`);
    const content = await fs.readFile(filePath, "utf-8");

    // Ascii only
    // Replace all whitespace with a single space
    const clearedContent = content
      .replace(/[^\x00-\x7F]/g, "")
      .replace(/\s+/g, " ");

    // Take 1000 characters or less
    const EXCERPT_LENGTH = 1000;
    const excerpt =
      clearedContent.length > EXCERPT_LENGTH
        ? clearedContent.substring(0, EXCERPT_LENGTH)
        : clearedContent;

    fileExcerpts += `File: ${file.file}\nExcerpt:\n${excerpt}\nReason: ${file.reason}\n\n`;
  }

  const prompt = `
Based on the previously identified files of interest, here is the directory structure along with the first 400 characters of each relevant file's content:
  
Directory Structure:
${dirStructure}

Files of Interest:
${fileExcerpts}
  
Using this information, generate Dublin Core Metadata Initiative (DCMI) metadata for this dataset. Ensure that each metadata element accurately reflects the content and context of the files. If certain metadata elements cannot be determined from the provided information, please indicate them as "Not Available."
  `;

  console.log("Prompt:", prompt);

  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: zodResponseFormat(dublinCoreSchema, "dcmi_metadata"),
  });

  const response = completion.choices[0].message;

  // If the model refuses to respond, you will get a refusal message
  if (response.refusal) {
    console.log(response.refusal);
    console.log(`Prompt: ${prompt}, Response: ${response.content}`);
    return {
      title: "Not Available",
    };
  }

  return (
    response.parsed || {
      title: "Not Available",
    }
  );
}
