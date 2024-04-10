import { HEX_DIGITS, LOWERCASE, NUMERIC, UPPERCASE } from "../utils/constants";
import { StateTransitions, Token } from "../types/types";
import { State } from "../utils/enums";

export const stateTransitions: StateTransitions = {
  q0: (char) => ({
    nextState: NUMERIC.includes(char)
      ? State.Q1
      : LOWERCASE.includes(char)
      ? State.Q4
      : State.Q0,
    token: Token.UNKNOWN,
  }),
  q1: (char) => ({
    nextState: char === "x" ? State.Q2 : State.Q0,
    token: Token.UNKNOWN,
  }),
  q2: (char) => ({
    nextState: HEX_DIGITS.includes(char) ? State.Q3 : State.Q0,
    token: HEX_DIGITS.includes(char) ? Token.TK_END : Token.UNKNOWN,
  }),
  q3: (char) => ({
    nextState: HEX_DIGITS.includes(char) ? State.Q3 : State.Q0,
    token: Token.TK_END,
  }),
  q4: (char) => ({
    nextState: UPPERCASE.includes(char) ? State.Q5 : State.Q0,
    token: Token.TK_ID,
  }),
  q5: (char) => ({
    nextState: LOWERCASE.includes(char) ? State.Q4 : State.Q0,
    token: Token.TK_ID,
  }),
};
