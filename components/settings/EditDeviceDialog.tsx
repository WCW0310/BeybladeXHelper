import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Dialog from "react-native-dialog";
import { storage } from "@/managers/StorageManager";

const EditDeviceDialog = ({
  isEditDeviceDialogVisible,
  setIsEditDeviceDialogVisible,
  deviceId,
}: {
  isEditDeviceDialogVisible: boolean;
  setIsEditDeviceDialogVisible: (newState: boolean) => void;
  deviceId: string;
}) => {
  let deviceName = storage.getString(deviceId) ?? "";
  const [editDeviceName, setEditDeviceName] = useState("");
  useEffect(() => {
    deviceName = storage.getString(deviceId) ?? "";
    setEditDeviceName(deviceName);
  }, [deviceId]);
  return (
    <Dialog.Container visible={isEditDeviceDialogVisible}>
      <Dialog.Title>更新裝置名稱</Dialog.Title>
      <Dialog.Input
        placeholder="新裝置名稱"
        value={editDeviceName}
        onChangeText={(text: string) => {
          setEditDeviceName(text);
        }}
      ></Dialog.Input>
      <Dialog.Button
        label="取消"
        onPress={() => {
          setIsEditDeviceDialogVisible(false);
        }}
      />
      <Dialog.Button
        label="確認"
        onPress={() => {
          setIsEditDeviceDialogVisible(false);
          storage.set(deviceId, editDeviceName);
        }}
      />
    </Dialog.Container>
  );
};

export default EditDeviceDialog;

const styles = StyleSheet.create({});
