import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button, Card } from "@rneui/themed";
import { Device } from "react-native-ble-plx";

export type DeviceListItemProps = {
  id: string;
  shootNum: string;
  maxSpValue: string;
  deviceName: string;
  device: Device;
  disconnectDevice: (device: Device) => Promise<void>;
};

const DeviceListItem = ({
  shootNum,
  maxSpValue,
  deviceName,
  device,
  disconnectDevice,
}: DeviceListItemProps) => {
  return (
    <Card containerStyle={styles.container}>
      <Card.Title
        adjustsFontSizeToFit
        numberOfLines={1}
      >{`裝置${deviceName}`}</Card.Title>
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
  );
};

export default DeviceListItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
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
