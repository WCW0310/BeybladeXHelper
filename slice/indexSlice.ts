import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type IndexState = {
  numShootValue: number;
  maxShootPowerValue: number;
};

const initialState: IndexState = {
  numShootValue: 0,
  maxShootPowerValue: 0,
};

const indexSlice = createSlice({
  name: "index",
  initialState,
  reducers: {
    reset: () => initialState,
    incrementShootNum: (state) => {
      state.numShootValue += 1;
    },
    updateMaxShootPower: (state, action: PayloadAction<number>) => {
      if (action.payload > state.maxShootPowerValue) {
        state.maxShootPowerValue = action.payload;
      }
    },
  },
});

export const actions = indexSlice.actions;
export default indexSlice.reducer;
