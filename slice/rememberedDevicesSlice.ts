import { getAllRememberedDeviceKeys, storage } from "@/managers/StorageManager";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type RememberedDevicesState = { rememberedDevices: RememberedDeviceState };
type RememberedDeviceState = { [key: string]: string };

const initialState: RememberedDevicesState = { rememberedDevices: {} };

const rememberedDevicesSlice = createSlice({
  name: "rememberedDevices",
  initialState: initialState,
  reducers: {
    getRememberedDevicesFromLocalStorage: (state) => {
      const latestState: RememberedDeviceState = {};
      getAllRememberedDeviceKeys().forEach((key) => {
        latestState[key] = storage.getString(key) ?? "";
      });
      state.rememberedDevices = latestState;
    },
    updateDevice: (
      state,
      action: PayloadAction<{ deviceId: string; deviceName: string }>
    ) => {
      const { deviceId, deviceName } = action.payload;
      state.rememberedDevices[deviceId] = deviceName;
      storage.set(deviceId, deviceName);
    },
    removeDevice: (state, action: PayloadAction<string>) => {
      const deviceId = action.payload;
      delete state.rememberedDevices[deviceId];
      storage.delete(deviceId);
    },
  },
});

export const actions = rememberedDevicesSlice.actions;
export default rememberedDevicesSlice.reducer;
