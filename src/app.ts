import { existsSync, readFileSync } from "fs";
import { extname, join } from "path";
import { lexer } from "./core/lexer";
import { initializeOutputFiles } from "./utils/files";

// Retrieve the input file path from command line arguments
const inputFile = process.argv[2];

// Validate the input file path
if (!inputFile) {
  console.error("Please specify the input file path.");
  process.exit(1);
}

// Ensure the file has a .cic extension
if (extname(inputFile) !== ".cic") {
  console.error("The input file must have a .cic extension.");
  process.exit(1);
}

// Read the content of the input file
const inputContent = readFileSync(inputFile, "utf8");

// Check if the outputs/ directory exists, if not, initialize the output file
const outputDir = join(__dirname, "outputs");
if (!existsSync(outputDir)) initializeOutputFiles();

// Process the input content through the lexer
console.time("lexer.processInput");
lexer.processInput(inputContent);
console.timeEnd("lexer.processInput");

// Reset the lexer state for processing the next input
lexer.reset();
