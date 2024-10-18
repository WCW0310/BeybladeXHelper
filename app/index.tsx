import React from "react";
import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
import useBLE from "@/hooks/useBLE";

export default function Index() {
  const {
    requestPermissions,
    scanPeripherals,
    disconnectDevice,
    sendLogClearCommand,
    isScanning,
    isConnecting,
    isConnected,
    shootPowerValue,
    maxShootPowerValue,
    numShootValue,
  } = useBLE();

  const scanDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanPeripherals();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heartRateTitleWrapper}>
        <Text
          style={styles.heartRateTitleText}
        >{`SP: ${shootPowerValue}`}</Text>
        <Text
          style={styles.heartRateTitleText}
        >{`Max SP: ${maxShootPowerValue}`}</Text>
        <Text
          style={styles.heartRateTitleText}
        >{`射擊次數: ${numShootValue}`}</Text>
        <Text style={styles.heartRateTitleText}>{`連結狀態: ${
          isConnected ? "已連結" : "未連結"
        }`}</Text>
      </View>
      <Button
        title={
          isScanning
            ? "掃描中"
            : isConnecting
            ? "連結中"
            : isConnected
            ? "切斷連結"
            : "連結裝置"
        }
        disabled={isScanning || isConnecting}
        onPress={() => {
          isConnected ? disconnectDevice() : scanDevices();
        }}
      />
      <Button
        title={"重置裝置"}
        disabled={!isConnected}
        onPress={sendLogClearCommand}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  heartRateTitleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heartRateTitleText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 20,
    color: "black",
  },
});
