import { createTheme, ThemeProvider } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import useBLE from "@/hooks/useBLE";
import SpListItem, { SpListItemProps } from "@/components/SpListItem";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as ScreenOrientation from "expo-screen-orientation";
import Portrait from "./components/Portrait";
import Landscape from "./components/Landscape";

const theme = createTheme({
  lightColors: {},
  darkColors: {},
  components: {
    Button: {
      raised: true,
    },
  },
});

const renderSpListItem = ({ item }: { item: SpListItemProps }) => (
  <SpListItem
    id={item.id}
    shootNum={item.shootNum}
    spValue={item.spValue}
    deviceNo={item.deviceNo}
  />
);

export default function Index() {
  const { width, height } = useWindowDimensions();
  const [currentOrientation, setCurrentOrientation] =
    useState<ScreenOrientation.Orientation>(
      width >= height
        ? ScreenOrientation.Orientation.LANDSCAPE_LEFT
        : ScreenOrientation.Orientation.PORTRAIT_UP
    );
  const [hideSpList, setHideSpList] = useState(false);
  const {
    requestPermissions,
    scanPeripherals,
    disconnectDevice,
    sendLogClearCommand,
    clearSpList,
    isScanning,
    isConnecting,
    isConnected,
    uiState,
    spList,
  } = useBLE();

  const scanDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanPeripherals();
    }
  };

  useEffect(() => {
    ScreenOrientation.addOrientationChangeListener((event) => {
      const orientation = event.orientationInfo.orientation;
      setCurrentOrientation(orientation);
      if (
        orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
      ) {
        setHideSpList(false);
      }
    });
    return () => {
      ScreenOrientation.removeOrientationChangeListeners();
    };
  });

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          {currentOrientation === ScreenOrientation.Orientation.PORTRAIT_UP ||
          currentOrientation === ScreenOrientation.Orientation.PORTRAIT_DOWN ||
          currentOrientation === ScreenOrientation.Orientation.UNKNOWN ? (
            <Portrait
              uiState={uiState}
              hideSpList={hideSpList}
              setHideSpList={setHideSpList}
              spList={spList}
              clearSpList={clearSpList}
              renderSpListItem={renderSpListItem}
              isScanning={isScanning}
              isConnecting={isConnecting}
              isConnected={isConnected}
              disconnectDevice={disconnectDevice}
              scanDevices={scanDevices}
              sendLogClearCommand={sendLogClearCommand}
            />
          ) : (
            <Landscape
              uiState={uiState}
              hideSpList={hideSpList}
              setHideSpList={setHideSpList}
              spList={spList}
              clearSpList={clearSpList}
              renderSpListItem={renderSpListItem}
              isScanning={isScanning}
              isConnecting={isConnecting}
              isConnected={isConnected}
              disconnectDevice={disconnectDevice}
              scanDevices={scanDevices}
              sendLogClearCommand={sendLogClearCommand}
            />
          )}
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
});
