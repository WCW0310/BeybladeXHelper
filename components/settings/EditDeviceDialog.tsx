import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Dialog from "react-native-dialog";
import { useAppDispatch, useAppSelector } from "@/hooks/useApp";
import { actions } from "@/slice/rememberedDevicesSlice";

const EditDeviceDialog = ({
  isEditDeviceDialogVisible,
  setIsEditDeviceDialogVisible,
  deviceId,
}: {
  isEditDeviceDialogVisible: boolean;
  setIsEditDeviceDialogVisible: (newState: boolean) => void;
  deviceId: string;
}) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(actions.getRememberedDevicesFromLocalStorage());
  }, [dispatch]);
  const { rememberedDevices } = useAppSelector(
    (state) => state.rememberedDevices
  );
  const [editDeviceName, setEditDeviceName] = useState("");
  useEffect(() => {
    setEditDeviceName(rememberedDevices[deviceId] ?? "");
  }, [deviceId, rememberedDevices]);
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
          dispatch(
            actions.updateDevice({
              deviceId,
              deviceName: editDeviceName,
            })
          );
        }}
      />
    </Dialog.Container>
  );
};

export default EditDeviceDialog;

const styles = StyleSheet.create({});
