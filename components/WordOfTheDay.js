import { Pressable, StyleSheet, Text } from "react-native";
import { useEffect, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";
import data from "../data/randomWord.json";
import { useTheme } from "../context/ThemeContext";
import RNHapticFeedback from "react-native-haptic-feedback";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-worklets";

export default function WordOfTheDay({ isFocused, handleSubmit }) {
  const { themeObject, textColor, hapticFeedback } = useTheme();

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

  const spinValue = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(spinValue.value, [-25, 0, 25], [-15, 0, 180]);

    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotation}deg` }],
    };
  });

  const swipeGesture = Gesture.Pan()
    .onStart((e) => {})
    .onUpdate((e) => {
      spinValue.value = e.translationX / 10;
    })
    .onEnd((e) => {
      if (e.translationX > 100) runOnJS(getWord)();
      spinValue.value = 0;
    });

  return (
    <GestureDetector gesture={swipeGesture}>
      <Animated.View style={[animatedStyle, styles.wordView]}>
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
          </Pressable>
        </LinearGradient>
      </Animated.View>
    </GestureDetector>
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
