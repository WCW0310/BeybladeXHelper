import { Text, View } from "react-native";
import React from "react";
import { makeStyles } from "@rneui/themed";

const TextPairV = ({
  title,
  value,
  scale = 1,
}: {
  title: string;
  value: string;
  scale?: number;
}) => {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <Text
        style={{ ...styles.title, fontSize: styles.title.fontSize * scale }}
        adjustsFontSizeToFit
        numberOfLines={1}
      >
        {title}
      </Text>
      <Text
        style={{ ...styles.value, fontSize: styles.value.fontSize * scale }}
        adjustsFontSizeToFit
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
};

export default TextPairV;

const useStyles = makeStyles((theme) => ({
  container: {
    flexDirection: "column",
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "bold", color: theme.colors.black },
  value: { fontSize: 40, fontWeight: "bold", color: theme.colors.black },
}));
