import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Constants from "expo-constants";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";
import data from "../data/randomWord.json";
import { useTheme } from "../context/ThemeContext";
import RNHapticFeedback from "react-native-haptic-feedback";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";

export default function WordOfTheDay({
  isFocused,
  setWordSearched,
  handleSubmit,
}) {
  const { themeObject, textColor, backgroundColor, hapticFeedback } =
    useTheme();

  const [word, setWord] = useState("");
  useEffect(() => {
    getWord();
  }, []);

  const getWord = async () => {
    try {
      setWord(data[Math.floor(Math.random() * data.length)]);
    } catch (error) {
      setWord("Cannot fetch word");
      console.log(error);
    }
  };

  return (
    <Animated.View style={[styles.wordView]}>
      <ReanimatedSwipeable
        containerStyle={{ flex: 1 }}
        childrenContainerStyle={{ flex: 1 }}
      >
        <LinearGradient
          colors={[
            themeObject.gradientColor2,
            themeObject.gradientColor2,
            themeObject.unfocusColor,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          locations={[0, 0.6, 1]}
          style={[
            {
              flex: 1,
              display: isFocused ? "none" : "flex",
              shadowColor: themeObject.gradientColor2,
              borderColor: themeObject.focusColor,
            },
            styles.wordBox,
          ]}
        >
          <Pressable
            style={styles.pressable}
            onPress={() => {
              if (hapticFeedback) {
                RNHapticFeedback.trigger("impactHeavy");
              }
              handleSubmit(word);
            }}
          >
            <Text style={[styles.title, { color: textColor }]}>
              Word of the Day
            </Text>
            <Text style={[styles.word, { color: textColor }]}>{word}</Text>
            <Pressable style={styles.refresh} onPress={() => getWord()}>
              <FontAwesome name="refresh" size={24} color="black" />
            </Pressable>
          </Pressable>
        </LinearGradient>
      </ReanimatedSwipeable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wordView: {
    flex: 6,
    width: "100%",
    padding: 20,
  },
  wordBox: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 20,
    elevation: 100,
  },
  pressable: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    alignSelf: "center",
    paddingTop: 20,
  },
  word: {
    fontSize: 24,
    alignSelf: "center",
    paddingTop: 20,
  },
  refresh: {
    position: "absolute",
    right: 15,
    bottom: 15,
    borderRadius: "50%",
    padding: 5,
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
  },
});
