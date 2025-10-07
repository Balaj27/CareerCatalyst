import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  resumeId: null,
  resumeData: {}
};

export const resumeSlice = createSlice({
  name: "editResume",
  initialState,
  reducers: {
    setResumeId: (state, action) => {
      state.resumeId = action.payload;
    },
    setResumeData: (state, action) => {
      state.resumeData = action.payload;
    },
    updateResumeData: (state, action) => {
      state.resumeData = { ...state.resumeData, ...action.payload };
    },
    clearResume: (state) => {
      state.resumeId = null;
      state.resumeData = {};
    },
    addResumeData: (state, action) => {
      state.resumeData = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setResumeId, setResumeData, updateResumeData, clearResume, addResumeData } = resumeSlice.actions;

export default resumeSlice.reducer;