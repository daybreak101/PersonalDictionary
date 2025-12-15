import { StyleSheet, Text, View, Pressable, Vibration } from "react-native";
import React, { useState, useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolateColor,
  SlideInLeft,
  SlideOutRight, 
} from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";
import RNHapticFeedback from "react-native-haptic-feedback";
import { useTheme } from "../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";

export default function DefinitionCard({
  item,
  deleteItem,
  editItem,
  refresh,
  index = 1
}) {
  const navigation = useNavigation()
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDesc, setModalDesc] = useState("");

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

  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  //expansion animation
  const expanded = useSharedValue(0);

  //background animation
  const animatedColorStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        expanded.value,
        [0, 1],
        [unfocusColor, focusColor]
      ),
    };
  });

  return (
    <Animated.View 
    entering={SlideInLeft.duration(1000).delay((index % 20) * 50)}
    exiting={SlideOutRight.duration(400)}
    style={[styles.card, animatedColorStyle, { opacity: 0.9 }]}>
      <LinearGradient
        colors={[gradientColor1, gradientColor2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Pressable style={styles.wordContainer} onPress={() => navigation.navigate("Word Focus", {item: item, editItem: editItem, deleteItem: deleteItem})}>
          <LinearGradient
            colors={[fadeColor1, fadeColor2]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0.75, y: 0 }}
            locations={[0.1, 1]}
            style={{ borderRadius: 25, width: "90%" }}
          >
            <Text style={styles.word}>{item.word}</Text>
          </LinearGradient>
        </Pressable>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#c8c8c8ff",
    elevation: 15,
    shadowColor: "black",
  },
  word: {
    fontSize: 30,
    elevation: 10,
    shadowColor: "white",
    padding: 10,
  },
  definition: {
    fontSize: 20,
    padding: 20,
  },
  wordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },

});
