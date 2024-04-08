import { constants } from "./constants";
import { StateTransitions } from "./types";

export const stateTransitions: StateTransitions = {
  q0: (char) => ({
    nextState: constants.numeric.includes(char)
      ? "q1"
      : constants.lowercase.includes(char)
      ? "q4"
      : "q0",
    token: constants.lowercase.includes(char) ? "TK_ID" : "UNKNOWN",
  }),
  q1: (char) => ({
    nextState: char === "x" || char === "X" ? "q2" : "q0",
    token: "UNKNOWN",
  }),
  q2: (char) => ({
    nextState: constants.hexDigits.includes(char) ? "q3" : "q0",
    token: constants.hexDigits.includes(char) ? "TK_END" : "UNKNOWN",
  }),
  q3: (char) => ({
    nextState: constants.hexDigits.includes(char) ? "q3" : "q0",
    token: "TK_END",
  }),
  q4: (char) => ({
    nextState: constants.uppercase.includes(char) ? "q5" : "q0",
    token: "TK_ID",
  }),
  q5: (char) => ({
    nextState: constants.lowercase.includes(char) ? "q4" : "q0",
    token: "TK_ID",
  }),
};
