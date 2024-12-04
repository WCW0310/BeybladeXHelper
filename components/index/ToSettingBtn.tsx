import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import React from "react";
import { router } from "expo-router";
import { Icon } from "@rneui/themed";

const ToSettingBtn = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  return (
    <TouchableOpacity
      style={style}
      onPress={() => {
        router.navigate("/settings");
      }}
    >
      <Icon name="setting" type="antdesign" color="black" size={30} />
    </TouchableOpacity>
  );
};

export default ToSettingBtn;
