import { StyleSheet, Text, Switch, Pressable } from "react-native";
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import RNHapticFeedback from "react-native-haptic-feedback";


export default function HapticFeedback() {
  const { textColor, hapticFeedback, setHapticFeedback } = useTheme();

  const toggleSwitch = async () => {
    if (!hapticFeedback) {
      RNHapticFeedback.trigger("impactHeavy");
    }
    setHapticFeedback((prev) => !prev);
  };
  return (
    <Pressable style={styles.pressable}>
      <Text style={[styles.text, { color: textColor }]}>Haptic Feedback</Text>
      <Switch onValueChange={toggleSwitch} value={hapticFeedback} />
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
