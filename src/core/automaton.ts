import { stateTransitions } from "./states";
import { State, Token } from "../types/types";
import { writeTokenToFile } from "../utils/files";

class Automaton {
  private currentState: State = "q0";
  private token: Token = Token.UNKNOWN;
  private currentRow: number = 1;
  private currentCol: number = 1;
  private currentValue: string = "";

  public reset(): void {
    this.currentState = "q0";
    this.token = Token.UNKNOWN;
    this.currentRow = 1;
    this.currentCol = 1;
    this.currentValue = "";
  }

  public processInput(input: string): Token {
    this.reset();

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
      if (transition.token !== Token.UNKNOWN) {
        this.token = transition.token;
      }
    }

    if (this.token === Token.TK_ID && this.currentState !== "q5") {
      this.token = Token.UNKNOWN;
      this.currentValue = "";
    }

    if (this.token !== Token.UNKNOWN) {
      writeTokenToFile({
        row: this.currentRow,
        col: this.currentCol,
        token: this.token,
        value: this.currentValue,
      });
    }

    return this.token;
  }

  public getCurrentPosition(): { row: number; col: number } {
    return { row: this.currentRow, col: this.currentCol };
  }
}

export const automaton = new Automaton();
