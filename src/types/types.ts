import { State, Token } from "../utils/enums";

export interface Transition {
  nextState: State;
  token: Token;
}

export type StateTransitions = {
  [key in State]: (char: string, buffer?: string) => Transition;
};
