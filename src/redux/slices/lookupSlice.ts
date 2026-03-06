import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cities: [],
  selectedCity: null,
  verticalsAndEventTypes: [],
  vendorsMenu: [],
  subCategories: [],
};

const lookupSlice = createSlice({
  name: "lookup",
  initialState,
  reducers: {
    setCities: (state, { payload }) => {
      state.cities = payload;
    },
    setSelectedCity: (state, { payload }) => {
      state.selectedCity = payload;
    },
    setVerticalsAndEventTypes: (state, { payload }) => {
      state.verticalsAndEventTypes = payload;
    },
    setVendorsMenu: (state, { payload }) => {
      state.vendorsMenu = payload;
    },
    setSubCategories: (state, { payload }) => {
      state.subCategories = payload;
    },
    clearCities: (state) => {
      state.cities = initialState.cities;
    },
    clearSelectedCity: (state) => {
      state.selectedCity = initialState.selectedCity;
    },
    clearVerticalsAndEventTypes: (state) => {
      state.verticalsAndEventTypes = initialState.verticalsAndEventTypes;
    },
    clearSubCategories: (state) => {
      state.subCategories = initialState.subCategories;
    },
    clearLookupData: () => initialState,
  },
  selectors: {
    selectCitiesData: (state) => state.cities,
    selectSelectedCity: (state) => state.selectedCity,
    selectVerticalsAndEventTypes: (state) => state.verticalsAndEventTypes,
    selectVendorsMenu: (state) => state.vendorsMenu,
    selectSubCategories: (state) => state.subCategories,
  },
});

export const {
  setCities,
  setSelectedCity,
  setVerticalsAndEventTypes,
  setVendorsMenu,
  setSubCategories,
  clearCities,
  clearSelectedCity,
  clearVerticalsAndEventTypes,
  clearSubCategories,
  clearLookupData,
} = lookupSlice.actions;

export const {
  selectCitiesData,
  selectSelectedCity,
  selectVerticalsAndEventTypes,
  selectVendorsMenu,
  selectSubCategories,
} = lookupSlice.selectors;

export default lookupSlice.reducer;
