import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { useTheme } from "../../context/ThemeContext";

export default function ScreenReader() {
  const {
    gradientColor1,
    gradientColor2,
    focusColor,
    unfocusColor,
    textColor,
    backgroundColor,
    fadeColor1,
    fadeColor2,
    darkMode,
  } = useTheme();


  return (
    <Pressable style={styles.pressable}>
      <Text style={[styles.text, {color: textColor}]}>Screen Reader</Text>
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
    borderColor: "lightgray",
  },
  text: {
    fontSize: 24,
  },
});
