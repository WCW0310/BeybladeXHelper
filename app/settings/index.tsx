import { Button, makeStyles } from "@rneui/themed";
import { router } from "expo-router";
import { View } from "react-native";

export default function Settings() {
  const styles = useStyles();
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

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
    padding: 8,
  },
}));
