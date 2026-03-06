import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  subCategoryId: null,
  subCategoryName: "",
  vendorData: [],
};

const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {
    setCompareData: (state, { payload }) => {
      state.subCategoryId = payload?.id;
      state.subCategoryName = payload?.name;
      state.vendorData = payload?.data;
    },
    removeCompareData: (state, { payload }) => {
      if (state.vendorData?.length === 1) {
        return initialState;
      } else {
        state.vendorData?.splice(payload, 1);
      }
    },
    clearCompareData: () => {
      return initialState;
    },
  },
  selectors: {
    selectCompareData: (state) => state,
  },
});

export const { setCompareData, removeCompareData, clearCompareData } =
  vendorSlice.actions;

export const { selectCompareData } = vendorSlice.selectors;

export default vendorSlice.reducer;
