import { StateEnum, TokenEnum } from "../utils/enums";

export type Token = {
  type: string;
  value: string;
};

export interface Error {
  message: string;
  row: number;
  col: number;
  codeLine: string;
}

export interface Transition {
  nextState: StateEnum;
  token: TokenEnum;
}

export type StateTransitions = {
  [key in StateEnum]: (char: string, buffer?: string) => Transition;
};
