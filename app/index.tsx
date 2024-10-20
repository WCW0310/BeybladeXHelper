import {
  createTheme,
  ThemeProvider,
  Button,
  Icon,
  Divider,
} from "@rneui/themed";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useBLE from "@/hooks/useBLE";
import TextPairV from "@/components/TextPairV";
import SpListItem, { SpListItemProps } from "@/components/SpListItem";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const theme = createTheme({
  lightColors: {},
  darkColors: {},
  components: {
    Button: {
      raised: true,
    },
  },
});

const renderSpListItem = ({ item }: { item: SpListItemProps }) => (
  <SpListItem
    id={item.id}
    shootNum={item.shootNum}
    spValue={item.spValue}
    deviceNo={item.deviceNo}
  />
);

export default function Index() {
  const [hideSpList, setHideSpList] = useState(false);
  const {
    requestPermissions,
    scanPeripherals,
    disconnectDevice,
    sendLogClearCommand,
    clearSpList,
    isScanning,
    isConnecting,
    isConnected,
    isMultipleConnected,
    uiState,
    spList,
  } = useBLE();

  const scanDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanPeripherals();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.topContainer}>
            <TextPairV title={"射擊次數"} value={uiState.numShootValue} />
            <TextPairV title={"MAX SP"} value={uiState.maxShootPowerValue} />
          </View>
          <Text style={styles.currentSpValue}>{uiState.shootPowerValue}</Text>
          <View style={styles.spListTitleContainer}>
            <TouchableOpacity onPress={() => setHideSpList(!hideSpList)}>
              <Icon
                name={hideSpList ? "down" : "up"}
                type="antdesign"
                color="black"
                size={30}
              ></Icon>
            </TouchableOpacity>
            <Text style={styles.spListTitle}>{"最近紀錄"}</Text>
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
            <Text style={styles.connectionStatus}>{`連結狀態: ${
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
              <Button
                title={"重置裝置"}
                disabled={!isConnected}
                onPress={() => {
                  Alert.alert(
                    "重置裝置警告",
                    "重置裝置後，現存資料將會全部刪除, 無法上傳至官方 App, 確定要繼續嗎?",
                    [
                      {
                        text: "確定",
                        style: "destructive",
                        onPress: () => {
                          sendLogClearCommand();
                        },
                      },
                      {
                        text: "取消",
                        style: "cancel",
                      },
                    ]
                  );
                }}
                color={"error"}
                icon={{ name: "delete", color: "white" }}
              />
            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
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
    textAlign: "left",
    fontWeight: "bold",
    marginLeft: 30,
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
