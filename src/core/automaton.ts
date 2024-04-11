import { stateTransitions } from "./states";
import { Token, Transition } from "../types/types";
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
    this.errors = [];
    this.rowBuffer = "";
  }

  public setError(error: Error): void {
    const errorPointer = `    ${"-".repeat(this.currentCol - 2)}^`;
    const errorMessage = `Erro na linha ${this.currentRow} coluna ${this.currentCol}: ${error}`;

    this.errorPointers.push(errorPointer);
    this.errorMessages.push(errorMessage);

    if (this.currentLine !== `[${this.currentRow}]`) {
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

  public finalizeErrors(): void {
    if (this.currentLine !== "") {
      this.errors.push(
        `${this.currentLine} ${this.rowBuffer}`,
        ...this.errorPointers,
        ...this.errorMessages
      );
    }
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
      this.rowBuffer += char;
      if (char === "\n" || char === " ") {
        this.processCurrentToken();
        this.resetForNewLine();
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
      console.info(transition);

      // Se um token foi reconhecido (diferente de UNKNOWN) e é diferente do último token reconhecido,
      // atualize a contagem de uso do token
      if (
        (this.previousState === State.Q3 ||
          this.previousState === State.Q4 ||
          this.previousState === State.Q5) &&
        this.currentState === State.Q0
      ) {
        this.token = transition.token;
        lastRecognizedToken = transition.token;
        this.tokenUsageCount[this.token] =
          (this.tokenUsageCount[this.token] || 0) + 1;
        unrecognizedCharFlag = false;
      } else if (transition.token !== Token.UNKNOWN) {
        this.token = transition.token;
      } else if (!unrecognizedCharFlag) {
        unrecognizedCharFlag = true;
      }
    }

    if (this.currentState === State.Q3) {
      this.tokenUsageCount[Token.TK_END] =
        (this.tokenUsageCount[Token.TK_END] || 0) + 1;
    } else if (
      this.currentState === State.Q4 ||
      this.currentState === State.Q5
    ) {
      this.tokenUsageCount[Token.TK_ID] =
        (this.tokenUsageCount[Token.TK_ID] || 0) + 1;
    }

    this.processCurrentToken();

    if (unrecognizedCharFlag) this.setError(Error.UNRECOGNIZED_TOKEN);
    this.finalizeErrors();

    if (this.errors.length > 0) writeErrorsToFile(this.errors);

    writeTokenUsageToFile(this.tokenUsageCount);
    return this.token;
  }

  private resetForNewLine(): void {
    this.currentRow++;
    this.currentCol = 1;
    this.currentValue = "";
    this.rowBuffer = "";
    this.currentTokenValue = "";
  }

  private processCurrentToken(): void {
    writeTokenToFile({
      row: this.currentRow,
      col: this.currentCol,
      token: this.token,
      value: this.currentTokenValue,
    });
    this.currentTokenValue = "";
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
