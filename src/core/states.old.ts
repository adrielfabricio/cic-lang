import { HEX_DIGITS, LOWERCASE, NUMERIC, UPPERCASE } from "../config/constants";
import { StateTransitions, Token, Transition } from "../types/types";
import { State } from "../utils/enums";

/**
 * INITIAL_STATE: Q0
 * TK_INT: Q0 -> Q1 -> Q2 -> Q3 -> Q4 -> Q5
 * TK_END: Q0 -> Q1 -> Q12 -> Q13
 */
export const stateTransitions: StateTransitions = {
  q0: (char) => ({
    nextState: HEX_DIGITS.includes(char)
      ? State.Q1
      : LOWERCASE.includes(char)
      ? State.Q4
      : State.Q0,
    token: LOWERCASE.includes(char) ? Token.TK_ID : Token.UNKNOWN,
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
