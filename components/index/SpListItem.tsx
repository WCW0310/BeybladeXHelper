import { Text, View } from "react-native";
import React from "react";
import { makeStyles } from "@rneui/themed";

export type SpListItemProps = {
  id: string;
  shootNum: string;
  spValue: string;
  deviceName: string;
};

const SpListItem = ({ shootNum, spValue, deviceName }: SpListItemProps) => {
  const styles = useStyles();
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
      <Text style={styles.deviceName} adjustsFontSizeToFit numberOfLines={1}>
        {`${deviceName}`}
      </Text>
    </View>
  );
};

export default SpListItem;

const useStyles = makeStyles((theme) => ({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  shootNum: {
    fontSize: 20,
    textAlign: "center",
    width: "20%",
    color: theme.colors.black,
  },
  spValue: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    width: "35%",
    color: theme.colors.black,
  },
  deviceName: {
    fontSize: 20,
    textAlign: "center",
    width: "35%",
    color: theme.colors.black,
  },
}));
