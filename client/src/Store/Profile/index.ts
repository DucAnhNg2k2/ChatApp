import { createSlice } from "@reduxjs/toolkit";
import { ProfileType } from "../../type/profile-type";

export interface interfaceAuth {
  data: ProfileType;
}
const initProfileSlice: interfaceAuth = {
  data: {
    id: 0,
    userId: 0,
    name: "",
    address: "",
    avatar: "",
  },
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
