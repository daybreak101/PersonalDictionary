import { StyleSheet, Text, Pressable, Switch } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import RNHapticFeedback from "react-native-haptic-feedback";

export default function DarkModeToggle() {
  const {
    textColor,
    darkMode,
    setDarkMode,
    hapticFeedback,
    themeObject,
  } = useTheme();

  const toggleSwitch = async () => {
    if (hapticFeedback) {
      RNHapticFeedback.trigger("impactHeavy");
    }
    setDarkMode((prev) => !prev);
  };

  return (
    <Pressable
      style={[
        styles.pressable,
        {
          backgroundColor: themeObject.gradientColor2,
        },
      ]}
    >
      <Text style={[styles.text, { color: textColor }]}>Dark Mode</Text>
      <Switch
        onValueChange={toggleSwitch}
        value={darkMode}
        thumbColor={
          darkMode ? themeObject.focusColor : themeObject.unfocusColor
        }
        trackColor={{
          false: textColor,
          true: textColor,
        }}
        borderColor={textColor}
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
  },

  text: {
    fontSize: 24,
  },
});
