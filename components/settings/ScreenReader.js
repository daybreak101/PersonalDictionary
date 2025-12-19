import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { useTheme } from "../../context/ThemeContext";

export default function ScreenReader() {
  const { textColor, themeObject, darkMode } = useTheme();

  return (
    <Pressable
      style={[
        styles.pressable,
        {
          borderColor: darkMode
            ? themeObject.focusColor
            : themeObject.unfocusColor,   backgroundColor: themeObject.gradientColor2
        },
      ]}
    >
      <Text style={[styles.text, { color: textColor }]}>Screen Reader</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 2,
  },
  text: {
    fontSize: 24,
  },
});
