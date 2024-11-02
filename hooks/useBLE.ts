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
import { SpListItemProps } from "@/components/index/SpListItem";
import { UiState } from "@/constants/UiState";
import { actions } from "@/slice/indexSlice";
import { useAppDispatch, useAppSelector } from "./useApp";
import {
  PERIPHERAL_NAME,
  SERVICE_UUID,
  CHARACTERISTIC_NOTIFY,
  CHARACTERISTIC_WRITE,
} from "@/constants/DeviceUid";

const bleManager = new BleManager();

function useBLE() {
  const dispatch = useAppDispatch();
  const { connectedDevices } = useAppSelector((state) => state.index);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedDevices, setScannedDevices] = useState<Device[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const isConnected = useMemo(
    () => connectedDevices.length > 0,
    [connectedDevices]
  );
  const isMultipleConnected = useMemo(
    () => connectedDevices.length > 1,
    [connectedDevices]
  );
  const [uiState, setUiState] = useState<UiState>({
    deviceId: "",
    shootPowerValue: "0",
    maxShootPowerValue: "0",
    numShootValue: "0",
  });
  const [spList, setSpList] = useState<SpListItemProps[]>([]);
  const shootPowerLog = useRef(
    Array.from({ length: 8 }, () => new Uint8Array(17))
  ).current;
  let checksum = useRef(0).current;

  // 自動停止掃描，並連線
  useEffect(() => {
    if (scannedDevices.length > 0) {
      stopScan();
      connectToDevice(scannedDevices[0]);
    }
  }, [scannedDevices.length]);

  // 更新 SP 列表
  useEffect(() => {
    if (uiState.shootPowerValue !== "0") {
      setSpList((prevState) => {
        return [
          {
            id: uiState.numShootValue + uiState.deviceId,
            shootNum: uiState.numShootValue,
            spValue: uiState.shootPowerValue,
            deviceNo: isMultipleConnected
              ? connectedDevices.findIndex(
                  (value) => value.device.id === uiState.deviceId
                ) + 1
              : 0,
          },
          ...prevState,
        ];
      });
    }
  }, [uiState]);

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
    } else if (!characteristic?.value) {
      console.log("onDataUpdate No Data was received");
      return;
    }
    handleCharacteristicChanged(characteristic.value, characteristic.deviceID);
  };

  const handleCharacteristicChanged = (
    base64Value: string,
    deviceId: DeviceId
  ) => {
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
          setUiState((prevState) => {
            return { ...prevState, shootPowerValue: "?????" };
          });
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
          dispatch(actions.incrementShootNum());
          dispatch(actions.updateMaxShootPower(latestShootPower));
          dispatch(
            actions.updateConnectedDevices({
              deviceId: deviceId,
              maxShootPowerValue: maxShootPower.toString(),
              numShootValue: numShoot.toString(),
            })
          );
          setUiState({
            deviceId: deviceId,
            shootPowerValue: latestShootPower.toString(),
            maxShootPowerValue: maxShootPower.toString(),
            numShootValue: numShoot.toString(),
          });
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
      setUiState((prevState) => {
        return {
          ...prevState,
          shootPowerValue: "0",
          maxShootPowerValue: "0",
          numShootValue: "0",
        };
      });
    } catch (error) {
      console.log("sendLogClearCommand error", error);
    }
  };

  const clearSpList = () => {
    dispatch(actions.reset());
    setSpList([]);
    setUiState((prevState) => {
      return {
        ...prevState,
        shootPowerValue: "0",
      };
    });
  };

  return {
    scanDevices,
    stopScan,
    connectToDevice,
    disconnectDevice,
    clearSpList,
    isScanning,
    isConnecting,
    isConnected,
    uiState,
    spList,
  };
}

export default useBLE;
