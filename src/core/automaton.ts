import { stateTransitions } from "./states";
import { Token } from "../types/types";
import { Error, State } from "../utils/enums";
import {
  writeErrorsToFile,
  writeTokenToFile,
  writeTokenUsageToFile,
} from "../utils/files";

/**
 * Classe que representa um autômato finito determinístico para reconhecimento de tokens.
 */
class Automaton {
  private previousState: State = State.Q0;
  private currentState: State = State.Q0;
  private token: Token = Token.UNKNOWN;
  private currentRow: number = 1;
  private currentCol: number = 1;
  private currentValue: string = "";
  private tokenUsageCount: { [key in Token]?: number } = {};
  private errors: string[] = [];
  private currentTokenValue: string = "";
  // buffers
  private rowBuffer: string = "";
  // error pointers
  public errorPointers: string[] = [];
  public errorMessages: string[] = [];
  private currentLine: string = "";
  private iterationWithError: boolean = false;

  /**
   * Reinicia o autômato para o estado inicial.
   */
  public reset(): void {
    this.previousState = State.Q0;
    this.currentState = State.Q0;
    this.token = Token.UNKNOWN;
    this.currentRow = 1;
    this.currentCol = 1;
    this.currentValue = "";
    this.tokenUsageCount = {};
    this.rowBuffer = "";
    this.errors = [];
    this.errorPointers = [];
    this.errorMessages = [];
    this.currentLine = "";
  }

  /**
   * Processa a entrada de caracteres e reconhece os tokens correspondentes.
   * @param input A entrada a ser processada
   * @returns O token reconhecido
   */
  public processInput(input: string): Token {
    this.reset();
    let lastRecognizedToken: Token = Token.UNKNOWN;
    let unrecognizedCharFlag: boolean = false;

    for (const char of input) {
      console.log("<><><><><>");
      this.iterationWithError = false;
      console.log(this.tokenUsageCount);
      this.rowBuffer += char;
      if (char === "\n" || char === " ") {
        this.processCurrentToken();
        if (char === "\n") this.resetForNewLine();
        if (char === " ") this.resetForBlankSpace();
      } else {
        this.currentCol++;
        this.currentValue += char;
        this.currentTokenValue += char;
      }

      if (
        unrecognizedCharFlag &&
        (this.rowBuffer.length > 3 ||
          (this.rowBuffer.length <= 2 && this.previousState === State.Q0))
      ) {
        this.setError(Error.UNRECOGNIZED_TOKEN);
        unrecognizedCharFlag = false;
      }

      const transition = stateTransitions[this.currentState](char);
      this.previousState = this.currentState;
      this.currentState = transition.nextState;
      console.log(transition);
      if (
        (this.currentState === State.Q4 && transition.nextState !== State.Q5) ||
        (this.previousState === State.Q4 && transition.nextState === State.Q0)
      ) {
        console.log("aqui");
        this.setError(Error.UNRECOGNIZED_TOKEN);
      }

      if (
        (this.previousState === State.Q3 ||
          this.previousState === State.Q4 ||
          this.previousState === State.Q5) &&
        this.currentState === State.Q0
      ) {
        this.token = transition.token;
        lastRecognizedToken = transition.token;
        unrecognizedCharFlag = false;
        console.log("1 if " + this.iterationWithError);
        this.setTokenUsageCount(this.token);
      } else if (transition.token !== Token.UNKNOWN) {
        this.token = transition.token;
      } else if (!unrecognizedCharFlag) {
        unrecognizedCharFlag = true;
      }
      console.log("<><><><><>\n");
    }

    if (this.currentState === State.Q3) {
      console.log("2 if " + this.iterationWithError);
      this.setTokenUsageCount(Token.TK_END);
    } else if (
      this.currentState === State.Q4 ||
      this.currentState === State.Q5
    ) {
      console.log("3 if " + this.iterationWithError);
      this.setTokenUsageCount(Token.TK_ID);
    }
    this.processCurrentToken();

    if (unrecognizedCharFlag) this.setError(Error.UNRECOGNIZED_TOKEN);
    this.finalizeErrors();

    if (this.errors.length > 0) writeErrorsToFile(this.errors);

    writeTokenUsageToFile(this.tokenUsageCount);
    return this.token;
  }

  private setError(error: Error): void {
    this.iterationWithError = true;
    const errorPointer = `    ${"-".repeat(this.currentCol - 2)}^`;
    const errorMessage = `Erro na linha ${this.currentRow} coluna ${this.currentCol}: ${error}`;

    this.errorPointers.push(errorPointer);
    this.errorMessages.push(errorMessage);

    if (
      this.token === Token.UNKNOWN &&
      this.currentLine !== `[${this.currentRow}]`
    ) {
      if (this.currentLine !== "") {
        this.errors.push(
          this.currentLine,
          ...this.errorPointers,
          ...this.errorMessages
        );
        this.errorPointers = [];
        this.errorMessages = [];
      }
      this.currentLine = `[${this.currentRow}]`;
    }
  }

  private finalizeErrors(): void {
    if (this.currentLine !== "") {
      this.errors.push(
        `${this.currentLine} ${this.rowBuffer}`,
        ...this.errorPointers,
        ...this.errorMessages
      );
    }
  }

  private resetForNewLine(): void {
    this.currentRow++;
    this.currentCol = 1;
    this.currentValue = "";
    this.rowBuffer = "";
    this.currentTokenValue = "";
    this.currentLine = "";
  }

  private resetForBlankSpace(): void {
    this.currentCol++;
    this.currentValue = "";
    this.currentTokenValue = "";
    this.rowBuffer = "";
  }

  private processCurrentToken(): void {
    if (!this.iterationWithError) {
      console.log(this.currentTokenValue);
      writeTokenToFile({
        row: this.currentRow,
        col: this.currentCol,
        token: this.token,
        value: this.currentTokenValue,
      });
    }
    this.currentTokenValue = "";
  }

  private setTokenUsageCount(token: Token): void {
    if (!this.iterationWithError) {
      this.tokenUsageCount[token] = (this.tokenUsageCount[token] || 0) + 1;
    }
  }

  /**
   * Obtém a posição atual do automato no input sendo processado.
   *
   * @returns Objeto com a linha (`row`) e coluna (`col`) atuais.
   */
  public getCurrentPosition(): { row: number; col: number } {
    return { row: this.currentRow, col: this.currentCol };
  }

  /**
   * Recupera a quantidade de usos de cada token.
   * @returns Objeto com a contagem de uso de cada token
   */
  public getTokenUsageCount(): { [key in Token]?: number } {
    return this.tokenUsageCount;
  }
}

export const automaton = new Automaton();
