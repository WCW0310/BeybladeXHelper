import { DeviceId } from "react-native-ble-plx";

export type UiState = {
  deviceId: DeviceId;
  shootPowerValue: string;
  maxShootPowerValue: string;
  numShootValue: string;
};
