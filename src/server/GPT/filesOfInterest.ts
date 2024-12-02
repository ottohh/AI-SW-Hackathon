import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { openai } from "./openai";

const FileOfInterestSchema = z.object({
  file: z.string().describe("The relative path of the file."),
  reason: z.string().describe("The reason why this file is of interest."),
});

export const FilesOfInterestSchema = z.array(FileOfInterestSchema);

// Openai only accepts object schemas, so we need to wrap the array schema in an object schema
// and then extract the array from the response

const FilesOfInterestResponseSchema = z.object({
  files_of_interest: FilesOfInterestSchema,
});

/**
 * Analyzes the directory structure to identify files of interest using OpenAI's GPT model.
 * @param directoryStructure - The directory structure to analyze as a string.
 * @returns A list of files of interest with reasons.
 */
export async function identifyFilesOfInterest(
  directoryStructure: string
): Promise<z.infer<typeof FilesOfInterestSchema>> {
  const prompt = `
  You are an AI assistant tasked with analyzing the following directory structure to identify files that are likely to contain valuable information for metadata generation in their first 400 bytes of ascii. Consider factors such as file types, names, and typical content relevance. Please list the files of interest along with a brief explanation for each selection. List maximum 5 files and make sure the file paths are correct and work.
  
  Directory Structure:
  ${directoryStructure}
  `;

  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: zodResponseFormat(
      FilesOfInterestResponseSchema,
      "files_of_interest"
    ),
  });

  const response = completion.choices[0].message;
  // If the model refuses to respond, you will get a refusal message
  if (response.refusal) {
    console.log(response.refusal);
    console.log(`Prompt: ${prompt}, Response: ${response.content}`);
    return [];
  }

  return response.parsed?.files_of_interest || [];
}
