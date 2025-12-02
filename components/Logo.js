import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Fontisto from "@expo/vector-icons/Fontisto";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function Logo() {
  return (
    <View style={styles.logoView}>
      <FontAwesome6 name="readme" size={100} color="black" />
      <Fontisto name="coffeescript" size={100} color="black" />
      <Text style={styles.logoText}>PersonalDictionary</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logoView: {
    flex: 10,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  logoText: {
    fontFamily: "MonteCarlo_400Regular",
    fontSize: 40,
    alignSelf: "center"
  },
});
