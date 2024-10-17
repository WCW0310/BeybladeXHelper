import React, { useEffect } from "react";
import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
import useBLE from "@/hooks/useBLE";

export default function Index() {
  const {
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
  } = useBLE();

  const scanDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanPeripherals();
    }
  };

  useEffect(() => {
    if (!isConnected) {
      console.log("start scan devices");
      scanDevices();
    }
  }, [isConnected]);

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
        title={isConnecting ? "連結中" : isConnected ? "切斷連結" : "連結裝置"}
        disabled={scannedDevices.length === 0 || isConnecting}
        onPress={() => {
          isConnected ? disconnectDevice() : connectToDevice(scannedDevices[0]);
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
