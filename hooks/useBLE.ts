import { useRef, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { Buffer } from "buffer";

import * as ExpoDevice from "expo-device";

import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from "react-native-ble-plx";

const PERIPHERAL_NAME = "BEYBLADE_TOOL01";
const SERVICE_UUID = "55C40000-F8EB-11EC-B939-0242AC120002";
const CHARACTERISTIC_NOTIFY = "55C4F002-F8EB-11EC-B939-0242AC120002";
const CHARACTERISTIC_WRITE = "55C4F001-F8EB-11EC-B939-0242AC120002";

const bleManager = new BleManager();

function useBLE() {
  const [scannedDevices, setScannedDevices] = useState<Device[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const shootPowerLog = useRef(
    Array.from({ length: 8 }, () => new Uint8Array(17))
  ).current;
  let checksum = useRef(0).current;
  const [shootPowerValue, setShootPowerValue] = useState("0");
  const [maxShootPowerValue, setMaxShootPowerValue] = useState("0");
  const [numShootValue, setNumShootValue] = useState("0");

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const scanPeripherals = () =>
    bleManager.startDeviceScan(null, null, (error, scannedDevice) => {
      if (error) {
        console.log("scanPeripherals error", error);
      }
      if (scannedDevice && scannedDevice.name === PERIPHERAL_NAME) {
        setScannedDevices((prevState: Device[]) => {
          if (!isDuplicteDevice(prevState, scannedDevice)) {
            return [...prevState, scannedDevice];
          }
          return prevState;
        });
      }
    });
  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const connectToDevice = async (scannedDevice: Device) => {
    try {
      setIsConnecting(true);
      const connectedDevice = await bleManager.connectToDevice(
        scannedDevice.id
      );
      setConnectedDevice(connectedDevice);
      setIsConnected(true);
      const onDeviceDisconnectedSubscription = bleManager.onDeviceDisconnected(
        scannedDevice.id,
        (error, disconnectedDevice) => {
          if (error) {
            console.error("onDeviceDisconnected error", error);
            setIsConnected(false);
            setConnectedDevice(null);
            onDeviceDisconnectedSubscription.remove();
            return;
          }
          console.log("onDeviceDisconnected", disconnectedDevice?.id);
          setIsConnected(false);
          setConnectedDevice(null);
          onDeviceDisconnectedSubscription.remove();
        }
      );
      await connectedDevice.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();
      startStreamingData(connectedDevice);
    } catch (e) {
      console.log("connectToDevice error", e);
      setIsConnected(false);
      setConnectedDevice(null);
    } finally {
      setIsConnecting(false);
    }
  };

  const startStreamingData = async (connectedDevice: Device) => {
    if (connectedDevice) {
      connectedDevice.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_NOTIFY,
        onDataUpdate
      );
    } else {
      console.log("startStreamingData No Device Connected");
    }
  };

  const onDataUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.log("onDataUpdate error", error);
      return;
    } else if (!characteristic?.value) {
      console.log("onDataUpdate No Data was received");
      return;
    }
    handleCharacteristicChanged(characteristic.value);
  };

  const handleCharacteristicChanged = (base64Value: string) => {
    const rxValues = Buffer.from(base64Value, "base64");
    let str = "";
    for (const b of rxValues) {
      str += b.toString(16).padStart(2, "0").toUpperCase();
    }
    if (rxValues.length === 17 && rxValues[0] >= 176 && rxValues[0] <= 183) {
      const index = rxValues[0] - 176;
      if (index === 0) {
        checksum = 0;
      }
      if (index === 7) {
        if (checksum !== rxValues[16]) {
          setShootPowerValue("?????");
          return;
        }
        const maxShootPower = shootPowerLog[6][8] * 256 + shootPowerLog[6][7];
        const numShoot = shootPowerLog[6][10] * 256 + shootPowerLog[6][9];
        const numNotifiedShootPower = shootPowerLog[6][11];
        const latestShootPowerIndex1 = Math.floor(
          (numNotifiedShootPower - 1) / 8
        );
        const latestShootPowerIndex2 =
          ((numNotifiedShootPower - 1) % 8) * 2 + 1;
        if (
          shootPowerLog[latestShootPowerIndex1] &&
          shootPowerLog[latestShootPowerIndex1][latestShootPowerIndex2 + 1] !==
            undefined &&
          shootPowerLog[latestShootPowerIndex1][latestShootPowerIndex2] !==
            undefined
        ) {
          const latestShootPower =
            (shootPowerLog[latestShootPowerIndex1][latestShootPowerIndex2 + 1] &
              0xff) *
              256 +
            (shootPowerLog[latestShootPowerIndex1][latestShootPowerIndex2] &
              0xff);

          setMaxShootPowerValue(maxShootPower.toString());
          setNumShootValue(numShoot.toString());
          setShootPowerValue(latestShootPower.toString());
        } else {
          console.log(
            "handleCharacteristicChanged 重置裝置後，索引超出 shootPowerLog 範圍"
          );
        }
        return;
      }
      for (let i = 0; i < rxValues.length; i++) {
        shootPowerLog[index][i] = rxValues[i];
        checksum += i === 0 ? 0 : rxValues[i];
        if (checksum > 255) {
          checksum -= 256;
        }
      }
    }
  };

  const disconnectDevice = async () => {
    try {
      const isConnected = await connectedDevice?.isConnected();
      if (isConnected) {
        await connectedDevice?.cancelConnection();
        setConnectedDevice(null);
        setIsConnected(false);
      } else {
      }
    } catch (error) {
      console.log("disconnectDevice error", error);
    }
  };

  const sendLogClearCommand = async () => {
    try {
      const bytes = Buffer.from([117]);
      const base64Value = bytes.toString("base64");
      await connectedDevice?.writeCharacteristicWithoutResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_WRITE,
        base64Value
      );
      setMaxShootPowerValue("0");
      setNumShootValue("0");
      setShootPowerValue("0");
    } catch (error) {
      console.log("sendLogClearCommand error", error);
    }
  };

  return {
    requestPermissions,
    scanPeripherals,
    connectToDevice,
    disconnectDevice,
    sendLogClearCommand,
    scannedDevices,
    isConnecting,
    isConnected,
    shootPowerValue,
    maxShootPowerValue,
    numShootValue,
  };
}

export default useBLE;
