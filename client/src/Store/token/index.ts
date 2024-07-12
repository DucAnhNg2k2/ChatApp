import { createSlice } from "@reduxjs/toolkit";

export interface interfaceToken {
  value: string;
}
const initTokenSlice: interfaceToken = {
  value: "",
};

const TokenSlice = createSlice({
  name: "token",
  initialState: initTokenSlice,
  reducers: {
    setValueToken(state, action) {
      state.value = action.payload;
    },
  },
});

export const { setValueToken } = TokenSlice.actions;
export default TokenSlice.reducer;
