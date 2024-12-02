import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import { promisify } from "util";
import { identifyFilesOfInterest } from "./filesOfInterest";
import { _generateDCMIMetadata as generateDCMIMetadata } from "./metadata";
import { readDirectoryStructure } from "./readdir";

const execPromise = promisify(exec);

/**
 * Main function to process a ZIP file, extract its contents using the system's unzip command,
 * analyze the directory structure, identify files of interest, and generate DCMI metadata.
 * @param zipFilePath - The path to the ZIP file.
 * @param outputDir - The directory where the ZIP contents will be extracted.
 * @returns The generated DCMI metadata.
 */
export async function processZipFile(zipFilePath: string, id?: string) {
  try {
    // Ensure the output directory exists and create a unique subdirectory
    const outputId = Math.random().toString(36).substring(7);
    let outputDir = path.join(__dirname, "..", "data", "output");
    outputDir = path.join(outputDir, outputId);
    await fs.mkdir(outputDir, { recursive: true });

    // Sanitize the zip path for spaces
    zipFilePath = zipFilePath.replace(/ /g, "\\ ");

    // Construct the unzip command
    const unzipCommand = `unzip -o ${zipFilePath} -d ${outputDir}`;

    // Execute the unzip command
    await execPromise(unzipCommand);
    console.log(`Extracted ZIP file to ${outputDir}`);

    const directoryStructure = await readDirectoryStructure(outputDir);
    console.log("Directory Structure:", directoryStructure);

    // Identify files of interest
    const filesOfInterest = await identifyFilesOfInterest(directoryStructure);
    console.log("Files of Interest:", filesOfInterest);

    // Generate DCMI metadata
    const dcmiMetadata = await generateDCMIMetadata(
      outputDir,
      filesOfInterest,
      directoryStructure,
      id || ""
    );
    console.log("Generated DCMI Metadata:", dcmiMetadata);

    // Remove the extracted files
    await fs.rm(outputDir, { recursive: true });

    return dcmiMetadata;
  } catch (error) {
    console.error("An error occurred during processing:", error);
    throw error;
  }
}

const mainTest = async () => {
  const zip = "Challenge_C.zip";
  const zipPath = path.join(__dirname, "..", "data", zip);

  const data = await processZipFile(zipPath);
};

// mainTest();
