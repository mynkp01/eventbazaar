import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  adminUser: null,
  isVisibleLogin: false,
  permissions: [],
  adminSideBar: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload;
    },
    setAdminUser: (state, { payload }) => {
      state.adminUser = payload;
    },
    setPermissions: (state, { payload }) => {
      state.permissions = payload;
    },
    setVisibleLoginModal: (state, { payload }) => {
      state.isVisibleLogin = payload;
    },
    setAdminSideBar: (state, { payload }) => {
      state.adminSideBar = payload;
    },
    logout: (state) => {
      state.user = null;
    },
    logoutAdmin: () => {
      return initialState;
    },
  },
  selectors: {
    selectUser: (state) => state.user,
    selectAdminUser: (state) => state.adminUser,
    selectPermissions: (state) => state.permissions,
    selectVisibleLoginModal: (state) => state.isVisibleLogin,
    selectAdminSideBar: (state) => state.adminSideBar,
  },
});

export const {
  setUser,
  setAdminUser,
  setPermissions,
  logout,
  logoutAdmin,
  setVisibleLoginModal,
  setAdminSideBar,
} = authSlice.actions;

export const {
  selectUser,
  selectAdminUser,
  selectPermissions,
  selectVisibleLoginModal,
  selectAdminSideBar,
} = authSlice.selectors;

export default authSlice.reducer;
