// files constants
export const ROOT_DIR = process.cwd();
export const TOKEN_FILE_TABLE_DIMENSIONS = {
  row: 9,
  col: 9,
  token: 16,
  lexeme: 25,
};
export const TOKEN_USAGE_FILE_TABLE_DIMENSIONS = {
  token: 16,
  use: 5,
};
export const TOKEN_FILE_SEPARATOR = `+${"-".repeat(
  TOKEN_FILE_TABLE_DIMENSIONS.row
)}+${"-".repeat(TOKEN_FILE_TABLE_DIMENSIONS.col)}+${"-".repeat(
  TOKEN_FILE_TABLE_DIMENSIONS.token
)}+${"-".repeat(TOKEN_FILE_TABLE_DIMENSIONS.lexeme)}+\n`;

export const TOKEN_USAGE_FILE_SEPARATOR = `+${"-".repeat(
  TOKEN_USAGE_FILE_TABLE_DIMENSIONS.token
)}+${"-".repeat(TOKEN_USAGE_FILE_TABLE_DIMENSIONS.use)}+\n`;
