import { Error, Token } from "../types/types";
import {
  writeErrorToFile,
  writeTokenToFile,
  writeTokenUsageToFile,
} from "../utils/files";

/**
 * Classe que representa um analisador léxico.
 */
class Lexer {
  // A lista de tokens reconhecidos
  private tokens: Array<Token> = [];
  // O token atual
  private token: string = "";
  // O número da linha atual
  private currentRow: number = 0;
  // O número da coluna atual
  private currentCol: number = 0;
  // A linha de código atual
  private currentCodeLine: string = "";
  // O número de vezes que cada token foi utilizado
  private tokenUsageCount: { [key: string]: string } = {};
  // A lista de erros
  private errors: Array<Error> = [];

  // Palavras reservadas
  private static RESERVED_WORDS: { [key: string]: string } = {
    rotina: "TK_ROUTINE",
    fim_rotina: "TK_END_ROUTINE",
    se: "TK_IF",
    senao: "TK_ELSE",
    imprima: "TK_PRINT",
    leia: "TK_READ",
    para: "TK_FOR",
    enquanto: "TK_WHILE",
  };

  // Operadores
  private static OPERATORS: { [key: string]: string } = {
    "+": "TK_PLUS",
    "-": "TK_MINUS",
    "*": "TK_STAR",
    "%": "TK_PERCENT",
    "&": "TK_AND",
    "|": "TK_OR",
    "~": "TK_NOT",
    "<": "TK_LESS",
    ">": "TK_GREATER",
    "==": "TK_EQUAL",
    "<=": "TK_LEQUAL",
    ">=": "TK_GEQUAL",
    "<==": "TK_ASSIGN",
    "<>": "TK_NEQUAL",
  };

  // Delimitadores
  private static DELIMITERS: { [key: string]: string } = {
    "(": "TK_LPAREN",
    ")": "TK_RPAREN",
    ":": "TK_COLON",
  };

  /**
   * Verifica se um token é um inteiro.
   * @param token O token a ser verificado
   * @returns true se o token for um inteiro, false caso contrário
   */
  private isInteger(token: string): boolean {
    for (let i = 0; i < token.length; i++) {
      if (!(token[i] >= "0" && token[i] <= "9")) {
        return false;
      }
    }
    return token.length > 0;
  }

  /**
   * Verifica se um token é um número de ponto flutuante.
   * @param token O token a ser verificado
   * @returns true se o token for um número de ponto flutuante, false caso contrário
   */
  private isFloat(token: string): boolean {
    let pointSeen = false;
    let eSeen = false;
    let digitCountBeforePoint = 0;
    let digitSeenAfterPoint = false;
    let inExponentPart = false;

    for (let i = 0; i < token.length; i++) {
      const char = token[i];

      if (char === ".") {
        if (pointSeen || eSeen) {
          // Não pode ter mais de um ponto ou ponto depois de 'e'
          return false;
        }
        pointSeen = true;
      } else if (char === "e") {
        if (eSeen || (!digitCountBeforePoint && !digitSeenAfterPoint)) {
          // 'e' deve vir depois de dígitos e apenas uma vez
          return false;
        }
        eSeen = true;
        inExponentPart = true;
        // Se o próximo caractere for '+' ou '-', apenas avance o índice
        if (
          i + 1 < token.length &&
          (token[i + 1] === "+" || token[i + 1] === "-")
        ) {
          i++;
        }
      } else if (this.isDigit(char)) {
        if (!eSeen) {
          if (!pointSeen) {
            digitCountBeforePoint++;
            if (digitCountBeforePoint > 3) {
              this.addError("Número de dígitos antes do ponto excedido");
              return false; // Não mais que 3 dígitos antes do ponto
            }
          } else {
            digitSeenAfterPoint = true;
          }
        }
      } else {
        return false; // Caracteres inválidos
      }
    }

    // Verifica se há pelo menos um dígito em posições válidas
    if (!digitCountBeforePoint && !digitSeenAfterPoint) {
      return false;
    }

    // Não pode terminar com 'e' ou ponto sem dígitos depois
    if (
      eSeen &&
      (token[token.length - 1] === "e" ||
        token[token.length - 1] === "E" ||
        token[token.length - 1] === "+" ||
        token[token.length - 1] === "-")
    ) {
      return false;
    }

    if (pointSeen && !digitSeenAfterPoint && token[token.length - 1] === ".") {
      return false; // Caso como "123." sem dígitos após o ponto
    }

    return true;
  }

