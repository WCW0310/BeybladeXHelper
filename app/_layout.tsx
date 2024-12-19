import { createTheme, ThemeProvider } from "@rneui/themed";
import { Provider } from "react-redux";
import { store } from "@/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";

const theme = createTheme({
  components: {
    Button: { radius: 12 },
  },
});

export default function RootLayout() {
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
