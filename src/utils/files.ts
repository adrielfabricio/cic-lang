import { appendFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { join, resolve } from "path";

import {
  ROOT_DIR,
  TOKEN_FILE_TABLE_DIMENSIONS,
  TOKEN_FILE_SEPARATOR,
  TOKEN_USAGE_FILE_SEPARATOR,
  TOKEN_USAGE_FILE_TABLE_DIMENSIONS,
} from "../config/constants";
import { TokenEnum } from "./enums";

/**
 * Centraliza uma string em uma largura específica.
 *
 * @param {string} str - A string a ser centralizada.
 * @param {number} width - A largura desejada da string centralizada.
 * @returns {string} - A string centralizada na largura especificada.
 */
function centerString(str: string, width: number): string {
  str = str.toString();
  let spaceOnEachSide = width - str.length;

  if (spaceOnEachSide <= 0) {
    return str.substring(0, width); // Trim string if it's longer than width
  }

  const padStart = Math.floor(spaceOnEachSide / 2) + str.length;
  return str.padStart(padStart).padEnd(width);
}

/**
 * Inicializa os arquivos de saída.
 */
export function initializeOutputFiles() {
  const outputPath = resolve(ROOT_DIR, "outputs");
  const tokenListOutput = join(outputPath, "token_list.txt");
  const tokenUsageOutput = join(outputPath, "token_usage.txt");
  const errorOutput = join(outputPath, "error.txt");

  if (!existsSync(outputPath)) {
    mkdirSync(outputPath, { recursive: true });
  }

  const tokenListHeader =
    TOKEN_FILE_SEPARATOR +
    `|${centerString("LIN", TOKEN_FILE_TABLE_DIMENSIONS.row)}|${centerString(
      "COL",
      TOKEN_FILE_TABLE_DIMENSIONS.col
    )}|${centerString(
      "TOKEN",
      TOKEN_FILE_TABLE_DIMENSIONS.token
    )}|${centerString("LEXEMA", TOKEN_FILE_TABLE_DIMENSIONS.lexeme)}|\n` +
    TOKEN_FILE_SEPARATOR;

  const tokenUsageHeader =
    TOKEN_USAGE_FILE_SEPARATOR +
    `|${centerString(
      "TOKEN",
      TOKEN_USAGE_FILE_TABLE_DIMENSIONS.token
    )}|${centerString("USO", TOKEN_USAGE_FILE_TABLE_DIMENSIONS.use)}|\n` +
    TOKEN_USAGE_FILE_SEPARATOR;

  writeFileSync(tokenListOutput, tokenListHeader, {
    encoding: "utf-8",
    flag: "w",
  });
  writeFileSync(tokenUsageOutput, tokenUsageHeader, {
    encoding: "utf-8",
    flag: "w",
  });
  writeFileSync(errorOutput, "", { encoding: "utf-8", flag: "w" });
}

/**
 * Escreve um token no arquivo de saída.
 * @param {Object} payload - Os dados do token a serem escritos.
 * @param {number} payload.row - O número da linha.
 * @param {number} payload.col - O número da coluna.
 * @param {string} payload.token - O tipo de token.
 * @param {string} payload.value - O valor do token.
 */
export function writeTokenToFile(payload: {
  row: number;
  col: number;
  token: string;
  value: string;
}) {
  const { row, col, token, value } = payload;
  const tokenData =
    `|${centerString(
      row.toString(),
      TOKEN_FILE_TABLE_DIMENSIONS.row
    )}|${centerString(
      col.toString(),
      TOKEN_FILE_TABLE_DIMENSIONS.col
    )}|${centerString(token, TOKEN_FILE_TABLE_DIMENSIONS.token)}|${centerString(
      value,
      TOKEN_FILE_TABLE_DIMENSIONS.lexeme
    )}|\n` + TOKEN_FILE_SEPARATOR;

  appendFileSync(join(ROOT_DIR, "outputs", "token_list.txt"), tokenData, {
    encoding: "utf-8",
  });
}

/**
 * Escreve a contagem de uso de cada token em um arquivo de saída.
 * @param tokenUsage A contagem de uso de cada token.
 */
export function writeTokenUsageToFile(tokenUsage: { [key: string]: string }) {
  const outputPath = resolve(ROOT_DIR, "outputs");
  // Convert tokenUsage to an array of [token, count] pairs
  const entries = Object.entries(tokenUsage);
  // Sort the entries by count, in descending order
  entries.sort((a, b) => parseInt(b[1]) - parseInt(a[1]));

  let data = "";
  for (const [token, count] of entries) {
    data +=
      `|${centerString(
        token,
        TOKEN_USAGE_FILE_TABLE_DIMENSIONS.token
      )}|${centerString(
        count.toString(),
        TOKEN_USAGE_FILE_TABLE_DIMENSIONS.use
      )}|\n` + TOKEN_USAGE_FILE_SEPARATOR;
  }

  if (!existsSync(outputPath)) mkdirSync(outputPath, { recursive: true });
  appendFileSync(join(outputPath, "token_usage.txt"), data, {
    encoding: "utf-8",
  });
}

/**
 * Escreve as mensagens de erro no arquivo error.txt.
 * @param errors Array de mensagens de erro para serem escritas no arquivo.
 */
export function writeErrorsToFile(errors: string[]): void {
  const outputPath = resolve(ROOT_DIR, "outputs");
  const errorContent = errors.join("\n");

  appendFileSync(join(outputPath, "error.txt"), errorContent, {
    encoding: "utf-8",
  });
}

/**
 * Escreve um erro específico no arquivo error.txt.
 * @param errorDetails Detalhes do erro a serem escritos no arquivo.
 */
export function writeErrorToFile(errorDetails: {
  message: string;
  row: number;
  col: number;
  codeLine: string;
}): void {
  const outputPath = resolve(ROOT_DIR, "outputs");
  let errorString = `[${errorDetails.row}] ${errorDetails.codeLine}\n`;
  errorString +=
    `${" ".repeat(`[${errorDetails.row}]`.length)}${"-".repeat(
      errorDetails.col < 0 ? 1 : errorDetails.col
    )}` +
    "^" +
    "\n";
  errorString += `Erro linha ${errorDetails.row} coluna ${errorDetails.col}: ${errorDetails.message}\n`;

  appendFileSync(join(outputPath, "error.txt"), errorString, {
    encoding: "utf-8",
  });
}
