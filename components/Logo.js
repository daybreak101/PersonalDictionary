import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Fontisto from "@expo/vector-icons/Fontisto";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useTheme } from "../context/ThemeContext";

export default function Logo() {
  const {
    textColor,
    darkMode, 
    focusColor,
    unfocusColor
  } = useTheme();
  return (
    <View style={styles.logoView}>
      {/* <FontAwesome6 name="readme" size={100} color={darkMode ? focusColor : unfocusColor} /> */}
      <Fontisto name="coffeescript" size={100} color={darkMode ? focusColor : unfocusColor} />
      <Text style={[styles.logoText, {color: textColor}]}>PersonalDictionary</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logoView: {
    position: "relative",
    flex: 10,
    justifyContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    position: "absolute",
    bottom: 10,
    fontFamily: "MonteCarlo_400Regular",
    fontSize: 40,
    alignSelf: "center",
  },
});
