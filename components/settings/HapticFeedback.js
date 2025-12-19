import { StyleSheet, Text, Switch, Pressable } from "react-native";
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import RNHapticFeedback from "react-native-haptic-feedback";

export default function HapticFeedback() {
  const {
    textColor,
    hapticFeedback,
    setHapticFeedback,
    darkMode,
    themeObject,
  } = useTheme();

  const toggleSwitch = async () => {
    if (!hapticFeedback) {
      RNHapticFeedback.trigger("impactHeavy");
    }
    setHapticFeedback((prev) => !prev);
  };
  return (
    <Pressable
      style={[
        styles.pressable,
        {
          borderColor: darkMode
            ? themeObject.focusColor
            : themeObject.unfocusColor,
            backgroundColor: themeObject.gradientColor2
        },
      ]}
    >
      <Text style={[styles.text, { color: textColor }]}>Haptic Feedback</Text>
      <Switch onValueChange={toggleSwitch} value={hapticFeedback}         thumbColor={
          hapticFeedback ? themeObject.focusColor : themeObject.unfocusColor
        }
      />
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
    marginBottom: 2
  },
  text: {
    fontSize: 24,
  },
});
