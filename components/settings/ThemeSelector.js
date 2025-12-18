import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useState } from "react";
import { ThemeProvider, useTheme } from "../../context/ThemeContext";
import RNHapticFeedback from "react-native-haptic-feedback";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useSpring,
  withTiming,
  withSpring,
  interpolateColor,
  withDelay,
  Easing,
} from "react-native-reanimated";

export default function ThemeSelector() {
  const {
    themeObject,
    setTheme,
    themeValue,
    setThemeValue,
    textColor,
    hapticFeedback,
  } = useTheme();

  const [contentHeight, setContentHeight] = useState(0);
  const expanded = useSharedValue(0);
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };
  const toggleExpand = () => {
    if (hapticFeedback) {
      RNHapticFeedback.trigger("impactHeavy", options);
    }
    expanded.value = withTiming(expanded.value ? 0 : 1, { duration: 200 });
  };

  const handleContentLayout = (event) => {
    if (contentHeight === 0) {
      setContentHeight(event.nativeEvent.layout.height);
    }
  };

  const animatedExpansionStyle = useAnimatedStyle(() => {
    return {
      opacity: expanded.value
        ? withTiming(1, { duration: 500 })
        : withTiming(0, { duration: 100 }),
      height: expanded.value
        ? withTiming(contentHeight, { duration: 250 })
        : withTiming(0, { duration: 250 }),
    };
  });

  const toggleTheme = async (theme) => {
    if (hapticFeedback) {
      RNHapticFeedback.trigger("effectClick");
    }
    await setTheme(theme);
    await setThemeValue(theme);
  };

  return (
    <>
      <Pressable style={styles.pressable} onPress={() => toggleExpand()}>
        <Text style={[styles.text, { color: textColor }]}>Theme</Text>
        <View style={styles.selectedTheme}>
          <Text style={[styles.selectedText, { color: textColor }]}>
            {themeValue}
          </Text>
          <View style={styles.colors}>
            <View
              style={[
                styles.circle,
                { backgroundColor: themeObject.gradientColor1, left: 0 },
              ]}
            ></View>
            <View
              style={[
                styles.circle,
                { backgroundColor: themeObject.gradientColor2, left: 15 },
              ]}
            ></View>
            <View
              style={[
                styles.circle,
                { backgroundColor: themeObject.focusColor, left: 30 },
              ]}
            ></View>
            <View
              style={[
                styles.circle,
                { backgroundColor: themeObject.unfocusColor, left: 45 },
              ]}
            ></View>
            <View
              style={[
                styles.circle,
                { backgroundColor: themeObject.fadeColor1, left: 60 },
              ]}
            ></View>
            <View
              style={[
                styles.circle,
                { backgroundColor: themeObject.fadeColor2, left: 75 },
              ]}
            ></View>
          </View>
        </View>
      </Pressable>
      <Animated.View
        style={[
          animatedExpansionStyle,
          styles.optionsContainer,
          { overflow: "hidden" },
        ]}
      >
        <View
          style={{ position: "absolute", width: "100%", top: 0, left: 0 }}
          onLayout={handleContentLayout}
        >
          <Pressable
            style={styles.option}
            onPress={() => toggleTheme("Default")}
          >
            <Text style={{ color: textColor }}>Default</Text>
          </Pressable>
          <Pressable
            style={styles.option}
            onPress={() => toggleTheme("Iridescent")}
          >
            <Text style={{ color: textColor }}>Iridescent</Text>
          </Pressable>
          <Pressable
            style={styles.option}
            onPress={() => toggleTheme("Soft Pearl")}
          >
            <Text style={{ color: textColor }}>Soft Pearl</Text>
          </Pressable>
          <Pressable style={styles.option} onPress={() => toggleTheme("Prism")}>
            <Text style={{ color: textColor }}>Prism</Text>
          </Pressable>
          <Pressable style={styles.option} onPress={() => toggleTheme("Comet")}>
            <Text style={{ color: textColor }}>Comet</Text>
          </Pressable>
          <Pressable
            style={styles.option}
            onPress={() => toggleTheme("Monochrome")}
          >
            <Text style={{ color: textColor }}>Monochrome</Text>
          </Pressable>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "lightgray",
  },
  text: {
    fontSize: 24,
  },
  selectedText: {
    fontSize: 12,
    alignSelf: "center",
  },
  selectedTheme: {
    flexDirection: "row",
    right: 100,
  },
  colors: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    right: 0,
  },
  circle: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
  },
  optionsContainer: {
    borderWidth: 1,
    borderColor: "gray",
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
});
