import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  BackHandler,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useFonts, MonteCarlo_400Regular } from "@expo-google-fonts/montecarlo";
import Foundation from "@expo/vector-icons/Foundation";
import WordOfTheDay from "../components/WordOfTheDay";
import Logo from "../components/Logo";
import WordScreen from "./WordScreen";
import LinearGradient from "react-native-linear-gradient";

export default function SearchScreen({ navigation }) {
  //preload hooks
  let [fontsLoaded] = useFonts({
    MonteCarlo_400Regular,
  });

  //states
  const [input, setInput] = useState("");
  const [wordSearched, setWordSearched] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!fontsLoaded) {
    return null; // Prevent rendering until fonts are ready
  }

  const handleSubmit = (word) => {
    if (word === "") {
      setWordSearched(word);
      setInput(word);
      setSubmitted(false);
    } else {
      setWordSearched(word);
      setInput(word);
      setSubmitted(true);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.page} behavior="padding">
      <View style={styles.container}>
        {isFocused || submitted ? <></> : <Logo />}
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Search for a word"
            placeholderTextColor="gray"
            value={input}
            onChangeText={setInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onSubmitEditing={(e) => handleSubmit(e.nativeEvent.text)}
          />
          <Pressable
            style={styles.searchIconContainer}
            onPress={() => handleSubmit(input)}
          >
            <Foundation name="magnifying-glass" size={30} color="black" />
          </Pressable>
        </View>
        {submitted ? (
          <View style={styles.wordList}>
            <LinearGradient
              colors={["#33ccffff", "#ffffff21"]}
              style={[styles.fade, {top: 0}]}
            ></LinearGradient>
            <WordScreen word={wordSearched} />
            <LinearGradient
              colors={["#ffffff21", "#ff99ccff"]}
              style={[styles.fade, {bottom: 0}]}
            ></LinearGradient>
          </View>
        ) : (
          <WordOfTheDay
            isFocused={isFocused}
            navigation={navigation}
            setWordSearched={setWordSearched}
            handleSubmit={handleSubmit}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    
  },
  inputView: {
    position: "relative",
    width: "100%",
    padding: 20,
  },
  textInput: {
    borderWidth: 2,
    borderColor: "black",
    width: "100%",
    color: "black",
    borderRadius: 10,
    height: 50,
  },
  searchIconContainer: {
    position: "absolute",
    right: 30,
    top: 30,
  },

  wordList: {
    position: "relative",
    flex: 1,
  },

  fade: {
    position: "absolute",
    height: 30,
    width: "100%",
    zIndex: 10,
  },
});
