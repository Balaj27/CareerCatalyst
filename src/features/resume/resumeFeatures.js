import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  resumeData: {} // should be an object, not string!
};
export const resumeSlice = createSlice({
  name: "editResume",
  initialState,
  reducers: {
    addResumeData: (state, action) => {
      state.resumeData = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addResumeData } = resumeSlice.actions;

export default resumeSlice.reducer;