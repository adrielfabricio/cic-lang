import { HEX_DIGITS, LOWERCASE, NUMERIC, UPPERCASE } from "../config/constants";
import { StateTransitions, Token } from "../types/types";
import { State } from "../utils/enums";

/**
 * INITIAL_STATE: Q0
 * TK_INT: Q0 -> Q1 -> Q2 -> Q3 -> Q4 -> Q5
 * TK_END: Q0 -> Q1 -> Q12 -> Q13
 */
export const stateTransitions: StateTransitions = {
  [State.Q0]: (char) => ({
    nextState: NUMERIC.includes(char)
      ? State.Q1
      : HEX_DIGITS.includes(char)
      ? State.Q1
      : LOWERCASE.includes(char)
      ? State.Q15
      : State.Q0,
    token: NUMERIC.includes(char)
      ? Token.UNKNOWN
      : LOWERCASE.includes(char)
      ? Token.TK_ID
      : Token.UNKNOWN,
  }),
  //! TODO: TK_FLOAT
  [State.Q1]: (char) => ({
    nextState:
      char === "x" ? State.Q12 : !NUMERIC.includes(char) ? State.Q5 : State.Q2,
    token: Token.UNKNOWN,
  }),
  //! TODO: TK_FLOAT
  [State.Q2]: (char) => ({
    nextState: !NUMERIC.includes(char) ? State.Q5 : State.Q3,
    token: Token.TK_INT,
  }),
  //! TODO: TK_FLOAT
  [State.Q3]: (char) => ({
    nextState: !NUMERIC.includes(char) ? State.Q5 : State.Q4,
    token: Token.TK_INT,
  }),
  [State.Q4]: (char) => ({
    nextState: !NUMERIC.includes(char) ? State.Q5 : State.Q0,
    token: Token.TK_INT,
  }),
  [State.Q5]: () => ({
    nextState: State.Q0,
    token: Token.TK_INT,
  }),
  [State.Q12]: (char) => ({
    nextState: HEX_DIGITS.includes(char) ? State.Q13 : State.Q0,
    token: HEX_DIGITS.includes(char) ? Token.TK_END : Token.UNKNOWN,
  }),
  [State.Q13]: (char) => ({
    nextState: HEX_DIGITS.includes(char) ? State.Q13 : State.Q14,
    token: Token.TK_END,
  }),
  [State.Q14]: () => ({
    nextState: State.Q0,
    token: Token.TK_END,
  }),
  [State.Q15]: (char) => ({
    nextState: UPPERCASE.includes(char) ? State.Q16 : State.Q0,
    token: Token.TK_ID,
  }),
  [State.Q16]: (char) => ({
    nextState: LOWERCASE.includes(char) ? State.Q17 : State.Q18,
    token: Token.TK_ID,
  }),
  [State.Q17]: (char) => ({
    nextState: UPPERCASE.includes(char) ? State.Q16 : State.Q18,
    token: Token.TK_ID,
  }),
  [State.Q18]: () => ({
    nextState: State.Q0,
    token: Token.TK_ID,
  }),
};
