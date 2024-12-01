import EditDeviceDialog from "@/components/settings/EditDeviceDialog";
import { storage } from "@/managers/StorageManager";
import { Icon } from "@rneui/themed";
import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function RememberedDevices() {
  const [rememberedDevicesKeys, setRememberedDevicesKeys] = useState<string[]>(
    storage.getAllKeys()
  );
  const [editDeviceDialogState, setEditDeviceDialogState] = useState<{
    visible: boolean;
    deviceId: string;
  }>({
    visible: false,
    deviceId: "",
  });
  return (
    <View style={styles.container}>
      {rememberedDevicesKeys.map((key) => {
        return (
          <View key={key} style={styles.itemContainer}>
            <Text>{storage.getString(key)}</Text>
            <TouchableOpacity
              onPress={() => {
                setEditDeviceDialogState({ visible: true, deviceId: key });
              }}
            >
              <Icon name="edit" type="antdesign" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                storage.delete(key);
                setRememberedDevicesKeys(
                  rememberedDevicesKeys.filter((value) => value !== key)
                );
              }}
            >
              <Icon name="delete" type="antdesign" color={"red"} />
            </TouchableOpacity>
          </View>
        );
      })}
      <EditDeviceDialog
        isEditDeviceDialogVisible={editDeviceDialogState.visible}
        setIsEditDeviceDialogVisible={(newState) => {
          setEditDeviceDialogState((prevState) => {
            return {
              visible: newState,
              deviceId: prevState.deviceId,
            };
          });
        }}
        deviceId={editDeviceDialogState.deviceId}
      />
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
    alignItems: "center",
    justifyContent: "space-around",
  },
});
