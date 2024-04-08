import * as fs from "fs";
import * as path from "path";
import { Token } from "../types/types";
import { ROOT_DIR, TABLE_DIMENSIONS } from "./constants";

const SEPARATOR = "+----------+----------+------------+-------------+\n";

// Function to center a string within a fixed width
function centerString(str: string, width: number) {
  str = str.toString();
  let spaceOnEachSide = width - str.length;

  if (spaceOnEachSide <= 0) {
    return str.substring(0, width); // Trim string if it's longer than width
  }

  const padStart = Math.floor(spaceOnEachSide / 2) + str.length;
  return str.padStart(padStart).padEnd(width);
}

// Function to initialize the output file with a centered header
export function initializeOutputFile() {
  const outputPath = path.resolve(ROOT_DIR, "outputs");
  const outputFile = path.join(outputPath, "token_list.txt");
  const headers =
    SEPARATOR +
    `|${centerString("LIN", TABLE_DIMENSIONS.row)}|${centerString(
      "COL",
      TABLE_DIMENSIONS.col
    )}|${centerString("TOKEN", TABLE_DIMENSIONS.token)}|${centerString(
      "LEXEMA",
      TABLE_DIMENSIONS.lexeme
    )}|\n` +
    SEPARATOR;

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  if (!fs.existsSync(outputFile)) {
    fs.writeFileSync(outputFile, headers, { encoding: "utf-8" });
  }
}

// Function to write a token to the output file with centered content
export function writeTokenToFile(payload: {
  row: number;
  col: number;
  token: Token;
  value: string;
}) {
  const { row, col, token, value } = payload;
  const tokenData =
    `|${centerString(row.toString(), TABLE_DIMENSIONS.row)}|${centerString(
      col.toString(),
      TABLE_DIMENSIONS.col
    )}|${centerString(token, TABLE_DIMENSIONS.token)}|${centerString(
      value,
      TABLE_DIMENSIONS.lexeme
    )}|\n` + SEPARATOR;

  fs.appendFileSync(
    path.join(ROOT_DIR, "outputs", "token_list.txt"),
    tokenData,
    { encoding: "utf-8" }
  );
}
