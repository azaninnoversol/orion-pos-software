// redux
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrderDrawerState {
  isOpen: boolean;
}

const initialState: OrderDrawerState = {
  isOpen: false,
};

const orderDrawerSlice = createSlice({
  name: "orderDrawer",
  initialState,
  reducers: {
    openDrawer: (state) => {
      state.isOpen = true;
    },
    closeDrawer: (state) => {
      state.isOpen = false;
    },
    toggleDrawer: (state) => {
      state.isOpen = !state.isOpen;
    },
    setDrawerState: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const { openDrawer, closeDrawer, toggleDrawer, setDrawerState } = orderDrawerSlice.actions;

export default orderDrawerSlice.reducer;
