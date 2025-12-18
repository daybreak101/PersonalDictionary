import { StyleSheet, Text, View, Pressable, Switch } from "react-native";
import React, { useState } from "react";
import { ThemeProvider, useTheme } from "../../context/ThemeContext";
import RNHapticFeedback from "react-native-haptic-feedback";

export default function DarkModeToggle() {
  const [isEnabled, setIsEnabled] = useState(false);
  const { textColor, darkMode, setDarkMode, hapticFeedback } = useTheme();

  const toggleSwitch = async () => {
    if(hapticFeedback){
      RNHapticFeedback.trigger("impactHeavy")
    }
    setDarkMode((prev) => !prev);
  };

  return (
    <Pressable style={styles.pressable}>
      <Text style={[styles.text, { color: textColor }]}>Dark Mode</Text>
      <Switch onValueChange={toggleSwitch} value={darkMode} />
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
