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
import React, { useState, useEffect, createContext, useContext } from "react";
import { useFonts, MonteCarlo_400Regular } from "@expo-google-fonts/montecarlo";
import Foundation from "@expo/vector-icons/Foundation";
import WordOfTheDay from "../components/WordOfTheDay";
import Logo from "../components/Logo";
import WordScreen from "./WordScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import Notification from "../components/Notification";
import { NotifProvider, useNotif } from "../context/NotifContext";
import { useTheme } from "../context/ThemeContext";
import RecentSearches from "../components/RecentSearches";
import { useRefresh } from "../context/RefreshContext";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function SearchScreen({ navigation }) {
  //preload hooks
  let [fontsLoaded] = useFonts({
    MonteCarlo_400Regular,
  });

  const { themeObject, textColor, backgroundColor, darkMode, hapticFeedback } =
    useTheme();
  const { refreshFlag } = useRefresh();

  //states
  const [input, setInput] = useState("");
  const [wordSearched, setWordSearched] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { notifVisible } = useNotif();
  const [recentSearches, setRecentSearches] = useState([]);

  const getRecentSearches = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("recentSearches");
      const searchArray = jsonValue ? JSON.parse(jsonValue) : [];
      setRecentSearches(searchArray);
    } catch (error) {
      console.log("Error loading saved words:", error);
      return [];
    }
  };

  const saveRecentSearch = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem("recentSearches");
      const array = jsonValue != null ? JSON.parse(jsonValue) : [];
      const removeExisting = array.filter((item) => item !== key);

      removeExisting.unshift(key);
      await AsyncStorage.setItem(
        "recentSearches",
        JSON.stringify(removeExisting)
      );
      setRecentSearches(removeExisting);
      console.log("Recent Search Save successful");
    } catch (error) {
      console.log("Error saving recent search:", error);
    }
  };

  useEffect(() => {
    getRecentSearches();
  }, [refreshFlag]);

  useEffect(() => {
    const backAction = () => {
      if (submitted || isFocused) {
        setSubmitted(false);
        setIsFocused(false);
      } else {
        return false;
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [isFocused, submitted]);

  if (!fontsLoaded) {
    return null; // Prevent rendering until fonts are ready
  }

  const handleSubmit = async (word) => {
    if (word === "") {
      setWordSearched(word);
      setInput(word);
      setSubmitted(false);
    } else {
      setWordSearched(word);
      setInput(word);
      setSubmitted(true);
      await saveRecentSearch(word);
    }
  };

  return (
    <View style={styles.page} behavior="padding">
      <View style={[styles.container, { backgroundColor: backgroundColor }]}>
        {isFocused || submitted ? <></> : <Logo />}
        <View style={styles.searchBox}>
          <Animated.View style={styles.inputView}>
            {isFocused ? (
              <Pressable
                onPress={() => {
                  setIsFocused(false);
                  setSubmitted(false);
                  Keyboard.dismiss();
                }}
                style={styles.inputPressable}
              >
                <Ionicons
                  name="chevron-back"
                  size={24}
                  color={
                    darkMode ? themeObject.focusColor : themeObject.unfocusColor
                  }
                />
              </Pressable>
            ) : (
              <></>
            )}
            <TextInput
              style={[
                styles.textInput,
                {
                  borderColor: darkMode
                    ? themeObject.focusColor
                    : themeObject.unfocusColor,
                  color: textColor,
                },
              ]}
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="Search for a word"
              placeholderTextColor={textColor}
              value={input}
              onChangeText={setInput}
              onFocus={() => setIsFocused(true)}
              // onBlur={() => setIsFocused(false)}
              onSubmitEditing={(e) => handleSubmit(e.nativeEvent.text)}
            />
            <Pressable
              style={styles.searchIconContainer}
              onPress={() => handleSubmit(input)}
            >
              <Foundation
                name="magnifying-glass"
                size={30}
                color={
                  darkMode ? themeObject.focusColor : themeObject.unfocusColor
                }
              />
            </Pressable>
          </Animated.View>
          {isFocused && !submitted && (
            <RecentSearches
              recentSearches={recentSearches}
              setRecentSearches={setRecentSearches}
              handleSubmit={handleSubmit}
            />
          )}
        </View>
        {submitted ? (
          <View style={styles.wordList}>
            <WordScreen word={wordSearched} />
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
      {notifVisible && <Notification />}
    </View>
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
  searchBox: {},
  inputView: {
    position: "relative",
    width: "100%",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  inputPressable: {
    width: 40,
  },
  textInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: "black",
    color: "black",
    borderRadius: 10,
    height: 50,
    paddingRight: 50
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
