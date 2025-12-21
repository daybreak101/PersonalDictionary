import { StyleSheet, Text, View } from "react-native";
import Fontisto from "@expo/vector-icons/Fontisto";
import { useTheme } from "../context/ThemeContext";

export default function Logo() {
  const {
    themeObject, 
    textColor,
    darkMode, 
  } = useTheme();
  return (
    <View style={styles.logoView}>
      <Fontisto name="coffeescript" size={100} color={darkMode ? themeObject.focusColor : themeObject.unfocusColor} />
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
