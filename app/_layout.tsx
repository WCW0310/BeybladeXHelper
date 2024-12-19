import { createTheme, ThemeProvider } from "@rneui/themed";
import { Provider } from "react-redux";
import { store } from "@/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

const theme = createTheme({
  components: {
    Button: { radius: 12 },
  },
});

export default function RootLayout() {
  theme.mode = useColorScheme() ?? "light"; // TODO: 套用 App 本地紀錄在設定的主題模式
  return (
    <Provider store={store}>
      <GestureHandlerRootView>
        <SafeAreaProvider>
          <ThemeProvider theme={theme}>
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
          </ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
