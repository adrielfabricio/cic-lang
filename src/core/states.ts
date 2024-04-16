import { HEX_DIGITS, LOWERCASE, NUMERIC, UPPERCASE } from "../config/constants";
import { StateTransitions } from "../types/types";
import { State, Token } from "../utils/enums";

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
      ? State.Q11
      : LOWERCASE.includes(char)
      ? State.Q15
      : char === "."
      ? State.Q6
      : char === '"'
      ? State.Q19
      : State.Q0,
    token: NUMERIC.includes(char)
      ? Token.UNKNOWN
      : LOWERCASE.includes(char)
      ? Token.TK_ID
      : Token.UNKNOWN,
  }),
  [State.Q1]: (char) => ({
    nextState:
      char === "x"
        ? State.Q12
        : char === "."
        ? State.Q6
        : !NUMERIC.includes(char)
        ? State.Q5
        : State.Q2,
    token: Token.UNKNOWN,
  }),
  [State.Q2]: (char) => ({
    nextState:
      char === "." ? State.Q6 : !NUMERIC.includes(char) ? State.Q5 : State.Q3,
    token: Token.TK_INT,
  }),
  [State.Q3]: (char) => ({
    nextState:
      char === "." ? State.Q6 : !NUMERIC.includes(char) ? State.Q5 : State.Q4,
    token: Token.TK_INT,
  }),
  [State.Q4]: (char) => ({
    nextState: !NUMERIC.includes(char) ? State.Q5 : State.Q4,
    token: Token.TK_INT,
  }),
  // TK_INT acceptance state
  [State.Q5]: () => ({
    nextState: State.Q0,
    token: Token.TK_INT,
  }),
  [State.Q6]: (char) => ({
    nextState: NUMERIC.includes(char) ? State.Q7 : State.Q0,
    token: NUMERIC.includes(char) ? Token.TK_FLOAT : Token.UNKNOWN,
  }),
  [State.Q7]: (char) => ({
    nextState:
      char === "e" || char === "e-"
        ? State.Q8
        : !NUMERIC.includes(char)
        ? State.Q10
        : State.Q7,
    token: Token.TK_FLOAT,
  }),
  [State.Q8]: (char) => ({
    nextState: NUMERIC.includes(char) ? State.Q9 : State.Q0,
    token: NUMERIC.includes(char) ? Token.TK_FLOAT : Token.UNKNOWN,
  }),
  [State.Q9]: (char) => ({
    nextState: NUMERIC.includes(char) ? State.Q9 : State.Q10,
    token: Token.TK_FLOAT,
  }),
  // TK_FLOAT acceptance state
  [State.Q10]: () => ({
    nextState: State.Q0,
    token: Token.TK_FLOAT,
  }),
  [State.Q11]: (char) => ({
    nextState: char === "x" ? State.Q12 : State.Q0,
    token: Token.UNKNOWN,
  }),
  [State.Q12]: (char) => ({
    nextState: HEX_DIGITS.includes(char) ? State.Q13 : State.Q0,
    token: HEX_DIGITS.includes(char) ? Token.TK_END : Token.UNKNOWN,
  }),
  [State.Q13]: (char) => ({
    nextState: HEX_DIGITS.includes(char) ? State.Q13 : State.Q14,
    token: Token.TK_END,
  }),
  // TK_END acceptance state
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
  // TK_ID acceptance state
  [State.Q18]: () => ({
    nextState: State.Q0,
    token: Token.TK_ID,
  }),
  [State.Q19]: (char) => ({
    nextState: LOWERCASE.includes(char.toLowerCase()) ? State.Q20 : State.Q0,
    token: Token.UNKNOWN,
  }),
  [State.Q20]: (char) => ({
    nextState: LOWERCASE.includes(char.toLowerCase())
      ? State.Q20
      : char === '"'
      ? State.Q21
      : State.Q0,
    token: char === '"' ? Token.TK_CADEIA : Token.UNKNOWN,
  }),
  // TK_CADEIA acceptance state
  [State.Q21]: () => ({
    nextState: State.Q0,
    token: Token.TK_CADEIA,
  }),
};
