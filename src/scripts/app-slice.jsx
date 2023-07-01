import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  navSlide: true,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    changeNavStatus: (state, { payload }) => {
      state.navSlide = payload;
    },
    toggleNav: (state) => {
      state.navSlide = !state.navSlide;
    },
  },
});

export const { changeNavStatus, toggleNav } = appSlice.actions;
export default appSlice.reducer;
