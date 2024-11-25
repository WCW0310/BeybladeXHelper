import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Button, Card, Icon } from "@rneui/themed";
import { Device } from "react-native-ble-plx";
import Dialog from "react-native-dialog";
import { storage } from "@/managers/StorageManager";

export type DeviceListItemProps = {
  id: string;
  shootNum: string;
  maxSpValue: string;
  device: Device;
  disconnectDevice: (device: Device) => Promise<void>;
};

const DeviceListItem = ({
  shootNum,
  maxSpValue,
  device,
  disconnectDevice,
}: DeviceListItemProps) => {
  const deviceName = storage.getString(device.id) ?? "";
  const [isEditDeviceDialogVisible, setIsEditDeviceDialogVisible] =
    useState(false);
  const [editDeviceName, setEditDeviceName] = useState(deviceName);
  return (
    <>
      <Card containerStyle={styles.container}>
        <View style={styles.titleContainer}>
          <Card.Title
            adjustsFontSizeToFit
            numberOfLines={1}
          >{`${deviceName}`}</Card.Title>
          <TouchableOpacity
            onPress={() => {
              setIsEditDeviceDialogVisible(true);
            }}
          >
            <Icon name="edit" type="antdesign" />
          </TouchableOpacity>
        </View>
        <Card.Divider />
        <View style={styles.contentContainer}>
          <View style={styles.leftContainer}>
            <Text
              style={styles.shootNum}
              adjustsFontSizeToFit
              numberOfLines={1}
            >{`射擊次數 ${shootNum}`}</Text>
            <Text
              style={styles.spValue}
              adjustsFontSizeToFit
              numberOfLines={1}
            >{`MAX SP ${maxSpValue}`}</Text>
          </View>
          <View style={styles.rightContainer}>
            <Button
              title={"切斷連結"}
              onPress={() => disconnectDevice(device)}
              color={"error"}
            />
          </View>
        </View>
      </Card>
      <View>
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
              storage.set(device.id, editDeviceName);
            }}
          />
        </Dialog.Container>
      </View>
    </>
  );
};

export default DeviceListItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
  },
  leftContainer: {
    flex: 1,
    flexDirection: "column",
  },
  shootNum: {
    fontSize: 20,
    textAlign: "left",
  },
  spValue: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
  },
  rightContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
});
