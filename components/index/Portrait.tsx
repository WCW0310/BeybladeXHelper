import { Button, Icon, Divider } from "@rneui/themed";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TextPairV from "@/components/index/TextPairV";
import { UiState } from "@/constants/UiState";
import { SpListItemProps } from "@/components/index/SpListItem";

const Portrait = ({
  uiState,
  hideSpList,
  setHideSpList,
  spList,
  clearSpList,
  renderSpListItem,
  isScanning,
  isConnecting,
  isConnected,
  disconnectDevice,
  scanDevices,
}: {
  uiState: UiState;
  hideSpList: boolean;
  setHideSpList: React.Dispatch<React.SetStateAction<boolean>>;
  spList: SpListItemProps[];
  clearSpList: () => void;
  renderSpListItem: ({ item }: { item: SpListItemProps }) => JSX.Element;
  isScanning: boolean;
  isConnecting: boolean;
  isConnected: boolean;
  disconnectDevice: () => Promise<void>;
  scanDevices: () => Promise<void>;
  sendLogClearCommand: () => Promise<void>;
}) => {
  return (
    <>
      <View style={styles.topContainer}>
        <TextPairV title={"射擊次數"} value={uiState.numShootValue} />
        <TextPairV title={"MAX SP"} value={uiState.maxShootPowerValue} />
      </View>
      <Text
        style={styles.currentSpValue}
        adjustsFontSizeToFit
        numberOfLines={1}
      >
        {uiState.shootPowerValue}
      </Text>
      <View style={styles.spListTitleContainer}>
        <TouchableOpacity onPress={() => setHideSpList(!hideSpList)}>
          <Icon
            name={hideSpList ? "down" : "up"}
            type="antdesign"
            color="black"
            size={30}
          ></Icon>
        </TouchableOpacity>
        <Text style={styles.spListTitle} adjustsFontSizeToFit numberOfLines={1}>
          {"最近紀錄"}
        </Text>
        <Button
          title={"清除紀錄"}
          disabled={spList.length === 0}
          onPress={clearSpList}
          color={"primary"}
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
          <Button
            title={
              isScanning
                ? "掃描中"
                : isConnecting
                ? "連結中"
                : isConnected
                ? "切斷連結"
                : "連結裝置"
            }
            disabled={isScanning || isConnecting}
            onPress={() => {
              isConnected ? disconnectDevice() : scanDevices();
            }}
            color={isConnected ? "error" : "primary"}
          />
        </View>
      </View>
    </>
  );
};

export default Portrait;

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  currentSpValue: {
    fontSize: 120,
    textAlign: "center",
    fontWeight: "bold",
  },
  spListTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  spListTitle: { fontSize: 20, fontWeight: "bold" },
  bottomContainer: { marginBottom: 16 },
  connectionStatus: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 8,
  },
  bottomBtnContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  divider: {
    borderWidth: 1,
    margin: 8,
  },
});
