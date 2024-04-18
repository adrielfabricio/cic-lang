enum Token {
  TK_INT = "TK_INT",
  TK_FLOAT = "TK_FLOAT",
  TK_END = "TK_END",
  TK_ID = "TK_ID",
  TK_CADEIA = "TK_CADEIA",
  TK_DATA = "TK_DATA",
  TK_SIMPLE_COMMENT = "TK_SIMPLE_COMMENT",
  UNKNOWN = "UNKNOWN",
}

enum State {
  Q0 = "q0",
  Q1 = "q1",
  Q2 = "q2",
  Q3 = "q3",
  Q4 = "q4",
  Q5 = "q5",
  Q6 = "q6",
  Q7 = "q7",
  Q8 = "q8",
  Q9 = "q9",
  Q10 = "q10",
  Q11 = "q11",
  Q12 = "q12",
  Q13 = "q13",
  Q14 = "q14",
  Q15 = "q15",
  Q16 = "q16",
  Q17 = "q17",
  Q18 = "q18",
  Q19 = "q19",
  Q20 = "q20",
  Q21 = "q21",
  Q22 = "q22",
  Q23 = "q23",
  Q24 = "q24",
  Q25 = "q25",
  Q26 = "q26",
  Q27 = "q27",
  Q28 = "q28",
  Q29 = "q29",
  Q30 = "q30",
  Q31 = "q31",
  Q32 = "q32",
  Q33 = "q33",
  Q34 = "q34",
}

enum Error {
  UNRECOGNIZED_TOKEN = "unrecognized token",
}

export { Token, State, Error };
