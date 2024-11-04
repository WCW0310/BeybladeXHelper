import { SpListItemProps } from "@/components/index/SpListItem";
import { ConnectedDeviceState } from "@/constants/ConnectedDeviceState";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Device } from "react-native-ble-plx";

type IndexState = {
  connectedDevices: ConnectedDeviceState[];
  numShootValue: number;
  maxShootPowerValue: number;
  shootPowerValue: number;
  spList: SpListItemProps[];
};

const initialState: IndexState = {
  connectedDevices: [],
  numShootValue: 0,
  maxShootPowerValue: 0,
  shootPowerValue: 0,
  spList: [],
};

const indexSlice = createSlice({
  name: "index",
  initialState,
  reducers: {
    reset: (state) => {
      state.numShootValue = initialState.numShootValue;
      state.maxShootPowerValue = initialState.maxShootPowerValue;
      state.shootPowerValue = initialState.shootPowerValue;
      state.spList = initialState.spList;
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
    updateShootPower: (state, action: PayloadAction<number>) => {
      state.shootPowerValue = action.payload;
      if (action.payload > state.maxShootPowerValue) {
        state.maxShootPowerValue = action.payload;
      }
    },
    updateSpList: (
      state,
      action: PayloadAction<{
        deviceId: string;
        numShoot: number;
        latestShootPower: number;
      }>
    ) => {
      state.numShootValue += 1;
      const { deviceId, numShoot, latestShootPower } = action.payload;
      state.shootPowerValue = latestShootPower;
      if (latestShootPower > state.maxShootPowerValue) {
        state.maxShootPowerValue = latestShootPower;
      }
      state.spList = [
        {
          id: numShoot + deviceId,
          shootNum: numShoot.toString(),
          spValue: latestShootPower.toString(),
          deviceNo:
            state.connectedDevices.findIndex(
              (value) => value.device.id === deviceId
            ) + 1,
        },
        ...state.spList,
      ];
    },
  },
});

export const actions = indexSlice.actions;
export default indexSlice.reducer;
