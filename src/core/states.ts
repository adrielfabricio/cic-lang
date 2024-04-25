import { HEX_DIGITS, LOWERCASE, NUMERIC, UPPERCASE } from "../config/constants";
import { StateTransitions } from "../types/types";
import { StateEnum, TokenEnum } from "../utils/enums";

/**
 * INITIAL_STATE: Q0
 */
export const stateTransitions: StateTransitions = {
  [StateEnum.Q0]: (char) => ({
    nextState: NUMERIC.includes(char)
      ? StateEnum.Q1
      : HEX_DIGITS.includes(char)
      ? StateEnum.Q11
      : LOWERCASE.includes(char)
      ? StateEnum.Q15
      : char === "."
      ? StateEnum.Q6
      : char === '"'
      ? StateEnum.Q19
      : char === "#"
      ? StateEnum.Q22
      : char === "("
      ? StateEnum.Q35
      : char === ")"
      ? StateEnum.Q36
      : char === "|"
      ? StateEnum.Q37
      : char === "&"
      ? StateEnum.Q38
      : char === "%"
      ? StateEnum.Q39
      : char === "*"
      ? StateEnum.Q40
      : char === "-"
      ? StateEnum.Q41
      : char === "+"
      ? StateEnum.Q42
      : char === "~"
      ? StateEnum.Q43
      : char === "="
      ? StateEnum.Q44
      : char === "<"
      ? StateEnum.Q46
      : char === ">"
      ? StateEnum.Q51
      : StateEnum.Q0,
    token: NUMERIC.includes(char)
      ? TokenEnum.UNKNOWN
      : LOWERCASE.includes(char)
      ? TokenEnum.TK_ID
      : TokenEnum.UNKNOWN,
  }),
  [StateEnum.Q1]: (char) => ({
    nextState:
      char === "x"
        ? StateEnum.Q12
        : char === "."
        ? StateEnum.Q6
        : !NUMERIC.includes(char)
        ? StateEnum.Q5
        : StateEnum.Q2,
    token: !NUMERIC.includes(char) ? TokenEnum.TK_INT : TokenEnum.UNKNOWN,
  }),
  [StateEnum.Q2]: (char) => ({
    nextState:
      char === "."
        ? StateEnum.Q6
        : char === "_"
        ? StateEnum.Q24
        : char === "/"
        ? StateEnum.Q27
        : !NUMERIC.includes(char)
        ? StateEnum.Q5
        : StateEnum.Q3,
    token: char === "_" || char === "/" ? TokenEnum.UNKNOWN : TokenEnum.TK_INT,
  }),
  [StateEnum.Q3]: (char) => ({
    nextState:
      char === "."
        ? StateEnum.Q6
        : !NUMERIC.includes(char)
        ? StateEnum.Q5
        : StateEnum.Q4,
    token: TokenEnum.TK_INT,
  }),
  [StateEnum.Q4]: (char) => ({
    nextState: !NUMERIC.includes(char) ? StateEnum.Q5 : StateEnum.Q4,
    token: TokenEnum.TK_INT,
  }),
  // TK_INT acceptance state
  [StateEnum.Q5]: () => ({
    nextState: StateEnum.Q0,
    token: TokenEnum.TK_INT,
  }),
  [StateEnum.Q6]: (char) => ({
    nextState: NUMERIC.includes(char) ? StateEnum.Q7 : StateEnum.Q0,
    token: NUMERIC.includes(char) ? TokenEnum.TK_FLOAT : TokenEnum.UNKNOWN,
  }),
  [StateEnum.Q7]: (char) => ({
    nextState:
      char === "e" || char === "e-"
        ? StateEnum.Q8
        : !NUMERIC.includes(char)
        ? StateEnum.Q10
        : StateEnum.Q7,
    token: TokenEnum.TK_FLOAT,
  }),
  [StateEnum.Q8]: (char) => ({
    nextState: NUMERIC.includes(char) ? StateEnum.Q9 : StateEnum.Q0,
    token: NUMERIC.includes(char) ? TokenEnum.TK_FLOAT : TokenEnum.UNKNOWN,
  }),
  [StateEnum.Q9]: (char) => ({
    nextState: NUMERIC.includes(char) ? StateEnum.Q9 : StateEnum.Q10,
    token: TokenEnum.TK_FLOAT,
  }),
  // TK_FLOAT acceptance state
  [StateEnum.Q10]: () => ({
    nextState: StateEnum.Q0,
    token: TokenEnum.TK_FLOAT,
  }),
  [StateEnum.Q11]: (char) => ({
    nextState: char === "x" ? StateEnum.Q12 : StateEnum.Q0,
    token: TokenEnum.UNKNOWN,
  }),
  [StateEnum.Q12]: (char) => ({
    nextState: HEX_DIGITS.includes(char) ? StateEnum.Q13 : StateEnum.Q0,
    token: HEX_DIGITS.includes(char) ? TokenEnum.TK_END : TokenEnum.UNKNOWN,
  }),
  [StateEnum.Q13]: (char) => ({
    nextState: HEX_DIGITS.includes(char) ? StateEnum.Q13 : StateEnum.Q14,
    token: TokenEnum.TK_END,
  }),
  // TK_END acceptance state
  [StateEnum.Q14]: () => ({
    nextState: StateEnum.Q0,
    token: TokenEnum.TK_END,
  }),
  [StateEnum.Q15]: (char) => ({
    nextState: UPPERCASE.includes(char) ? StateEnum.Q16 : StateEnum.Q0,
    token: TokenEnum.TK_ID,
  }),
  [StateEnum.Q16]: (char) => ({
    nextState: LOWERCASE.includes(char) ? StateEnum.Q17 : StateEnum.Q18,
    token: TokenEnum.TK_ID,
  }),
  [StateEnum.Q17]: (char) => ({
    nextState: UPPERCASE.includes(char) ? StateEnum.Q16 : StateEnum.Q18,
    token: TokenEnum.TK_ID,
  }),
  // TK_ID acceptance state
  [StateEnum.Q18]: () => ({
    nextState: StateEnum.Q0,
    token: TokenEnum.TK_ID,
  }),
  [StateEnum.Q19]: (char) => ({
    nextState: LOWERCASE.includes(char.toLowerCase())
      ? StateEnum.Q20
      : StateEnum.Q0,
    token: TokenEnum.UNKNOWN,
  }),
  [StateEnum.Q20]: (char) => ({
    nextState: LOWERCASE.includes(char.toLowerCase())
      ? StateEnum.Q20
      : char === '"'
      ? StateEnum.Q21
      : StateEnum.Q0,
    token: char === '"' ? TokenEnum.TK_CADEIA : TokenEnum.UNKNOWN,
  }),
  // TK_CADEIA acceptance state
  [StateEnum.Q21]: () => ({
    nextState: StateEnum.Q0,
    token: TokenEnum.TK_CADEIA,
  }),
  [StateEnum.Q22]: (char) => ({
    nextState: char !== "\n" ? StateEnum.Q23 : StateEnum.Q0,
    token: TokenEnum.TK_SIMPLE_COMMENT,
  }),
  [StateEnum.Q23]: (char) => ({
    nextState: char !== "\n" ? StateEnum.Q23 : StateEnum.Q0,
    token: TokenEnum.TK_SIMPLE_COMMENT,
  }),
  [StateEnum.Q24]: (char) => ({
    nextState: NUMERIC.includes(char) ? StateEnum.Q25 : StateEnum.Q0,
    token: TokenEnum.UNKNOWN,
  }),
  [StateEnum.Q25]: (char) => ({
    nextState: NUMERIC.includes(char) ? StateEnum.Q26 : StateEnum.Q0,
    token: TokenEnum.UNKNOWN,
  }),
  [StateEnum.Q26]: (char) => ({
    nextState: char === "_" ? StateEnum.Q30 : StateEnum.Q0,
    token: TokenEnum.UNKNOWN,
  }),
  [StateEnum.Q27]: (char) => ({
    nextState: NUMERIC.includes(char) ? StateEnum.Q28 : StateEnum.Q0,
    token: TokenEnum.UNKNOWN,
  }),
  [StateEnum.Q28]: (char) => ({
    nextState: NUMERIC.includes(char) ? StateEnum.Q29 : StateEnum.Q0,
    token: TokenEnum.UNKNOWN,
  }),
  [StateEnum.Q29]: (char) => ({
    nextState: char === "/" ? StateEnum.Q30 : StateEnum.Q0,
    token: TokenEnum.UNKNOWN,
  }),
  [StateEnum.Q30]: (char) => ({
    nextState: NUMERIC.includes(char) ? StateEnum.Q31 : StateEnum.Q0,
    token: TokenEnum.UNKNOWN,
  }),
  [StateEnum.Q31]: (char) => ({
    nextState: NUMERIC.includes(char) ? StateEnum.Q32 : StateEnum.Q0,
    token: TokenEnum.UNKNOWN,
  }),
  [StateEnum.Q32]: (char) => ({
    nextState: NUMERIC.includes(char) ? StateEnum.Q33 : StateEnum.Q0,
    token: TokenEnum.UNKNOWN,
  }),
  [StateEnum.Q33]: (char) => ({
    nextState: NUMERIC.includes(char) ? StateEnum.Q34 : StateEnum.Q0,
    token: TokenEnum.TK_DATA,
  }),
  // TK_DATA acceptance state
  [StateEnum.Q34]: () => ({
    nextState: StateEnum.Q0,
    token: TokenEnum.TK_DATA,
  }),
  // TK_OPEN_PAR acceptance state
  [StateEnum.Q35]: () => ({
    nextState: StateEnum.Q0,
    token: TokenEnum.TK_OPEN_PAR,
  }),
  // TK_CLOSE_PAR acceptance state
  [StateEnum.Q36]: () => ({
    nextState: StateEnum.Q0,
    token: TokenEnum.TK_CLOSE_PAR,
  }),
  // TK_OR acceptance state
  [StateEnum.Q37]: () => ({
    nextState: StateEnum.Q0,
    token: TokenEnum.TK_OR,
  }),
  // TK_AND acceptance state
  [StateEnum.Q38]: () => ({
    nextState: StateEnum.Q0,
    token: TokenEnum.TK_AND,
  }),
  // TK_DIV acceptance state
  [StateEnum.Q39]: () => ({
    nextState: StateEnum.Q0,
    token: TokenEnum.TK_DIV,
  }),
  // TK_MULT acceptance state
  [StateEnum.Q40]: () => ({
    nextState: StateEnum.Q0,
    token: TokenEnum.TK_MULT,
  }),
  // TK_MINUS acceptance state
  [StateEnum.Q41]: () => ({
    nextState: StateEnum.Q0,
    token: TokenEnum.TK_MINUS,
  }),
  // TK_PLUS acceptance state
  [StateEnum.Q42]: () => ({
    nextState: StateEnum.Q0,
    token: TokenEnum.TK_PLUS,
  }),
  // TK_NEG acceptance state
  [StateEnum.Q43]: () => ({
    nextState: StateEnum.Q0,
    token: TokenEnum.TK_NEG,
  }),
  [StateEnum.Q44]: (char) => ({
    nextState: char === "=" ? StateEnum.Q45 : StateEnum.Q0,
    token: TokenEnum.UNKNOWN,
  }),
  // TK_EQUAL acceptance state
  [StateEnum.Q45]: () => ({
    nextState: StateEnum.Q0,
    token: TokenEnum.TK_EQUAL,
  }),
  [StateEnum.Q46]: (char) => ({
    nextState:
      char === "="
        ? StateEnum.Q48
        : char === ">"
        ? StateEnum.Q50
        : StateEnum.Q47,
    token: char !== "=" && char !== ">" ? TokenEnum.TK_LESS : TokenEnum.UNKNOWN,
  }),
  // TK_LESS acceptance state
  [StateEnum.Q47]: () => ({
    nextState: StateEnum.Q0,
    token: TokenEnum.TK_LESS,
  }),
  // TK_LESS_EQUAL acceptance state
  [StateEnum.Q48]: (char) => ({
    nextState: char === "=" ? StateEnum.Q49 : StateEnum.Q0,
    token: char === "=" ? TokenEnum.UNKNOWN : TokenEnum.TK_LESS_EQUAL,
  }),
  // TK_ASSIGN acceptance state
  [StateEnum.Q49]: () => ({
    nextState: StateEnum.Q0,
    token: TokenEnum.TK_ASSIGN,
  }),
  // TK_DIFF acceptance state
  [StateEnum.Q50]: () => ({
    nextState: StateEnum.Q0,
    token: TokenEnum.TK_DIFF,
  }),
  [StateEnum.Q51]: (char) => ({
    nextState: char === "=" ? StateEnum.Q53 : StateEnum.Q52,
    token: TokenEnum.UNKNOWN,
  }),
  // TK_GREATER acceptance state
  [StateEnum.Q52]: () => ({
    nextState: StateEnum.Q0,
    token: TokenEnum.TK_GREATER,
  }),
  // TK_GREATER_EQUAL acceptance state
  [StateEnum.Q53]: () => ({
    nextState: StateEnum.Q0,
    token: TokenEnum.TK_GREATER_EQUAL,
  }),
};
