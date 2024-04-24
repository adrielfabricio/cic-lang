import { HEX_DIGITS, LOWERCASE, NUMERIC, UPPERCASE } from "../config/constants";
import { StateTransitions } from "../types/types";
import { State, Token } from "../utils/enums";

/**
 * INITIAL_STATE: Q0
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
      : char === "#"
      ? State.Q22
      : char === "("
      ? State.Q35
      : char === ")"
      ? State.Q36
      : char === "|"
      ? State.Q37
      : char === "&"
      ? State.Q38
      : char === "%"
      ? State.Q39
      : char === "*"
      ? State.Q40
      : char === "-"
      ? State.Q41
      : char === "+"
      ? State.Q42
      : char === "~"
      ? State.Q43
      : char === "="
      ? State.Q44
      : char === "<"
      ? State.Q46
      : char === ">"
      ? State.Q51
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
    token: !NUMERIC.includes(char) ? Token.TK_INT : Token.UNKNOWN,
  }),
  [State.Q2]: (char) => ({
    nextState:
      char === "."
        ? State.Q6
        : char === "_"
        ? State.Q24
        : char === "/"
        ? State.Q27
        : !NUMERIC.includes(char)
        ? State.Q5
        : State.Q3,
    token: char === "_" || char === "/" ? Token.UNKNOWN : Token.TK_INT,
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
  [State.Q22]: (char) => ({
    nextState: char !== "\n" ? State.Q23 : State.Q0,
    token: Token.TK_SIMPLE_COMMENT,
  }),
  [State.Q23]: (char) => ({
    nextState: char !== "\n" ? State.Q23 : State.Q0,
    token: Token.TK_SIMPLE_COMMENT,
  }),
  [State.Q24]: (char) => ({
    nextState: NUMERIC.includes(char) ? State.Q25 : State.Q0,
    token: Token.UNKNOWN,
  }),
  [State.Q25]: (char) => ({
    nextState: NUMERIC.includes(char) ? State.Q26 : State.Q0,
    token: Token.UNKNOWN,
  }),
  [State.Q26]: (char) => ({
    nextState: char === "_" ? State.Q30 : State.Q0,
    token: Token.UNKNOWN,
  }),
  [State.Q27]: (char) => ({
    nextState: NUMERIC.includes(char) ? State.Q28 : State.Q0,
    token: Token.UNKNOWN,
  }),
  [State.Q28]: (char) => ({
    nextState: NUMERIC.includes(char) ? State.Q29 : State.Q0,
    token: Token.UNKNOWN,
  }),
  [State.Q29]: (char) => ({
    nextState: char === "/" ? State.Q30 : State.Q0,
    token: Token.UNKNOWN,
  }),
  [State.Q30]: (char) => ({
    nextState: NUMERIC.includes(char) ? State.Q31 : State.Q0,
    token: Token.UNKNOWN,
  }),
  [State.Q31]: (char) => ({
    nextState: NUMERIC.includes(char) ? State.Q32 : State.Q0,
    token: Token.UNKNOWN,
  }),
  [State.Q32]: (char) => ({
    nextState: NUMERIC.includes(char) ? State.Q33 : State.Q0,
    token: Token.UNKNOWN,
  }),
  [State.Q33]: (char) => ({
    nextState: NUMERIC.includes(char) ? State.Q34 : State.Q0,
    token: Token.TK_DATA,
  }),
  // TK_DATA acceptance state
  [State.Q34]: () => ({
    nextState: State.Q0,
    token: Token.TK_DATA,
  }),
  // TK_OPEN_PAR acceptance state
  [State.Q35]: () => ({
    nextState: State.Q0,
    token: Token.TK_OPEN_PAR,
  }),
  // TK_CLOSE_PAR acceptance state
  [State.Q36]: () => ({
    nextState: State.Q0,
    token: Token.TK_CLOSE_PAR,
  }),
  // TK_OR acceptance state
  [State.Q37]: () => ({
    nextState: State.Q0,
    token: Token.TK_OR,
  }),
  // TK_AND acceptance state
  [State.Q38]: () => ({
    nextState: State.Q0,
    token: Token.TK_AND,
  }),
  // TK_DIV acceptance state
  [State.Q39]: () => ({
    nextState: State.Q0,
    token: Token.TK_DIV,
  }),
  // TK_MULT acceptance state
  [State.Q40]: () => ({
    nextState: State.Q0,
    token: Token.TK_MULT,
  }),
  // TK_MINUS acceptance state
  [State.Q41]: () => ({
    nextState: State.Q0,
    token: Token.TK_MINUS,
  }),
  // TK_PLUS acceptance state
  [State.Q42]: () => ({
    nextState: State.Q0,
    token: Token.TK_PLUS,
  }),
  // TK_NEG acceptance state
  [State.Q43]: () => ({
    nextState: State.Q0,
    token: Token.TK_NEG,
  }),
  [State.Q44]: (char) => ({
    nextState: char === "=" ? State.Q45 : State.Q0,
    token: Token.UNKNOWN,
  }),
  // TK_EQUAL acceptance state
  [State.Q45]: () => ({
    nextState: State.Q0,
    token: Token.TK_EQUAL,
  }),
  [State.Q46]: (char) => ({
    nextState: char === "=" ? State.Q48 : char === ">" ? State.Q50 : State.Q47,
    token: char !== "=" && char !== ">" ? Token.TK_LESS : Token.UNKNOWN,
  }),
  // TK_LESS acceptance state
  [State.Q47]: () => ({
    nextState: State.Q0,
    token: Token.TK_LESS,
  }),
  // TK_LESS_EQUAL acceptance state
  [State.Q48]: (char) => ({
    nextState: char === "=" ? State.Q49 : State.Q0,
    token: char === "=" ? Token.UNKNOWN : Token.TK_LESS_EQUAL,
  }),
  // TK_ASSIGN acceptance state
  [State.Q49]: () => ({
    nextState: State.Q0,
    token: Token.TK_ASSIGN,
  }),
  // TK_DIFF acceptance state
  [State.Q50]: () => ({
    nextState: State.Q0,
    token: Token.TK_DIFF,
  }),
  [State.Q51]: (char) => ({
    nextState: char === "=" ? State.Q53 : State.Q52,
    token: Token.UNKNOWN,
  }),
  // TK_GREATER acceptance state
  [State.Q52]: () => ({
    nextState: State.Q0,
    token: Token.TK_GREATER,
  }),
  // TK_GREATER_EQUAL acceptance state
  [State.Q53]: () => ({
    nextState: State.Q0,
    token: Token.TK_GREATER_EQUAL,
  }),
};
