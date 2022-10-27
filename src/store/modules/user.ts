import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  age: number;
}

const initialState: UserState = { age: 0 };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction) => {
      state.age++;
    },
  },
});

const { actions, reducer } = userSlice;
export const { addUser } = actions;
export default reducer;
