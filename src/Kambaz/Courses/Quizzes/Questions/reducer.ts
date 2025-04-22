import { createSlice } from "@reduxjs/toolkit";
import { QuizQuestion } from "../client";

interface QuestionsState {
  questions: QuizQuestion[];
}

const initialState: QuestionsState = {
  questions: [],
};

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    setQuestions: (state, action) => {
      state.questions = action.payload || [];
    },
    addQuestion: (state, { payload: question }) => {
      if (!question) return;
      state.questions.push(question);
    },
    deleteQuestion: (state, { payload: questionId }) => {
      if (!questionId) return;
      state.questions = state.questions.filter(q => q._id !== questionId);
    },
    updateQuestion: (state, { payload: question }) => {
      if (!question || !question._id) return;
      const index = state.questions.findIndex(q => q._id === question._id);
      if (index !== -1) {
        state.questions[index] = {
          ...state.questions[index],
          ...question,
          content: {
            ...state.questions[index].content,
            ...question.content,
            point: Number(question.content?.point) || state.questions[index].content.point
          }
        };
      }
    },
  },
});

export const { setQuestions, addQuestion, deleteQuestion, updateQuestion } =
  questionsSlice.actions;
export default questionsSlice.reducer;