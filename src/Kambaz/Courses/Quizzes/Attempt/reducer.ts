import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  attempts: [], 
};
const attemptsSlice = createSlice({
  name: "attempts",
  initialState,
  reducers: {
    setAttempts: (state, action) => {
      state.attempts = action.payload; 
      console.log('state', state.attempts)
    },
    addAttempt: (state, { payload: attempt }) => {
      const newAttempt = {
        _id: attempt._id || new Date().getTime().toString(),
        quiz: attempt.quiz,
        user: attempt.user,
        attempt: attempt.attempt || 1,
        answers: attempt.answers || [],
      };
      state.attempts = [...state.attempts, newAttempt] as any;
    },
    deleteAttempt: (state, { payload: attemptId }) => {
      state.attempts = state.attempts.filter(
        (a: any) => a._id !== attemptId
      );
    },
    updateAttempt: (state, { payload: updatedAttempt }) => {
      state.attempts = state.attempts.map((attempt: any) =>
        attempt._id === updatedAttempt._id ? { ...attempt, ...updatedAttempt } : attempt
      ) as any;
    },
    addAnswerToAttempt: (state, { payload: { attemptId, answer } }) => {
      state.attempts = state.attempts.map((attempt: any) =>
        attempt._id === attemptId
          ? {
              ...attempt,
              answers: [...attempt.answers, answer],
            }
          : attempt
      ) as any;
    },
    updateAnswerInAttempt: (state, { payload: { attemptId, updatedAnswer } }) => {
      state.attempts = state.attempts.map((attempt: any) =>
        attempt._id === attemptId
          ? {
              ...attempt,
              answers: attempt.answers.map((answer: any) =>
                answer.questionId === updatedAnswer.questionId
                  ? { ...answer, ...updatedAnswer }
                  : answer
              ),
            }
          : attempt
      ) as any;
    },
  },
});

export const {
  setAttempts,
  addAttempt,
  deleteAttempt,
  updateAttempt,
  addAnswerToAttempt,
  updateAnswerInAttempt,
} = attemptsSlice.actions;

export default attemptsSlice.reducer;