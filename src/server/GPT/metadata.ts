import { zodResponseFormat } from "openai/helpers/zod";
import type { z } from "zod";
import { generateFileExcerpt, summarizeFileExcerpts } from "./excerpt";
import type { FilesOfInterestSchema } from "./filesOfInterest";
import { openai } from "./openai";
import { dublinCoreSchema, type DublinCoreMetadata } from "./schema";

/**
 * Generates DCMI metadata for the dataset using OpenAI's GPT model.
 * @param dirPath - The relative path to the directory.
 * @param filesOfInterest - List of files of interest with reasons.
 * @param dirStructure - The directory structure as a string.
 * @param id - The ID of the dataset.
 * @returns The generated DCMI metadata.
 */
export async function _generateDCMIMetadata(
  dirPath: string,
  filesOfInterest: z.infer<typeof FilesOfInterestSchema>,
  dirStructure: string,
  id: string
): Promise<DublinCoreMetadata> {
  let fileExcerpts: {
    file: string;
    excerpt: string;
    reason: string;
  }[] = [];

  for (const file of filesOfInterest) {
    try {
      const excerpt = await generateFileExcerpt(dirPath, file.file);

      if (!excerpt) {
        console.log(`Error generating excerpt for file: ${file.file}`);
        continue;
      }

      fileExcerpts.push({
        file: excerpt.filePath,
        excerpt: excerpt.excerpt,
        reason: file.reason,
      });
    } catch (error) {
      console.error(
        `An error occurred while generating an excerpt for file: ${file.file}`,
        error
      );
      continue;
    }
  }

  const summaryOrFilesKeyInfo = await summarizeFileExcerpts(fileExcerpts);

  const prompt = `
Based on the previously identified files of interest, here is the directory structure along with the first 400 characters of each relevant file's content:
  
Directory Structure:
${dirStructure}

Files of Interest:
${fileExcerpts}

Summary:
${summaryOrFilesKeyInfo}
  
Using this information, generate Dublin Core Metadata Initiative (DCMI) metadata for this dataset. Ensure that each metadata element accurately reflects the content and context of the files. Use MIME types for the dc:format If certain metadata elements cannot be determined from the provided information, please indicate them as "Not Available."

dc:identifier: ${id}
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
