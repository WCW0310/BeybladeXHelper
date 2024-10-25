import { StyleSheet, Text, View } from "react-native";
import React from "react";

const TextPairV = ({
  title,
  value,
  scale = 1,
}: {
  title: string;
  value: string;
  scale?: number;
}) => {
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

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "bold" },
  value: { fontSize: 40, fontWeight: "bold" },
});
