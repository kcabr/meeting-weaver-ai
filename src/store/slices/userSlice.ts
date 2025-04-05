/*
<ai_context>
This file defines a Redux slice for managing user state in the application.
It handles user authentication data and subscription information.

The slice provides:
- A typed interface for user properties (id, name, email, etc.)
- Default initial state with null values
- Reducers for setting user data and clearing user state
- Action creators that can be dispatched throughout the app

This state would typically be updated when users log in/out or when 
their subscription status changes through payment processing.
</ai_context>
*/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  profileImageUrl: string | null;
  isLoaded: boolean;
  subscriptionPeriodEnd: Date | null;
}

const initialState: UserState = {
  id: null,
  firstName: null,
  lastName: null,
  email: null,
  profileImageUrl: null,
  isLoaded: false,
  subscriptionPeriodEnd: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
    clearUser: (state) => {
      return initialState;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
