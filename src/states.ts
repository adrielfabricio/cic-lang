import { HEX_DIGITS, LOWERCASE, NUMERIC, UPPERCASE } from "./constants";
import { StateTransitions, Token } from "./types";

export const stateTransitions: StateTransitions = {
  q0: (char) => ({
    nextState: NUMERIC.includes(char)
      ? "q1"
      : LOWERCASE.includes(char)
      ? "q4"
      : "q0",
    token: LOWERCASE.includes(char) ? Token.TK_ID : Token.UNKNOWN,
  }),
  q1: (char) => ({
    nextState: char === "x" ? "q2" : "q0",
    token: Token.UNKNOWN,
  }),
  q2: (char) => ({
    nextState: HEX_DIGITS.includes(char) ? "q3" : "q0",
    token: HEX_DIGITS.includes(char) ? Token.TK_END : Token.UNKNOWN,
  }),
  q3: (char) => ({
    nextState: HEX_DIGITS.includes(char) ? "q3" : "q0",
    token: Token.TK_END,
  }),
  q4: (char) => ({
    nextState: UPPERCASE.includes(char) ? "q5" : "q0",
    token: Token.TK_ID,
  }),
  q5: (char) => ({
    nextState: LOWERCASE.includes(char) ? "q4" : "q0",
    token: Token.TK_ID,
  }),
};
