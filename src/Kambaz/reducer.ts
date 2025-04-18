import { createSlice } from "@reduxjs/toolkit";
import { enrollments } from "./Database";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  enrollments: enrollments,
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    
    enroll: (state, action) => {
      const { user, course } = action.payload;
      // check whether the user has enrolled
      const isAlreadyEnrolled = state.enrollments.some(
        (enrollment) => enrollment.user === user && enrollment.course === course
      );
      // if not, add the new enrollment into enrollments
      if (!isAlreadyEnrolled) {
        const newEnroll = {
          ...action.payload,
          _id: uuidv4(),
        };
        state.enrollments = [...state.enrollments, newEnroll];
      }
    },
    
    // unenroll the user, according user id and courseid
    unenroll: (state, action) => {
      const { user, course } = action.payload;
      state.enrollments = state.enrollments.filter(
        (enrollment) => !(enrollment.user === user && enrollment.course === course)
      );
    },
  },
});

export const { enroll, unenroll } = enrollmentsSlice.actions;

export default enrollmentsSlice.reducer;
