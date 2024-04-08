type State = "q0" | "q1" | "q2" | "q3" | "q4" | "q5" | "q6";
type Token = "TK_END" | "TK_ID" | "UNKNOWN";

class Automaton {
  private currentState: State = "q0";

  public reset(): void {
    this.currentState = "q0";
  }

  public processInput(input: string): Token {
    let token: Token = "UNKNOWN";
    this.reset(); // Ensure the automaton starts in the initial state for each input

    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      switch (this.currentState) {
        case "q0":
          if (/[0-9]/.test(char)) {
            this.currentState = "q1";
          } else if (/[a-z]/.test(char)) {
            this.currentState = "q4"; // Start for TK_ID
            token = "TK_ID"; // Assuming it might be a TK_ID
          } else {
            token = "UNKNOWN";
          }
          break;
        case "q1":
          if (char === "x" || char === "X") {
            this.currentState = "q2";
          } else {
            token = "UNKNOWN";
            this.reset();
          }
          break;
        case "q2":
          if (/[0-9A-F]/.test(char)) {
            this.currentState = "q3";
            token = "TK_END";
          } else {
            token = "UNKNOWN";
            this.reset();
          }
          break;
        case "q3":
          if (/[0-9A-F]/.test(char)) {
            // Still a valid TK_END
            token = "TK_END";
          } else {
            // Any character outside the hex range after a valid hex sequence invalidates TK_END
            token = "UNKNOWN";
            this.reset();
          }
          break;
        case "q4":
          if (/[A-Z]/.test(char)) {
            this.currentState = "q5";
          } else {
            // Invalid sequence for TK_ID, reset to start
            token = "UNKNOWN";
            this.reset();
          }
          break;
        case "q5":
          if (/[a-z]/.test(char)) {
            // Continue matching TK_ID in the pattern aAaA...
            this.currentState = "q4";
          } else {
            // Invalid sequence for TK_ID, reset to start
            token = "UNKNOWN";
            this.reset();
          }
          break;
      }
    }

    // Final state validation for TK_ID (should end in q5 for a valid TK_ID)
    if (token === "TK_ID" && this.currentState !== "q5") {
      token = "UNKNOWN";
    }

    return token;
  }
}

export const automaton = new Automaton();