  /**
   * Verifica se um token é um identificador.
   * @param token O token a ser verificado
   * @returns true se o token for um identificador, false caso contrário
   */
  private isIdentifier(token: string): boolean {
    if (token.length < 2 || !this.isAlpha(token[0])) {
      return false;
    }
    for (let i = 1; i < token.length; i++) {
      if (!this.isAlpha(token[i])) {
        this.addError("Caracteres inválidos em identificador");
        return false;
      }
    }
    return true;
  }

  /**
   * Verifica se um caractere é um dígito.
   * @param char O caractere a ser verificado
   * @returns true se o caractere for um dígito, false caso contrário
   */
  private isDigit(char: string): boolean {
    return "0" <= char && char <= "9";
  }

  /**
   * Verifica se um caractere é uma letra do alfabeto.
   * @param char O caractere a ser verificado
   * @returns true se o caractere for uma letra do alfabeto, false caso contrário
   */
  private isAlpha(char: string): boolean {
    return "a" <= char.toLowerCase() && char.toLowerCase() <= "z";
  }

  /**
   * Verifica se um caractere é um dígito hexadecimal.
   * @param char O caractere a ser verificado
   * @returns true se o caractere for um dígito hexadecimal, false caso contrário
   */
  private isHexDigit(char: string): boolean {
    return this.isDigit(char) || ("A" <= char && char <= "F");
  }

  /**
   * Verifica se um caractere é um operador ou delimitador.
   * @param char O caractere a ser verificado
   * @returns true se o caractere for um operador ou delimitador, false caso contrário
   */
  private isOperatorOrDelimiter(char: string): boolean {
    return (
      char.trim() === "" ||
      Object.keys(Lexer.OPERATORS).includes(char) ||
      Object.keys(Lexer.DELIMITERS).includes(char)
    );
  }

  /**
   * Verifica se um token é uma data no formato dd/mm/aaaa.
   * @param token O token a ser verificado
   * @returns true se o token for uma data, false caso contrário
   */
  private isDate(token: string): boolean {
    if (token.length !== 10) {
      return false;
    }
    // Verifica se os delimitadores estão nas posições corretas
    const delimiter = token[2]; // Assume o delimitador com base no terceiro caractere
    if ((delimiter !== "/" && delimiter !== "_") || token[5] !== delimiter) {
      this.addError("Delimitadores inconsistentes em data");
      return false;
    }
    // Verifica se todos os outros caracteres são dígitos
    for (let i = 0; i < token.length; i++) {
      if (i === 2 || i === 5) {
        continue; // Pula as posições dos delimitadores
      }
      if (!(token[i] >= "0" && token[i] <= "9")) {
        this.addError("Caracteres não numéricos em data");
        return false;
      }
    }
    return true; // Passou em todas as verificações
  }

  /**
   * Reconhece um token a partir de uma string.
   * @param token A string a ser reconhecida
   * @returns O token reconhecido ou null se a string não for um token válido
   */
  private tokenize(token: string): Token | null {
    if (token in Lexer.RESERVED_WORDS)
      return { type: Lexer.RESERVED_WORDS[token], value: "" };

    if (token in Lexer.OPERATORS)
      return { type: Lexer.OPERATORS[token], value: "" };

    if (token in Lexer.DELIMITERS)
      return { type: Lexer.DELIMITERS[token], value: "" };

    if (this.isInteger(token)) return { type: "TK_INT", value: token };

    if (this.isFloat(token)) return { type: "TK_FLOAT", value: token };

    if (token.startsWith("0x") && [...token.slice(2)].every(this.isHexDigit))
      return { type: "TK_END", value: token };

    if (token.startsWith('"') && token.endsWith('"'))
      return { type: "TK_CADEIA", value: token.slice(1, -1) };

    if (this.isIdentifier(token)) return { type: "TK_ID", value: token };

    if (this.isDate(token)) return { type: "TK_DATA", value: token };

    return null;
  }

  /**
   * Reinicia o autômato para o estado inicial.
   */
  public reset(): void {
    this.tokens = [];
    this.currentRow = 0;
    this.currentCol = 0;
    this.tokenUsageCount = {};
    this.token = "";
  }

