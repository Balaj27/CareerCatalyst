import { configureStore } from "@reduxjs/toolkit";
import resumeReducers from "./features/resume/resumeFeatures";
import userReducers from "./features/user/userFeatures";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  resumeId: null,
  resumeData: {},
};

const editResumeSlice = createSlice({
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
  },
});

export const { setResumeId, setResumeData, updateResumeData, clearResume } = editResumeSlice.actions;
export default editResumeSlice.reducer;

export const resumeStore = configureStore({
  reducer: {
    editResume: resumeReducers,
    editUser: userReducers,
  },
});

export const userStore = configureStore({
  reducer: {
    editUser: userReducers,
  },
});
