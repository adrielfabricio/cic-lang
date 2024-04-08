// main.ts
import { automaton } from "./automaton";
import * as fs from "fs";
import * as path from "path";

const [, , inputFile] = process.argv;

if (!inputFile) {
  console.error("Por favor, especifique o caminho do arquivo de entrada.");
  process.exit(1);
}

if (path.extname(inputFile) !== ".cic") {
  console.error("O arquivo de entrada deve ter a extensão .cic");
  process.exit(1);
}

const inputContent = fs.readFileSync(inputFile, "utf8");
const token = automaton.processInput(inputContent);
console.log(`Token identificado: ${token}`);

automaton.reset(); // Reset the automaton state for the next input
