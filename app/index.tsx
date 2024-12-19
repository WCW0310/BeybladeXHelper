import React, { useCallback, useEffect, useRef, useState } from "react";
import { useColorScheme, useWindowDimensions } from "react-native";
import useBLE from "@/hooks/useBLE";
import SpListItem, { SpListItemProps } from "@/components/index/SpListItem";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ScreenOrientation from "expo-screen-orientation";
import Portrait from "../components/index/Portrait";
import Landscape from "../components/index/Landscape";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import BottomSheet from "@gorhom/bottom-sheet";
import DeviceListItem from "@/components/index/DeviceListItem";
import { ConnectedDeviceState } from "@/constants/ConnectedDeviceState";
import DeviceBottomSheet from "@/components/index/DeviceBottomSheet";
import { useAppSelector } from "@/hooks/useApp";
import { makeStyles, useThemeMode } from "@rneui/themed";

const renderSpListItem = ({ item }: { item: SpListItemProps }) => (
  <SpListItem
    id={item.id}
    shootNum={item.shootNum}
    spValue={item.spValue}
    deviceName={item.deviceName}
  />
);

export default function Index() {
  const styles = useStyles();
  const colorScheme = useColorScheme();
  const { mode, setMode } = useThemeMode();
  useEffect(() => {
    // 之後要記住選擇的模式
    if (colorScheme && mode && mode !== colorScheme) {
      console.log(
        `mode: ${mode}, colorScheme: ${colorScheme}, 設定主題: ${colorScheme}`
      );
      setMode(colorScheme ?? "light");
    } else {
      console.log(`不設定主題: ${colorScheme}`);
    }
  }, [colorScheme]);

  const { width, height } = useWindowDimensions();

  const [isHideSpList, setIsHideSpList] = useState(false);

  const {
    scanDevices,
    stopScan,
    disconnectDevice,
    clearSpList,
    isScanning,
    isConnecting,
    isConnected,
  } = useBLE();

  const { connectedDevices } = useAppSelector((state) => state.index);

  // BottomSheet
  const bottomSheetRef = useRef<BottomSheet>(null);
  const showDeviceBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };
  useEffect(() => {
    if (connectedDevices.length === 0) {
      bottomSheetRef.current?.close();
    }
  }, [connectedDevices.length]);

  // ScreenOrientation
  const [currentOrientation, setCurrentOrientation] =
    useState<ScreenOrientation.Orientation>(
      width >= height
        ? ScreenOrientation.Orientation.LANDSCAPE_LEFT
        : ScreenOrientation.Orientation.PORTRAIT_UP
    );
  useEffect(() => {
    ScreenOrientation.addOrientationChangeListener((event) => {
      const orientation = event.orientationInfo.orientation;
      setCurrentOrientation(orientation);
      if (
        orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
      ) {
        setIsHideSpList(false);
      }
    });
    return () => {
      ScreenOrientation.removeOrientationChangeListeners();
    };
  });

  // KeepAwake
  useEffect(() => {
    if (isScanning || isConnecting || isConnected) {
      activateKeepAwakeAsync();
    } else {
      deactivateKeepAwake();
    }
    return () => {
      deactivateKeepAwake();
    };
  }, [isScanning, isConnecting, isConnected]);

  const renderDeviceListItem = useCallback(
    ({ item }: { item: ConnectedDeviceState }) => (
      <DeviceListItem
        id={item.device.id}
        shootNum={item.uiState.numShootValue ?? ""}
        maxSpValue={item.uiState.maxShootPowerValue ?? ""}
        device={item.device}
        disconnectDevice={disconnectDevice}
      />
    ),
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      {currentOrientation === ScreenOrientation.Orientation.PORTRAIT_UP ||
      currentOrientation === ScreenOrientation.Orientation.PORTRAIT_DOWN ||
      currentOrientation === ScreenOrientation.Orientation.UNKNOWN ? (
        <Portrait
          hideSpList={isHideSpList}
          setHideSpList={setIsHideSpList}
          clearSpList={clearSpList}
          renderSpListItem={renderSpListItem}
          isScanning={isScanning}
          isConnecting={isConnecting}
          isConnected={isConnected}
          scanDevices={scanDevices}
          stopScan={stopScan}
          showDeviceBottomSheet={showDeviceBottomSheet}
        />
      ) : (
        <Landscape
          hideSpList={isHideSpList}
          setHideSpList={setIsHideSpList}
          clearSpList={clearSpList}
          renderSpListItem={renderSpListItem}
          isScanning={isScanning}
          isConnecting={isConnecting}
          isConnected={isConnected}
          scanDevices={scanDevices}
          stopScan={stopScan}
          showDeviceBottomSheet={showDeviceBottomSheet}
        />
      )}
      <DeviceBottomSheet
        bottomSheetRef={bottomSheetRef}
        connectedDevices={connectedDevices}
        renderDeviceListItem={renderDeviceListItem}
        isScanning={isScanning}
        isConnecting={isConnecting}
        scanDevices={scanDevices}
        stopScan={stopScan}
      />
    </SafeAreaView>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
}));
