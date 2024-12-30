import { createTheme, ThemeProvider } from "@rneui/themed";
import { Provider } from "react-redux";
import { store } from "@/store/redux/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { storage } from "@/managers/StorageManager";
import { CONFIG_KEY_THEME_MODE } from "@/constants/ConfigKey";
import { ConfigProvider } from "@/store/contexts/ConfigContext";

const theme = createTheme({
  components: {
    Button: { radius: 12 },
  },
});

export default function RootLayout() {
  const rememberedThemeMode = storage.getString(CONFIG_KEY_THEME_MODE);
  if (rememberedThemeMode) {
    theme.mode = rememberedThemeMode as "light" | "dark";
  } else {
    const newThemeMode = useColorScheme() ?? "light";
    theme.mode = newThemeMode;
    storage.set(CONFIG_KEY_THEME_MODE, newThemeMode);
  }
  return (
    <Provider store={store}>
      <GestureHandlerRootView>
        <SafeAreaProvider>
          <ThemeProvider theme={theme}>
            <ConfigProvider>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen
                  name="settings"
                  options={{
                    headerShown: false,
                    presentation: "modal",
                  }}
                />
              </Stack>
            </ConfigProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
