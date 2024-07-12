import { createSlice } from "@reduxjs/toolkit";
import { ProfileDTO } from "../../type/ProfileDTO";

export interface interfaceAuth {
  data: ProfileDTO;
}
const initProfileSlice: interfaceAuth = {
  data: {},
};

const ProfileSlice = createSlice({
  name: "profile",
  initialState: initProfileSlice,
  reducers: {
    setProfile(state, action) {
      state.data = action.payload;
    },
  },
});

export const { setProfile } = ProfileSlice.actions;
export default ProfileSlice.reducer;
