import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface counterState {
  count: number;
}

const initialState: counterState = { count: 0 };

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state, action: PayloadAction) => {
      state.count++;
    },
    decrement: (state, action: PayloadAction) => {
      state.count--;
    },
  },
});

const { actions, reducer } = counterSlice;

export const { increment, decrement } = actions;

export default reducer;