  /**
   * Processa a entrada de caracteres e reconhece os tokens correspondentes.
   * @param text A entrada a ser processada
   * @returns A lista de tokens reconhecidos
   */
  public processInput(text: string): Token[] {
    this.token = "";
    this.currentRow = 1;
    this.currentCol = 0;

    let inString = false;
    let inComment = false;
    let inMultiLineComment = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      this.currentCol++;

      if (char === "\n") {
        if (inString) {
          this.addError("Cadeia não fechada");

          inString = false;
        }
        inComment = false;
        this.currentRow++;
        this.currentCol = 0;
        this.currentCodeLine = "";
        continue;
      } else {
        this.currentCol++;
        this.currentCodeLine += char;
      }

      if (inMultiLineComment) {
        if (text.substring(i, i + 3) === ">>>") {
          inMultiLineComment = false;
          i += 2; // Ajustar o índice para após o delimitador de fechamento
          this.currentCol += 2;
        }
        continue;
      }
      if (!inString && !inComment && text.substring(i, i + 3) === "<<<") {
        inMultiLineComment = true;
        i += 2; // Ajustar o índice para após o delimitador de abertura
        this.currentCol += 2;
        continue;
      }

      if (char === "#" && !inString && !inMultiLineComment) {
        inComment = true;
        continue;
      }

      if (inComment && char === "\n") {
        inComment = false; // Finalizar o comentário de linha única ao encontrar nova linha
      }

      if (!inComment && !inMultiLineComment) {
        if (char === '"' && !inString) {
          inString = true;
          this.token += char;
          continue;
        } else if (char === '"' && inString) {
          inString = false;
          this.token += char;
          const result = this.tokenize(this.token);
          if (result) this.recognizeToken(result);
          this.token = "";
          continue;
        }

        if (inString) {
          this.token += char;
        } else if (this.isOperatorOrDelimiter(char)) {
          if (this.token) {
            const result = this.tokenize(this.token);
            if (result) this.recognizeToken(result);
            this.token = "";
          }
          this.handleOperatorsAndDelimiters(char, i, text);
        } else {
          this.token += char;
        }

        if (
          !inString &&
          (char === " " || char === "\t" || this.isOperatorOrDelimiter(char))
        ) {
          if (this.token.length > 0) {
            const result = this.tokenize(this.token);
            if (result) this.recognizeToken(result);
            else this.addError("Token inválido");
            this.token = "";
          }
          continue;
        }
      }
    }

    if (this.token) {
      const result = this.tokenize(this.token);
      if (result) this.recognizeToken(result);
      else this.addError("Token inválido ao final do arquivo");
    }

    writeTokenUsageToFile(this.tokenUsageCount);
    return this.tokens;
  }

  /**
   * Reconhece um token e o armazena na lista de tokens.
   * @param token O token a ser reconhecido
   */
  private recognizeToken(token: Token): void {
    if (this.tokenUsageCount[token.type]) {
      this.tokenUsageCount[token.type] = (
        parseInt(this.tokenUsageCount[token.type]) + 1
      ).toString();
    } else {
      this.tokenUsageCount[token.type] = "1";
    }

    writeTokenToFile({
      token: token.type,
      value: token.value,
      row: this.currentRow,
      col: this.currentCol,
    });
    this.tokens.push(token);
  }

  /**
   * Adiciona um erro de análise léxica à lista de erros.
   * @param message A mensagem de erro
   * @param row O número da linha onde o erro ocorreu
   * @param col O número da coluna onde o erro ocorreu
   */
  private addError(message: string): void {
    this.errors.push({
      message,
      row: this.currentRow,
      col: this.currentCol,
      codeLine: this.currentCodeLine,
    });
    writeErrorToFile({
      message,
      row: this.currentRow,
      col: this.currentCol,
      codeLine: this.currentCodeLine,
    });
  }

  /**
   * Manipula operadores e delimitadores.
   * @param char O caractere a ser manipulado
   * @param i O índice do caractere na entrada
   * @param text A entrada a ser processada
   */
  private handleOperatorsAndDelimiters(
    char: string,
    i: number,
    text: string
  ): void {
    // Lookahead logic for operators like <==
    let lookahead = i + 1 < text.length ? text[i + 1] : "";
    let potentialToken = char + lookahead;

    if (Lexer.OPERATORS[potentialToken + "="]) {
      // Check for <==
      this.token = potentialToken + "=";
      i += 2; // Skip the next two characters
    } else if (Lexer.OPERATORS[potentialToken]) {
      // Check for <= or <>
      this.token = potentialToken;
      i += 1; // Skip the next character
    } else {
      this.token = char;
    }
    const result = this.tokenize(this.token);
    if (result) this.recognizeToken(result);

    this.token = "";
  }
}

export const lexer = new Lexer();
