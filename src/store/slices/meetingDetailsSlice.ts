/**
 * @description
 * Redux slice for managing the state of meeting-specific details.
 * This slice holds data like Meeting Name, Agenda, Our Team, and Client Team,
 * and handles loading/saving this content from/to localStorage.
 */

import { createSlice, PayloadAction, createAction } from "@reduxjs/toolkit";
import type { MeetingDetailsState } from "~/types"; // Assuming a MeetingDetailsState type will be created in ~/types
import { getItem, setItem } from "~/utils/localStorage";
import {
  LS_MEETING_NAME_KEY,
  LS_MEETING_AGENDA_KEY,
  LS_OUR_TEAM_KEY,
  LS_CLIENT_TEAM_KEY,
} from "~/utils/constants";

// Action creator for triggering the load from localStorage.
export const loadMeetingDetails = createAction(
  "meetingDetails/loadMeetingDetails"
);

const initialState: MeetingDetailsState = {
  meetingName: getItem(LS_MEETING_NAME_KEY) ?? "",
  meetingAgenda: getItem(LS_MEETING_AGENDA_KEY) ?? "",
  ourTeam: getItem(LS_OUR_TEAM_KEY) ?? "",
  clientTeam: getItem(LS_CLIENT_TEAM_KEY) ?? "",
};

export const meetingDetailsSlice = createSlice({
  name: "meetingDetails",
  initialState,
  reducers: {
    setMeetingName: (state, action: PayloadAction<string>) => {
      state.meetingName = action.payload;
      setItem(LS_MEETING_NAME_KEY, action.payload);
    },
    setMeetingAgenda: (state, action: PayloadAction<string>) => {
      state.meetingAgenda = action.payload;
      setItem(LS_MEETING_AGENDA_KEY, action.payload);
    },
    setOurTeam: (state, action: PayloadAction<string>) => {
      state.ourTeam = action.payload;
      setItem(LS_OUR_TEAM_KEY, action.payload);
    },
    setClientTeam: (state, action: PayloadAction<string>) => {
      state.clientTeam = action.payload;
      setItem(LS_CLIENT_TEAM_KEY, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadMeetingDetails, (state) => {
      state.meetingName = getItem(LS_MEETING_NAME_KEY) ?? "";
      state.meetingAgenda = getItem(LS_MEETING_AGENDA_KEY) ?? "";
      state.ourTeam = getItem(LS_OUR_TEAM_KEY) ?? "";
      state.clientTeam = getItem(LS_CLIENT_TEAM_KEY) ?? "";
    });
  },
});

export const { setMeetingName, setMeetingAgenda, setOurTeam, setClientTeam } =
  meetingDetailsSlice.actions;

export default meetingDetailsSlice.reducer;
