import * as fs from "fs/promises";
import * as path from "path";

/**
 * Recursively reads a directory and returns its structure in an ASCII representation.
 * @param {string} dirPath - The relative path to the directory.
 * @param {string} prefix - The prefix for the current directory level (used for formatting).
 * @returns {Promise<string>} - The ASCII representation of the directory structure.
 */
export async function readDirectoryStructure(
  dirPath: string,
  prefix: string = ""
): Promise<string> {
  let structure = "";
  const items = await fs.readdir(dirPath, { withFileTypes: true });

  for (const [index, item] of items.entries()) {
    const isLastItem = index === items.length - 1;
    const newPrefix = prefix + (isLastItem ? "└── " : "├── ");
    structure += `${prefix}${newPrefix}${item.name}\n`;

    if (item.isDirectory()) {
      const childPrefix = prefix + (isLastItem ? "    " : "│   ");
      structure += await readDirectoryStructure(
        path.join(dirPath, item.name),
        childPrefix
      );
    }
  }

  return structure;
}
