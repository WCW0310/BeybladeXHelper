import EditDeviceDialog from "@/components/settings/EditDeviceDialog";
import { useAppDispatch, useAppSelector } from "@/hooks/useApp";
import { Icon, makeStyles } from "@rneui/themed";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { actions } from "@/slice/rememberedDevicesSlice";

export default function RememberedDevices() {
  const styles = useStyles();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(actions.getRememberedDevicesFromLocalStorage());
  }, [dispatch]);
  const { rememberedDevices } = useAppSelector(
    (state) => state.rememberedDevices
  );
  const { connectedDevices } = useAppSelector((state) => state.index);
  const [editDeviceDialogState, setEditDeviceDialogState] = useState<{
    visible: boolean;
    deviceId: string;
  }>({
    visible: false,
    deviceId: "",
  });
  return (
    <View style={styles.container}>
      {Object.keys(rememberedDevices).map((key) => {
        return (
          <View key={key} style={styles.itemContainer}>
            <Text style={styles.text}>{rememberedDevices[key]}</Text>
            <TouchableOpacity
              onPress={() => {
                setEditDeviceDialogState({ visible: true, deviceId: key });
              }}
            >
              <Icon name="edit" type="antdesign" />
            </TouchableOpacity>
            {connectedDevices.find((value) => value.device.id === key) ? (
              <Text>已連結</Text>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  if (
                    connectedDevices.find((value) => value.device.id === key)
                  ) {
                  }
                  dispatch(actions.removeDevice(key));
                }}
              >
                <Icon name="delete" type="antdesign" color={"red"} />
              </TouchableOpacity>
            )}
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

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
    padding: 8,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  text: {
    color: theme.colors.black,
  },
}));
