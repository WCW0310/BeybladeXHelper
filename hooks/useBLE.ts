import { useEffect, useMemo, useRef, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { Buffer } from "buffer";
import * as ExpoDevice from "expo-device";
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
  DeviceId,
} from "react-native-ble-plx";
import { actions } from "@/store/redux/slices/indexSlice";
import { useAppDispatch, useAppSelector } from "./useApp";
import {
  PERIPHERAL_NAME,
  SERVICE_UUID,
  CHARACTERISTIC_NOTIFY,
  CHARACTERISTIC_WRITE,
} from "@/constants/DeviceUid";

const bleManager = new BleManager();

export type Ble = {
  scanDevices: () => Promise<void>;
  stopScan: () => void;
  disconnectDevice: (device: Device) => Promise<void>;
  clearSpList: () => void;
  isScanning: boolean;
  isConnecting: boolean;
  isConnected: boolean;
};

function useBLE(): Ble {
  const dispatch = useAppDispatch();
  const { connectedDevices } = useAppSelector((state) => state.index);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedDevices, setScannedDevices] = useState<Device[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const isConnected = useMemo(
    () => connectedDevices.length > 0,
    [connectedDevices]
  );

  type DeviceData = {
    shootPowerLog: Uint8Array[];
    checksum: number;
  };
  type DeviceDataMap = Record<DeviceId, DeviceData>;
  const deviceDataRef = useRef<DeviceDataMap>({}).current;
  const ensureDeviceDataIsReady = (deviceId: string) => {
    if (!deviceDataRef[deviceId]) {
      deviceDataRef[deviceId] = {
        shootPowerLog: Array.from({ length: 8 }, () => new Uint8Array(17)),
        checksum: 0,
      };
    }
  };

  // 自動停止掃描，並連線
  useEffect(() => {
    if (scannedDevices.length > 0) {
      stopScan();
      connectToDevice(scannedDevices[0]);
    }
  }, [scannedDevices.length]);

  const scanDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanPeripherals();
    }
  };

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

  const scanPeripherals = () => {
    setIsScanning(true);
    bleManager.startDeviceScan(null, null, (error, scannedDevice) => {
      if (error) {
        console.log("scanPeripherals error", error);
        setIsScanning(false);
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
  };

  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const stopScan = () => {
    bleManager.stopDeviceScan();
    setIsScanning(false);
  };

  const connectToDevice = async (scannedDevice: Device) => {
    try {
      setIsConnecting(true);
      const connectedDevice = await bleManager.connectToDevice(
        scannedDevice.id
      );
      dispatch(actions.addConnectedDevice(connectedDevice));
      setScannedDevices([]);
      const onDeviceDisconnectedSubscription = bleManager.onDeviceDisconnected(
        scannedDevice.id,
        (error, disconnectedDevice) => {
          if (error) {
            console.error("onDeviceDisconnected error", error);
            dispatch(actions.removeConnectedDevice(disconnectedDevice));
            onDeviceDisconnectedSubscription.remove();
            return;
          }
          console.log("onDeviceDisconnected", disconnectedDevice?.id);
          dispatch(actions.removeConnectedDevice(disconnectedDevice));
          onDeviceDisconnectedSubscription.remove();
        }
      );
      await connectedDevice.discoverAllServicesAndCharacteristics();
      startStreamingData(connectedDevice);
    } catch (e) {
      console.log("connectToDevice error", e);
      dispatch(actions.removeConnectedDevice(scannedDevice));
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
    }
    if (!characteristic?.value) {
      console.log("onDataUpdate No Data was received");
      return;
    }
    const deviceId = characteristic.deviceID;
    ensureDeviceDataIsReady(deviceId);
    handleCharacteristicChanged(characteristic.value, deviceId);
  };

  const handleCharacteristicChanged = (
    base64Value: string,
    deviceId: DeviceId
  ) => {
    // 拿到對應裝置的那份 deviceData
    const deviceData = deviceDataRef[deviceId];
    // 解構出裡面的 shootPowerLog 和 checksum
    let { shootPowerLog, checksum } = deviceData;
    const rxValues = Buffer.from(base64Value, "base64");
    // 判斷封包結構
    if (rxValues.length === 17 && rxValues[0] >= 176 && rxValues[0] <= 183) {
      const index = rxValues[0] - 176;
      // index 為 0，則 checksum 歸零，準備新一組封包
      if (index === 0) {
        checksum = 0;
      }
      // 第 7 個封包，就做 checksum 驗證
      if (index === 7) {
        if (checksum !== rxValues[16]) {
          console.log("handleCharacteristicChanged checksum error");
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
          dispatch(
            actions.updateSpList({
              deviceId,
              numShoot,
              latestShootPower,
            })
          );
          dispatch(
            actions.updateConnectedDevices({
              deviceId: deviceId,
              maxShootPowerValue: maxShootPower.toString(),
              numShootValue: numShoot.toString(),
            })
          );
        } else {
          console.log(
            "handleCharacteristicChanged 重置裝置後，索引超出 shootPowerLog 範圍"
          );
        }
        return;
      }
      // 持續累加
      for (let i = 0; i < rxValues.length; i++) {
        shootPowerLog[index][i] = rxValues[i];
        checksum += i === 0 ? 0 : rxValues[i];
        if (checksum > 255) {
          checksum -= 256;
        }
      }
    }
    // 將更新後的 deviceData 放回 deviceDataRef
    deviceDataRef[deviceId] = {
      shootPowerLog,
      checksum,
    };
  };

  const disconnectDevice = async (device: Device) => {
    try {
      const isConnected = await device.isConnected();
      if (isConnected) {
        await device.cancelConnection();
        dispatch(actions.removeConnectedDevice(device));
      } else {
      }
    } catch (error) {
      console.log("disconnectDevice error", error);
    }
  };

  const sendLogClearCommand = async (device: Device) => {
    try {
      const bytes = Buffer.from([117]);
      const base64Value = bytes.toString("base64");
      await device.writeCharacteristicWithoutResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_WRITE,
        base64Value
      );
      dispatch(actions.reset());
    } catch (error) {
      console.log("sendLogClearCommand error", error);
    }
  };

  const clearSpList = () => {
    dispatch(actions.reset());
  };

  return {
    scanDevices,
    stopScan,
    disconnectDevice,
    clearSpList,
    isScanning,
    isConnecting,
    isConnected,
  };
}

export default useBLE;
