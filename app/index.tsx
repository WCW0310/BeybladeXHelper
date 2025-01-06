import React, { useCallback, useEffect, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";
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
import { makeStyles } from "@rneui/themed";
import { useConfig } from "@/store/contexts/ConfigContext";
import Landscape2p from "@/components/index/Landscape2p";

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

  const { width, height } = useWindowDimensions();

  const { ble, gameMode } = useConfig();
  const { disconnectDevice, isScanning, isConnecting, isConnected } = ble;

  const [isHideSpList, setIsHideSpList] = useState(false);

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
  useEffect(() => {
    if (gameMode === "2P") {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    } else {
      ScreenOrientation.unlockAsync();
    }
  }, [gameMode]);

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
      {(currentOrientation === ScreenOrientation.Orientation.PORTRAIT_UP ||
        currentOrientation === ScreenOrientation.Orientation.PORTRAIT_DOWN ||
        currentOrientation === ScreenOrientation.Orientation.UNKNOWN) &&
      gameMode !== "2P" ? (
        <Portrait
          hideSpList={isHideSpList}
          setHideSpList={setIsHideSpList}
          renderSpListItem={renderSpListItem}
          showDeviceBottomSheet={showDeviceBottomSheet}
        />
      ) : gameMode === "SINGLE" ? (
        <Landscape
          renderSpListItem={renderSpListItem}
          showDeviceBottomSheet={showDeviceBottomSheet}
        />
      ) : (
        <Landscape2p
          renderSpListItem={renderSpListItem}
          showDeviceBottomSheet={showDeviceBottomSheet}
        />
      )}
      <DeviceBottomSheet
        ble={ble}
        bottomSheetRef={bottomSheetRef}
        connectedDevices={connectedDevices}
        renderDeviceListItem={renderDeviceListItem}
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
