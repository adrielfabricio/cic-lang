// src/states.ts
import { State, Token } from "./automaton";

interface Transition {
  nextState: State;
  token: Token;
}

type StateTransitions = {
  [key in State]: (char: string) => Transition;
};

export const stateTransitions: StateTransitions = {
  q0: (char) => ({
    nextState: /[0-9]/.test(char) ? "q1" : /[a-z]/.test(char) ? "q4" : "q0",
    token: /[a-z]/.test(char) ? "TK_ID" : "UNKNOWN",
  }),
  q1: (char) => ({
    nextState: char.toLowerCase() === "x" ? "q2" : "q0",
    token: "UNKNOWN",
  }),
  q2: (char) => ({
    nextState: /[0-9A-Fa-f]/.test(char) ? "q3" : "q0",
    token: /[0-9A-Fa-f]/.test(char) ? "TK_END" : "UNKNOWN",
  }),
  q3: (char) => ({
    nextState: /[0-9A-Fa-f]/.test(char) ? "q3" : "q0",
    token: "TK_END",
  }),
  q4: (char) => ({
    nextState: /[A-Z]/.test(char) ? "q5" : "q0",
    token: "TK_ID",
  }),
  q5: (char) => ({
    nextState: /[a-z]/.test(char) ? "q4" : "q0",
    token: "TK_ID",
  }),
};
