import fs from "fs";
import path from "path";
import { automaton } from "./core/automaton";

// Retrieve the input file path from command line arguments
const inputFile = process.argv[2];

// Validate the input file path
if (!inputFile) {
  console.error("Please specify the input file path.");
  process.exit(1);
}

// Ensure the file has a .cic extension
if (path.extname(inputFile) !== ".cic") {
  console.error("The input file must have a .cic extension.");
  process.exit(1);
}

// Read the content of the input file
const inputContent = fs.readFileSync(inputFile, "utf8");

// Process the input content through the automaton
const token = automaton.processInput(inputContent);

// Output the identified token
console.log(`Identified token: ${token}`);

// Reset the automaton state for processing the next input
automaton.reset();
