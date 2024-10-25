import { StyleSheet, Text, View } from "react-native";
import React from "react";

export type SpListItemProps = {
  id: string;
  shootNum: string;
  spValue: string;
  deviceNo: number;
};

const SpListItem = ({ shootNum, spValue, deviceNo }: SpListItemProps) => {
  return (
    <View style={styles.container}>
      <Text
        style={styles.shootNum}
        adjustsFontSizeToFit
        numberOfLines={1}
      >{`No. ${shootNum}`}</Text>
      <Text
        style={styles.spValue}
        adjustsFontSizeToFit
        numberOfLines={1}
      >{`${spValue}`}</Text>
      <Text style={styles.deviceNo} adjustsFontSizeToFit numberOfLines={1}>
        {deviceNo === 0 ? "" : `裝置${deviceNo}`}
      </Text>
    </View>
  );
};

export default SpListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  shootNum: {
    fontSize: 20,
    textAlign: "center",
  },
  spValue: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "left",
  },
  deviceNo: {
    fontSize: 20,
    textAlign: "left",
  },
});
