export type State = "q0" | "q1" | "q2" | "q3" | "q4" | "q5";
export type Token = "TK_END" | "TK_ID" | "UNKNOWN";

export interface Transition {
  nextState: State;
  token: Token;
}

export type StateTransitions = {
  [key in State]: (char: string) => Transition;
};
