import { Icon, useTheme } from "@rneui/themed";
import { router, Stack } from "expo-router";

export default function RootLayout() {
  const { theme } = useTheme();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "設定",
          headerTintColor: theme.colors.black,
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerRight: () => (
            <Icon
              name="close"
              size={30}
              color={theme.colors.black}
              onPress={() => router.back()}
            />
          ),
        }}
      />
      <Stack.Screen
        name="rememberedDevices"
        options={{
          title: "記錄的裝置",
          headerTintColor: theme.colors.black,
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      />
    </Stack>
  );
}
