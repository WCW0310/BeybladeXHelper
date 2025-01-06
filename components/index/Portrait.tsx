import { Button, Icon, Divider, makeStyles, useTheme } from "@rneui/themed";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import TextPairV from "@/components/index/TextPairV";
import { SpListItemProps } from "@/components/index/SpListItem";
import DeviceBtn from "./DeviceBtn";
import { useAppSelector } from "@/hooks/useApp";
import ToSettingBtn from "./ToSettingBtn";
import { useConfig } from "@/store/contexts/ConfigContext";

const Portrait = ({
  hideSpList,
  setHideSpList,
  renderSpListItem,
  showDeviceBottomSheet,
}: {
  hideSpList: boolean;
  setHideSpList: React.Dispatch<React.SetStateAction<boolean>>;
  renderSpListItem: ({ item }: { item: SpListItemProps }) => JSX.Element;
  showDeviceBottomSheet: () => void;
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { ble } = useConfig();
  const {
    scanDevices,
    stopScan,
    clearSpList,
    isScanning,
    isConnecting,
    isConnected,
  } = ble;
  const { numShootValue, maxShootPowerValue, spList } = useAppSelector(
    (state) => state.index
  );
  return (
    <>
      <View style={styles.topContainer}>
        <TextPairV title={"射擊次數"} value={numShootValue.toString()} />
        <TextPairV title={"MAX SP"} value={maxShootPowerValue.toString()} />
      </View>
      <Text
        style={styles.currentSpValue}
        adjustsFontSizeToFit
        numberOfLines={1}
      >
        {spList.length > 0 ? spList[0].spValue : "0"}
      </Text>
      <View style={styles.spListTitleContainer}>
        <TouchableOpacity onPress={() => setHideSpList(!hideSpList)}>
          <Icon
            name={hideSpList ? "down" : "up"}
            type="antdesign"
            color={theme.colors.black}
            size={30}
          />
        </TouchableOpacity>
        <Text style={styles.spListTitle} adjustsFontSizeToFit numberOfLines={1}>
          {"最近紀錄"}
        </Text>
        <Button
          title={"清除紀錄"}
          disabled={spList.length === 0}
          onPress={clearSpList}
          color="primary"
          icon={{ name: "refresh", color: "white" }}
          size="sm"
        />
      </View>
      {!hideSpList && (
        <FlatList
          data={spList.filter((_, index) => index !== 0)}
          renderItem={renderSpListItem}
          keyExtractor={(item) => item.id}
        />
      )}
      <Divider style={styles.divider} />
      <View style={styles.bottomContainer}>
        <Text
          style={styles.connectionStatus}
          adjustsFontSizeToFit
          numberOfLines={1}
        >{`連結狀態: ${
          isScanning
            ? "掃描中"
            : isConnecting
            ? "連結中"
            : isConnected
            ? "已連結"
            : "未連結"
        }`}</Text>
        <View style={styles.bottomBtnContainer}>
          <DeviceBtn
            isScanning={isScanning}
            isConnecting={isConnecting}
            isConnected={isConnected}
            scanDevices={scanDevices}
            stopScan={stopScan}
            showDeviceBottomSheet={showDeviceBottomSheet}
          />
          <ToSettingBtn style={styles.toSettingBtn} />
        </View>
      </View>
    </>
  );
};

export default Portrait;

const useStyles = makeStyles((theme) => ({
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  currentSpValue: {
    color: theme.colors.black,
    fontSize: 120,
    textAlign: "center",
    fontWeight: "bold",
  },
  spListTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  spListTitle: { color: theme.colors.black, fontSize: 20, fontWeight: "bold" },
  bottomContainer: { marginBottom: 16 },
  connectionStatus: {
    color: theme.colors.black,
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 8,
  },
  bottomBtnContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "relative",
  },
  toSettingBtn: {
    position: "absolute",
    right: 20,
  },
  divider: {
    borderWidth: 1,
    borderColor: theme.colors.grey4,
    margin: 8,
  },
}));
