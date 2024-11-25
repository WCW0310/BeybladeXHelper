import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "設定",
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
