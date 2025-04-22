import { createSlice, PayloadAction } from "@reduxjs/toolkit";

declare type QuestionSetter = {
  questionIndex: number;
  answer: any;
};

const initialState = {
  attempts: [] as any[],
  currentAttempt: {
    _id: "",
    user: "",
    quiz: "",
    start: "",
    answers: [] as any[],
    submitted: false,
    score: 0,
    grade: 0,
  },
};

const attemptsSlice = createSlice({
  name: "attempts",
  initialState,
  reducers: {
    setAttempts: (state, action) => {
      state.attempts = action.payload || [];
    },
    setCurrentAttempt: (state, { payload: attempt }) => {
      state.currentAttempt = attempt;
    },
    setAnswer: (state, action: PayloadAction<QuestionSetter>) => {
      state.currentAttempt.answers[action.payload.questionIndex] = action.payload.answer;
    },
    addAttempt: (state, { payload: attempt }) => {
      if (!state.attempts.find(a => a._id === attempt._id)) {
        state.attempts.push(attempt);
      }
    },
  },
});

export const { setAnswer, setCurrentAttempt, setAttempts, addAttempt } = attemptsSlice.actions;
export default attemptsSlice.reducer;
