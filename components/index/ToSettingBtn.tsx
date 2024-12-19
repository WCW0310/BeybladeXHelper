import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import React from "react";
import { router } from "expo-router";
import { Icon, useTheme } from "@rneui/themed";

const ToSettingBtn = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      style={style}
      onPress={() => {
        router.navigate("/settings");
      }}
    >
      <Icon
        name="setting"
        type="antdesign"
        color={theme.colors.black}
        size={30}
      />
    </TouchableOpacity>
  );
};

export default ToSettingBtn;
