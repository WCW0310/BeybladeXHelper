import { MMKV } from "react-native-mmkv";

export const storage = new MMKV();

export const getAllRememberedDeviceKeys = () => {
  return storage
    .getAllKeys()
    .filter((value) => !value.startsWith("CONFIG_KEY_"));
};
