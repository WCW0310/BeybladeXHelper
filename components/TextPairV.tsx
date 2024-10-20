import { StyleSheet, Text, View } from "react-native";
import React from "react";

const TextPairV = ({ title, value }: { title: string; value: string }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
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
