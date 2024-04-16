import { stateTransitions } from "./states";
import { Error, State, Token } from "../utils/enums";
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
  private currentTokenValue: string = "";
  // buffers
  private rowBuffer: string = "";
  // error
  private errors: string[] = [];
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
    this.iterationWithError = false;
    this.currentTokenValue = "";
  }

  /**
   * Processa a entrada de caracteres e reconhece os tokens correspondentes.
   * @param input A entrada a ser processada
   * @returns O token reconhecido
   */
  public processInput(input: string): Token {
    this.reset();
    let unrecognizedCharFlag: boolean = false;

    for (const char of input) {
      this.iterationWithError = false;
      this.rowBuffer += char;

      if (this.rowBuffer.includes("#") && char !== "\n") {
        continue;
      }

      if (char === "\n" || char === " ") {
        this.processCurrentToken();
        if (char === "\n") this.resetForNewLine();
        if (char === " ") this.resetForBlankSpace();
      } else {
        this.currentCol++;
        this.currentValue += char;
        this.currentTokenValue += char;
      }

      if (this.checkErrorState(unrecognizedCharFlag)) {
        this.setError(Error.UNRECOGNIZED_TOKEN);
        unrecognizedCharFlag = false;
      }

      if (char !== " ") {
        const transition = stateTransitions[this.currentState](char);
        this.previousState = this.currentState;
        this.currentState = transition.nextState;

        if (this.checkAcceptanceState()) {
          this.token = transition.token;
          unrecognizedCharFlag = false;
        } else if (transition.token !== Token.UNKNOWN) {
          this.token = transition.token;
        } else if (!unrecognizedCharFlag) {
          unrecognizedCharFlag = true;
        }
      }
    }

    this.processCurrentToken();
    this.finalizeErrors();
    if (this.errors.length > 0) writeErrorsToFile(this.errors);
    writeTokenUsageToFile(this.tokenUsageCount);
    return this.token;
  }

  private checkAcceptanceState(): boolean {
    return (
      this.currentState === State.Q0 &&
      (this.previousState === State.Q5 || // TK_INT
        this.previousState === State.Q10 || // TK_FLOAT
        this.previousState === State.Q14 || // TK_END
        this.previousState === State.Q18 || // TK_ID
        this.previousState === State.Q21) // TK_CADEIA
    );
  }

  private checkErrorState(unrecognizedCharFlag: boolean): boolean {
    return (
      unrecognizedCharFlag &&
      (this.rowBuffer.length > 3 ||
        (this.rowBuffer.length <= 2 && this.previousState === State.Q0))
    );
  }

  /**
   * Define um erro ocorrido durante o processamento do arquivo.
   * @param {Error} error - O objeto de erro ocorrido.
   */
  private setError(error: Error): void {
    this.iterationWithError = true;
    const formatter = this.currentCol - 2 < 0 ? 0 : this.currentCol - 2;
    const errorPointer = `    ${"-".repeat(formatter)}^`;
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

  /**
   * Finaliza a lista de erros acumulados.
   */
  private finalizeErrors(): void {
    if (this.currentLine !== "") {
      this.errors.push(
        `${this.currentLine} ${this.rowBuffer}`,
        ...this.errorPointers,
        ...this.errorMessages
      );
    }
  }

  /**
   * Reseta os valores para uma nova linha.
   */
  private resetForNewLine(): void {
    this.currentRow++;
    this.currentCol = 1;
    this.currentValue = "";
    this.rowBuffer = "";
    this.currentTokenValue = "";
    this.currentLine = "";
  }

  /**
   * Reseta os valores para um espaço em branco.
   */
  private resetForBlankSpace(): void {
    this.currentCol++;
    this.currentValue = "";
    this.currentTokenValue = "";
  }

  /**
   * Processa o token atual.
   */
  private processCurrentToken(): void {
    if (!this.iterationWithError && !(this.token === Token.UNKNOWN)) {
      this.setTokenUsageCount(this.token);
      writeTokenToFile({
        row: this.currentRow,
        col: this.currentCol,
        token: this.token,
        value: this.currentTokenValue,
      });
    }
    this.currentTokenValue = "";
    this.previousState = State.Q0;
    this.currentState = State.Q0;
    this.token = Token.UNKNOWN;
  }

  /**
   * Define a contagem de uso do token.
   * @param token O token a ser contado.
   */
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
