import { Text } from "react-native";
import React, { useCallback } from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlashList,
  BottomSheetFooter,
  BottomSheetFooterProps,
} from "@gorhom/bottom-sheet";
import { ConnectedDeviceState } from "@/constants/ConnectedDeviceState";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, makeStyles } from "@rneui/themed";
import { Ble } from "@/hooks/useBLE";

const DeviceBottomSheet = ({
  ble,
  bottomSheetRef,
  connectedDevices,
  renderDeviceListItem,
}: {
  ble: Ble;
  bottomSheetRef: React.RefObject<BottomSheet>;
  connectedDevices: ConnectedDeviceState[];
  renderDeviceListItem: ({
    item,
  }: {
    item: ConnectedDeviceState;
  }) => React.JSX.Element;
}) => {
  const styles = useStyles();
  const { scanDevices, stopScan, isScanning, isConnecting } = ble;
  const { bottom } = useSafeAreaInsets();
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
  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter
        {...props}
        bottomInset={bottom}
        animatedFooterPosition={props.animatedFooterPosition}
      >
        <Button
          title={
            isScanning ? "停止掃描" : isConnecting ? "連結中" : "連結新裝置"
          }
          disabled={isConnecting}
          onPress={() => (isScanning ? stopScan() : scanDevices())}
          color={isScanning ? "warning" : "primary"}
          buttonStyle={styles.connectBtn}
          containerStyle={{
            alignSelf: "center",
          }}
        />
      </BottomSheetFooter>
    ),
    [isScanning, isConnecting]
  );
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      footerComponent={renderFooter}
      handleIndicatorStyle={styles.bottomSheetHandleIndicator}
      backgroundStyle={styles.bottomSheetBackground}
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

const useStyles = makeStyles((theme) => ({
  deviceSettingTitle: {
    color: theme.colors.black,
    textAlign: "center",
    fontSize: 20,
  },
  deviceSettingListContainer: {
    paddingBottom: 48,
  },
  connectBtn: {
    alignSelf: "center",
    padding: 12,
    margin: 12,
  },
  bottomSheetHandleIndicator: {
    backgroundColor: theme.colors.black,
  },
  bottomSheetBackground: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.grey4,
  },
}));
