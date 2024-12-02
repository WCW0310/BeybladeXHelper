import { Icon } from "@rneui/themed";
import { router, Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "設定",
          headerRight: () => (
            <Icon name="close" size={30} onPress={() => router.back()} />
          ),
        }}
      />
      <Stack.Screen
        name="rememberedDevices"
        options={{
          title: "記錄的裝置",
        }}
      />
    </Stack>
  );
}
