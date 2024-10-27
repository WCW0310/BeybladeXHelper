import { StyleSheet, Text } from "react-native";
import React, { useCallback } from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlashList,
} from "@gorhom/bottom-sheet";
import { ConnectedDeviceState } from "@/constants/ConnectedDeviceState";

const DeviceBottomSheet = ({
  bottomSheetRef,
  connectedDevices,
  renderDeviceListItem,
}: {
  bottomSheetRef: React.RefObject<BottomSheet>;
  connectedDevices: ConnectedDeviceState[];
  renderDeviceListItem: ({
    item,
  }: {
    item: ConnectedDeviceState;
  }) => React.JSX.Element;
}) => {
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        enableTouchThrough
        disappearsOnIndex={-1}
      />
    ),
    []
  );
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
    >
      <Text style={styles.deviceSettingTitle}>{"裝置設定"}</Text>
      <BottomSheetFlashList
        contentContainerStyle={styles.deviceSettingListContainer}
        data={connectedDevices}
        keyExtractor={(item: ConnectedDeviceState) => item.device.id}
        renderItem={renderDeviceListItem}
        estimatedItemSize={100}
      />
    </BottomSheet>
  );
};

export default DeviceBottomSheet;

const styles = StyleSheet.create({
  deviceSettingTitle: {
    textAlign: "center",
    fontSize: 20,
  },
  deviceSettingListContainer: {
    paddingBottom: 48,
  },
});
