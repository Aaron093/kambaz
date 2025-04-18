import { createSlice } from "@reduxjs/toolkit";
import { courses } from "../Database";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  courses: courses,
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    
    addCourse: (state, action) => {
      const newCourse = {
        ...action.payload,
        _id: uuidv4(),
      };
      state.courses = [...state.courses, newCourse] as any;
    },
    
    deleteCourse: (state, action) => {
      const courseId = action.payload;
      state.courses = state.courses.filter((course) => course._id !== courseId);
    },

    
    updateCourse: (state, action) => {
      const updatedCourse = action.payload;
      state.courses = state.courses.map((course) =>
        course._id === updatedCourse._id ? updatedCourse : course
      );
    },
  },
});

export const { addCourse, deleteCourse, updateCourse } = coursesSlice.actions;

export default coursesSlice.reducer;
