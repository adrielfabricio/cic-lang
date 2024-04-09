import { stateTransitions } from "./states";
import { State, Token, Transition } from "../types/types";
import {
  writeErrorsToFile,
  writeTokenToFile,
  writeTokenUsageToFile,
} from "../utils/files";

/**
 * Classe que representa um autômato finito determinístico para reconhecimento de tokens.
 */
class Automaton {
  private currentState: State = "q0";
  private token: Token = Token.UNKNOWN;
  private currentRow: number = 1;
  private currentCol: number = 1;
  private currentValue: string = "";
  private tokenUsageCount: { [key in Token]?: number } = {};
  private errors: string[] = [];

  /**
   * Reinicia o autômato para o estado inicial.
   */
  public reset(): void {
    this.currentState = "q0";
    this.token = Token.UNKNOWN;
    this.currentRow = 1;
    this.currentCol = 1;
    this.currentValue = "";
    this.tokenUsageCount = {};
  }

  /**
   * Processa a entrada de caracteres e reconhece os tokens correspondentes.
   * @param input A entrada a ser processada
   * @returns O token reconhecido
   */
  public processInput(input: string): Token {
    this.reset();
    let lastRecognizedToken: Token = Token.UNKNOWN;

    for (const char of input) {
      if (char === "\n") {
        this.currentRow++;
        this.currentCol = 1;
      } else {
        this.currentCol++;
        this.currentValue += char;
      }

      const transition = stateTransitions[this.currentState](char);
      this.currentState = transition.nextState;

      // Se um token foi reconhecido (diferente de UNKNOWN) e é diferente do último token reconhecido,
      // atualize a contagem de uso do token
      if (
        transition.token !== Token.UNKNOWN &&
        transition.token !== lastRecognizedToken
      ) {
        this.token = transition.token;
        lastRecognizedToken = transition.token;
        this.tokenUsageCount[this.token] =
          (this.tokenUsageCount[this.token] || 0) + 1;
      }
    }

    if (this.token === Token.TK_ID && this.currentState !== "q5") {
      this.token = Token.UNKNOWN;
      this.currentValue = "";
    }

    if (this.errors.length > 0) {
      writeErrorsToFile(this.errors);
    }

    if (this.token !== Token.UNKNOWN) {
      writeTokenToFile({
        row: this.currentRow,
        col: this.currentCol,
        token: this.token,
        value: this.currentValue,
      });
    }

    writeTokenUsageToFile(this.tokenUsageCount);

    return this.token;
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
