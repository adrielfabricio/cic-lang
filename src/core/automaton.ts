import { stateTransitions } from "./states";
import { ErrorEnum, StateEnum, TokenEnum } from "../utils/enums";
import {
  writeErrorsToFile,
  writeTokenToFile,
  writeTokenUsageToFile,
} from "../utils/files";
import { RESERVED_WORDS } from "../config/constants";

/**
 * Classe que representa um autômato finito determinístico para reconhecimento de tokens.
 */
class Automaton {
  private previousState: StateEnum = StateEnum.Q0;
  private currentState: StateEnum = StateEnum.Q0;
  private token: TokenEnum = TokenEnum.UNKNOWN;
  private currentRow: number = 1;
  private currentCol: number = 1;
  private currentValue: string = "";
  private tokenUsageCount: { [key: string]: number } = {};
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
    this.previousState = StateEnum.Q0;
    this.currentState = StateEnum.Q0;
    this.token = TokenEnum.UNKNOWN;
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
  public processInput(input: string): TokenEnum {
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

      if (RESERVED_WORDS.includes(this.rowBuffer)) {
        this.token = TokenEnum[`TK_${this.rowBuffer.toUpperCase()}`];
        continue;
      }

      if (this.checkErrorState(unrecognizedCharFlag)) {
        this.setError(ErrorEnum.UNRECOGNIZED_TOKEN);
        unrecognizedCharFlag = false;
      }

      if (char !== " ") {
        const transition = stateTransitions[this.currentState](char);
        this.previousState = this.currentState;
        this.currentState = transition.nextState;
        if (this.checkAcceptanceState()) {
          this.token = transition.token;
          unrecognizedCharFlag = false;
          console.log(transition.token);
        } else if (
          !unrecognizedCharFlag &&
          this.currentState !== StateEnum.Q30 &&
          this.currentState !== StateEnum.Q31 &&
          this.currentState !== StateEnum.Q32 &&
          this.currentState !== StateEnum.Q33 &&
          this.currentState !== StateEnum.Q34
        ) {
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
      this.currentState === StateEnum.Q0 &&
      (this.previousState === StateEnum.Q5 || // TK_INT
        this.previousState === StateEnum.Q10 || // TK_FLOAT
        this.previousState === StateEnum.Q14 || // TK_END
        this.previousState === StateEnum.Q18 || // TK_ID
        this.previousState === StateEnum.Q21 || // TK_CADEIA
        this.previousState === StateEnum.Q34) // TK_DATA
    );
  }

  private checkErrorState(unrecognizedCharFlag: boolean): boolean {
    return (
      unrecognizedCharFlag &&
      (this.rowBuffer.length > 3 ||
        (this.rowBuffer.length <= 2 && this.previousState === StateEnum.Q0))
    );
  }

  /**
   * Define um erro ocorrido durante o processamento do arquivo.
   * @param {ErrorEnum} error - O objeto de erro ocorrido.
   */
  private setError(error: ErrorEnum): void {
    this.iterationWithError = true;
    const formatter = this.currentCol - 2 < 0 ? 0 : this.currentCol - 2;
    const errorPointer = `    ${"-".repeat(formatter)}^`;
    const errorMessage = `Erro na linha ${this.currentRow} coluna ${this.currentCol}: ${error}`;

    this.errorPointers.push(errorPointer);
    this.errorMessages.push(errorMessage);

    if (
      this.token === TokenEnum.UNKNOWN &&
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
    if (!this.iterationWithError && !(this.token === TokenEnum.UNKNOWN)) {
      this.setTokenUsageCount(this.token);
      writeTokenToFile({
        row: this.currentRow,
        col: this.currentCol,
        token: this.token,
        value: this.currentTokenValue,
      });
    }
    this.currentTokenValue = "";
    this.previousState = StateEnum.Q0;
    this.currentState = StateEnum.Q0;
    this.token = TokenEnum.UNKNOWN;
  }

  /**
   * Define a contagem de uso do token.
   * @param token O token a ser contado.
   */
  private setTokenUsageCount(token: TokenEnum): void {
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
  public getTokenUsageCount(): { [key in TokenEnum]?: number } {
    return this.tokenUsageCount;
  }
}

export const automaton = new Automaton();
