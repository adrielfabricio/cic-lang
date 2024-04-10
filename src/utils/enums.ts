enum Token {
  TK_INT = "TK_INT",
  TK_FLOAT = "TK_FLOAT",
  TK_END = "TK_END",
  TK_ID = "TK_ID",
  UNKNOWN = "UNKNOWN",
}

enum State {
  Q0 = "q0",
  Q1 = "q1",
  Q2 = "q2",
  Q3 = "q3",
  Q4 = "q4",
  Q5 = "q5",
}

enum Error {
  UNRECOGNIZED_TOKEN = "unrecognized token",
}

export { Token, State, Error };
