import { storage } from "@/managers/StorageManager";
import { Icon } from "@rneui/themed";
import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function RememberedDevices() {
  const rememberedDeviceKeys = storage.getAllKeys();
  const [isEditDeviceDialogVisible, setIsEditDeviceDialogVisible] =
    useState(false);
  return (
    <View style={styles.container}>
      {rememberedDeviceKeys.map((key) => {
        return (
          <View key={key} style={styles.itemContainer}>
            <Text>{storage.getString(key)}</Text>
            <TouchableOpacity
              onPress={() => {
                setIsEditDeviceDialogVisible(true);
              }}
            >
              <Icon name="edit" type="antdesign" />
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 8,
  },
  itemContainer: {
    flexDirection: "row",
  },
});
