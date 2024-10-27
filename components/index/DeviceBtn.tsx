import { StyleSheet } from "react-native";
import React from "react";
import { Button } from "@rneui/themed";

const DeviceBtn = ({
  isScanning,
  isConnecting,
  isConnected,
  scanDevices,
  stopScan,
  showDeviceBottomSheet,
}: {
  isScanning: boolean;
  isConnecting: boolean;
  isConnected: boolean;
  scanDevices: () => void;
  stopScan: () => void;
  showDeviceBottomSheet: () => void;
}) => {
  return (
    <Button
      title={
        isScanning
          ? "停止掃描"
          : isConnecting
          ? "連結中"
          : isConnected
          ? "裝置設定"
          : "連結裝置"
      }
      disabled={isConnecting}
      onPress={() => {
        isScanning
          ? stopScan()
          : isConnected
          ? showDeviceBottomSheet()
          : scanDevices();
      }}
      color={isScanning ? "warning" : "primary"}
    />
  );
};

export default DeviceBtn;

const styles = StyleSheet.create({});
