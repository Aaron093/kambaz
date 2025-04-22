import { createSlice } from "@reduxjs/toolkit";
import { enrollments } from "../Database";
const initialState = {
  enrollments: [],
};
const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    setEnrollment: (state, action) => {
      state.enrollments = action.payload;
    },
    toggleEnrollment: (state, { payload: { userId, courseId } }) => {
        const enrollmentIndex = state.enrollments.findIndex(
          (enrollment: any) => enrollment.user === userId && enrollment.course === courseId
        );
        if (enrollmentIndex >= 0) {
          // Unenroll if already enrolled
          state.enrollments.splice(enrollmentIndex, 1);
        } else {
            const newEnrollement: any = {
                _id: new Date().getTime().toString(),
                user: userId,
                course: courseId,  
              };
              state.enrollments = [...state.enrollments, newEnrollement] as any;
        }
      },
    },
},
);
export const { toggleEnrollment, setEnrollment } =
enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;