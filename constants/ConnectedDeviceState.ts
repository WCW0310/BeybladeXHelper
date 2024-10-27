import { Device } from "react-native-ble-plx";
import { DeviceUiState } from "./DeviceUiState";

export type ConnectedDeviceState = { device: Device; uiState: DeviceUiState };
