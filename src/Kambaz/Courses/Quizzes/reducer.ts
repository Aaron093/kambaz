import { createSlice } from "@reduxjs/toolkit";

interface QuizContent {
  point: number;
  [key: string]: any;
}

interface QuizQuestion {
  _id: number;
  type: string;
  content: QuizContent;
}

interface Quiz {
  _id: string;
  title: string;
  course: string;
  desc?: string;
  points: number;
  due?: string;
  available?: string;
  published: boolean;
  type: string;
  group?: string;
  shuffle?: boolean;
  time_limit?: string;
  multiple_attempts?: boolean;
  attempts?: number;
  view_reponses?: boolean;
  show_correct_answers?: boolean;
  one_question_at_a_time?: boolean;
  lockdown_browser?: boolean;
  required_to_view?: boolean;
  webcam?: boolean;
  lock_questions_after_answering?: boolean;
  questions: QuizQuestion[];
}

interface QuizzesState {
  quizzes: Quiz[];
}

const initialState: QuizzesState = {
  quizzes: [],
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, action) => {
      state.quizzes = action.payload || [];
    },
    addQuiz: (state, { payload: quiz }) => {
      if (!quiz) return;
      
      const newQuiz: Quiz = {
        _id: quiz._id || new Date().getTime().toString(),
        title: quiz.title || "",
        course: quiz.course || "",
        desc: quiz.desc || "",
        points: quiz.points || 0,
        due: quiz.due || "",
        available: quiz.available || "",
        published: quiz.published || false,
        type: quiz.type || "Graded Quiz",
        group: quiz.group || "Quizzes",
        shuffle: quiz.shuffle || false,
        time_limit: quiz.time_limit || "0",
        multiple_attempts: quiz.multiple_attempts || false,
        attempts: quiz.attempts || 1,
        view_reponses: quiz.view_reponses || false,
        show_correct_answers: quiz.show_correct_answers || false,
        one_question_at_a_time: quiz.one_question_at_a_time || false,
        lockdown_browser: quiz.lockdown_browser || false,
        required_to_view: quiz.required_to_view || false,
        webcam: quiz.webcam || false,
        lock_questions_after_answering: quiz.lock_questions_after_answering || false,
        questions: Array.isArray(quiz.questions) ? quiz.questions : [],
      };
      
      if (!state.quizzes.find((q) => q._id === newQuiz._id)) {
        state.quizzes.push(newQuiz);
      }
    },
    deleteQuiz: (state, { payload: quizId }) => {
      if (!quizId) return;
      state.quizzes = state.quizzes.filter((q) => q._id !== quizId);
    },
    updateQuiz: (state, { payload: quiz }) => {
      if (!quiz || !quiz._id) return;
      
      const existingQuizIndex = state.quizzes.findIndex((q) => q._id === quiz._id);
      
      if (existingQuizIndex !== -1) {
        const existingQuiz = state.quizzes[existingQuizIndex];
        const updatedQuiz: Quiz = {
          ...existingQuiz,
          ...quiz,
          questions: Array.isArray(quiz.questions) ? quiz.questions.map(q => ({
            ...q,
            content: {
              ...q.content,
              point: Number(q.content.point) || 0
            }
          })) : existingQuiz.questions || [],
          points: Number(quiz.points) || quiz.questions?.reduce((sum: number, q: QuizQuestion) => sum + (Number(q.content?.point) || 0), 0) || 0
        };
        
        state.quizzes[existingQuizIndex] = updatedQuiz;
      } else if (quiz._id !== "New") {
        state.quizzes.push({
          ...quiz,
          questions: Array.isArray(quiz.questions) ? quiz.questions.map(q => ({
            ...q,
            content: {
              ...q.content,
              point: Number(q.content.point) || 0
            }
          })) : [],
          points: Number(quiz.points) || quiz.questions?.reduce((sum: number, q: QuizQuestion) => sum + (Number(q.content?.point) || 0), 0) || 0
        } as Quiz);
      }
    },
  },
});

export const { addQuiz, deleteQuiz, updateQuiz, setQuizzes } =
  quizzesSlice.actions;
export default quizzesSlice.reducer;