import { createSlice } from "@reduxjs/toolkit";
import { InboxTabList, projectTypeTabList } from "src/app/global";

const initialState = {
  isLoading: false,
  projectType: projectTypeTabList[0],
  inboxType: InboxTabList[0],
  limit: 20,
  chat: null,
};

const utilSlice = createSlice({
  name: "util",
  initialState,
  reducers: {
    setIsLoading: (state, { payload }) => {
      state.isLoading = payload;
    },
    setLimit: (state, { payload }) => {
      state.limit = payload;
    },
    setProjectType: (state, { payload }) => {
      state.projectType = payload;
    },
    setInboxType: (state, { payload }) => {
      state.inboxType = payload;
    },
    setChat: (state, { payload }) => {
      state.chat = payload;
    },

    setUtilsLogout: () => initialState,
  },
  selectors: {
    selectIsLoading: (state) => state.isLoading,
    selectLimit: (state) => state.limit,
    selectProjectType: (state) => state.projectType,
    selectInboxType: (state) => state.inboxType,
    selectChat: (state) => state.chat,
  },
});

export const {
  setIsLoading,
  setLimit,
  setProjectType,
  setInboxType,
  setUtilsLogout,
  setChat,
} = utilSlice.actions;

export const {
  selectIsLoading,
  selectLimit,
  selectProjectType,
  selectInboxType,
  selectChat,
} = utilSlice.selectors;

export default utilSlice.reducer;
