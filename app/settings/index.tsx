import { Button } from "@rneui/themed";
import { router } from "expo-router";
import { View, StyleSheet } from "react-native";

export default function Settings() {
  return (
    <View style={styles.container}>
      <Button
        title={"記錄的裝置"}
        onPress={() => {
          router.navigate("/settings/rememberedDevices");
        }}
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 8,
  },
});
