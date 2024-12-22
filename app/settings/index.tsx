import { CONFIG_KEY_THEME_MODE } from "@/constants/ConfigKey";
import { storage } from "@/managers/StorageManager";
import { Button, makeStyles, Switch, useThemeMode } from "@rneui/themed";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function Settings() {
  const styles = useStyles();
  const { mode, setMode } = useThemeMode();
  const [darkMode, setDarkMode] = useState(mode === "dark");
  useEffect(() => {
    if (darkMode && mode !== "dark") {
      setMode("dark");
      storage.set(CONFIG_KEY_THEME_MODE, "dark");
    } else if (!darkMode && mode !== "light") {
      setMode("light");
      storage.set(CONFIG_KEY_THEME_MODE, "light");
    }
  }, [darkMode]);
  return (
    <View style={styles.container}>
      <Button
        title={"記錄的裝置"}
        onPress={() => {
          router.navigate("/settings/rememberedDevices");
        }}
      />
      <View style={styles.darkModeContainer}>
        <Text style={styles.darkModeTitle}>深色模式</Text>
        <Switch value={darkMode} onValueChange={setDarkMode}></Switch>
      </View>
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
    padding: 8,
  },
  darkModeContainer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  darkModeTitle: {
    color: theme.colors.black,
    fontSize: 20,
  },
}));
