import { stateTransitions } from "./states";
import { State, Token } from "./types";

class Automaton {
  private currentState: State = "q0";
  private token: Token = "UNKNOWN";

  public reset(): void {
    this.currentState = "q0";
    this.token = "UNKNOWN";
  }

  public processInput(input: string): Token {
    this.reset();
    for (const char of input) {
      const transition = stateTransitions[this.currentState](char);
      this.currentState = transition.nextState;
      if (transition.token !== "UNKNOWN") {
        this.token = transition.token;
      }
    }
    if (this.token === "TK_ID" && this.currentState !== "q5") {
      this.token = "UNKNOWN";
    }
    return this.token;
  }
}

export const automaton = new Automaton();
