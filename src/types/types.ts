import { State } from "../utils/enums";

export enum Token {
  TK_INT = "TK_INT",
  TK_FLOAT = "TK_FLOAT",
  TK_END = "TK_END",
  TK_ID = "TK_ID",
  UNKNOWN = "UNKNOWN",
}

export interface Transition {
  nextState: State;
  token: Token;
}

export type StateTransitions = {
  [key in State]: (char: string, buffer?: string) => Transition;
};
