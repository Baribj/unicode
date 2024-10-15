import { User } from "@/schema/User";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ReduxState {
  user: User;
}

const initialState: User = { id: "", name: "", email: "" };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      return action.payload;
    },

    clearUser: (state) => {
      return { id: "", name: "", email: "" };
    },
  },
});

export const userReducer = userSlice.reducer;
export const { setUser, clearUser } = userSlice.actions;
