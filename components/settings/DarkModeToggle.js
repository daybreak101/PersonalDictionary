import { StyleSheet, Text, View, Pressable, Switch } from "react-native";
import React, { useState } from "react";
import { ThemeProvider, useTheme } from "../../context/ThemeContext";

export default function DarkModeToggle() {
  const [isEnabled, setIsEnabled] = useState(false);
  const {
    gradientColor1,
    gradientColor2,
    focusColor,
    unfocusColor,
    textColor,
    backgroundColor,
    fadeColor1,
    fadeColor2,
  } = useTheme();

  const toggleSwitch = () => {
    setIsEnabled((prev) => !prev);
  };

  return (
    <Pressable style={styles.pressable}>
      <Text style={styles.text}>Dark Mode</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "lightgray",
  },

  text: {
    fontSize: 24,
  },
});
