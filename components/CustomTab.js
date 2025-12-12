import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import RNHapticFeedback from "react-native-haptic-feedback";
import { useTheme } from "../context/ThemeContext";
import LinearGradient from "react-native-linear-gradient";

export default function CustomTab({
  state,
  descriptors,
  navigation,
  themeValue,
}) {
  const {
    gradientColor1,
    gradientColor2,
    focusColor,
    unfocusColor,
    textColor,
    backgroundColor,
    fadeColor1,
    fadeColor2,
    moduleColor,
  } = useTheme();
  return (
    <LinearGradient
      colors={[unfocusColor, backgroundColor]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      locations={[0, 1]}
      style={[styles.tabBarContainer]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          RNHapticFeedback.trigger("impactHeavy", options);
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
          >
            <LinearGradient
              colors={[focusColor, gradientColor2]}
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0 }}
              locations={[0, 1]}
              style={[styles.background]}
            >
              {options.tabBarIcon &&
                options.tabBarIcon({
                  focused: isFocused,
                  color: "black",
                  size: 24,
                })}
              {isFocused && <Text style={[styles.word]}>{label}</Text>}
            </LinearGradient>
          </TouchableOpacity>
        );
      })}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    // borderTopWidth: 1,
    // borderTopColor: "#eee",
    paddingVertical: 0,
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  background: {
    borderRadius: 25,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  word: {
    fontSize: 12,
    color: "black",
  },
});
