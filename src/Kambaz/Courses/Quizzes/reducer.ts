import { createSlice } from "@reduxjs/toolkit";
// import { assignments } from "../../Database";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  quizzes: [],
  currentUser: null,
};
const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, action) => {
      state.quizzes = action.payload;
    },

    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },

    addQuiz: (state, { payload: quiz }) => {
      const newquiz: any = {
        _id: uuidv4(),
        title: quiz.title,
        course: quiz.course,
        name: quiz.name,
        description: quiz.description,
        points: quiz.points,
        dueDate: quiz.dueDate,
        availableDate: quiz.availableDate,
        availableUntil: quiz.availableUntil,
        gradeDisplay: quiz.gradeDisplay,
        assignmentGroup: quiz.assignmentGroup,
        submission: quiz.submission,
        entry: quiz.entry,
      };
      state.quizzes = [...state.quizzes, newquiz] as any;
    },


    deleteQuiz: (state, { payload: quizId }) => {
      state.quizzes = state.quizzes.filter(
        (m: any) => m._id !== quizId);
    },
    
    updateQuiz: (state, { payload: quiz }) => {
      state.quizzes = state.quizzes.map((a: any) =>
        a._id === quiz._id ? quiz : a
      ) as any;
    },
  },
});
export const { addQuiz, deleteQuiz, updateQuiz, setQuizzes } =
quizzesSlice.actions;
export default quizzesSlice.reducer;