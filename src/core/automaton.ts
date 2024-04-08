import { stateTransitions } from "./states";
import { State, Token } from "../types/types";

class Automaton {
  private currentState: State = "q0";
  private token: Token = Token.UNKNOWN;

  public reset(): void {
    this.currentState = "q0";
    this.token = Token.UNKNOWN;
  }

  public processInput(input: string): Token {
    this.reset();
    for (const char of input) {
      const transition = stateTransitions[this.currentState](char);
      this.currentState = transition.nextState;
      if (transition.token !== Token.UNKNOWN) {
        this.token = transition.token;
      }
    }
    if (this.token === Token.TK_ID && this.currentState !== "q5") {
      this.token = Token.UNKNOWN;
    }
    return this.token;
  }
}

export const automaton = new Automaton();
