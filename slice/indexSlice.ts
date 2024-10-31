import { ConnectedDeviceState } from "@/constants/ConnectedDeviceState";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Device } from "react-native-ble-plx";

type IndexState = {
  connectedDevices: ConnectedDeviceState[];
  numShootValue: number;
  maxShootPowerValue: number;
};

const initialState: IndexState = {
  connectedDevices: [],
  numShootValue: 0,
  maxShootPowerValue: 0,
};

const indexSlice = createSlice({
  name: "index",
  initialState,
  reducers: {
    reset: (state) => {
      state.numShootValue = initialState.numShootValue;
      state.maxShootPowerValue = initialState.maxShootPowerValue;
    },
    addConnectedDevice: (state, action: PayloadAction<Device>) => {
      state.connectedDevices.push({
        device: action.payload,
        uiState: { deviceName: (state.connectedDevices.length + 1).toString() },
      });
    },
    removeConnectedDevice: (state, action: PayloadAction<Device | null>) => {
      state.connectedDevices = state.connectedDevices.filter(
        (value) => value.device.id !== action.payload?.id
      );
    },
    updateConnectedDevices: (
      state,
      action: PayloadAction<{
        deviceId: string;
        maxShootPowerValue?: string;
        numShootValue?: string;
      }>
    ) => {
      const { deviceId, maxShootPowerValue, numShootValue } = action.payload;
      state.connectedDevices = state.connectedDevices.map((value) =>
        value.device.id === deviceId
          ? {
              ...value,
              uiState: {
                ...value.uiState,
                maxShootPowerValue,
                numShootValue,
              },
            }
          : value
      );
    },
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
