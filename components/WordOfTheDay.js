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

export default function WordOfTheDay({
  isFocused,
  setWordSearched,
  handleSubmit,
}) {
  const [word, setWord] = useState("");
  useEffect(() => {
    getWord();
  }, []);

  const getWord = async () => {
    try {
      const res = await axios.get("https://api.api-ninjas.com/v1/randomword", {
        headers: { "X-Api-Key": Constants.expoConfig.extra.API_NINJAS_KEY },
      });
      const character = res.data.word[0];
      if (character == character.toUpperCase()) {
        getWord();
      } else {
        setWord(res.data.word);
      }
    } catch (error) {
      setWord("Cannot fetch word");
      console.log(error);
    }
  };

  return (
    <View style={[{ display: isFocused ? "none" : "flex" }, styles.wordView]}>
      <Pressable style={styles.wordBox} onPress={() => handleSubmit(word)}>
        <Text style={styles.title}>Word of the Day</Text>
        <Text style={styles.word}>{word}</Text>
        <Pressable style={styles.refresh} onPress={() => getWord()}>
          <FontAwesome name="refresh" size={24} color="black" />
        </Pressable>
      </Pressable>
    </View>
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
    backgroundColor: "#95c6ffff",
    borderWidth: 2,
    borderColor: "blue",
    borderRadius: 30,
    shadowColor: "blue",
    elevation: 5,
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
