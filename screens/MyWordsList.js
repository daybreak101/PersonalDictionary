import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  TextInput,
  Keyboard,
  BackHandler,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DefinitionCard from "../components/DefinitionCard";
import { useFocusEffect } from "@react-navigation/native";
import MyWordsSearch from "../components/MyWordsSearch";
import { useTheme } from "../context/ThemeContext";
import { useRefresh } from "../context/RefreshContext";
import Animated, { LinearTransition } from "react-native-reanimated";
import RNHapticFeedback from "react-native-haptic-feedback";

export default function MyWordsList() {
  //collection of words that are currently displayed
  const [renderedWords, setRenderedWords] = useState([]);
  //collection of words that matches filters
  const [savedWords, setSavedWords] = useState([]);
  //entire collection of saved words
  const [fullSavedWords, setFullSavedWords] = useState([]);
  const [currentMax, setCurrentMax] = useState(0);

  const { refreshFlag, setRefreshFlag } = useRefresh();

  const { themeObject, textColor, backgroundColor, hapticFeedback } =
    useTheme();

  const getAllItems = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("words");
      return jsonValue != null ? JSON.parse(jsonValue) : [];
      // setFullSavedWords(wordsArray);
    } catch (error) {
      console.log("Error loading saved words:", error);
      return [];
    }
  };

  const BATCH_SIZE = 20;
  const loadMore = async () => {
    if (currentMax >= fullSavedWords.length) return;

    const nextMax = Math.min(currentMax + BATCH_SIZE, fullSavedWords.length);

    setSavedWords((prev) => [
      ...prev,
      ...fullSavedWords.slice(currentMax, nextMax),
    ]);

    setCurrentMax(nextMax);
  };

  const refreshList = async () => {
    const words = await getAllItems();
    setFullSavedWords(words);
    setCurrentMax(20);
    setSavedWords([]);
    requestAnimationFrame(() => {
      setSavedWords(words.slice(0, 20));
    });
  };

  useEffect(() => {
    refreshList();
  }, [refreshFlag]);

  const deleteItem = async (key, refresh) => {
    try {
      const jsonValue = await AsyncStorage.getItem("words");
      const wordsArray = jsonValue != null ? JSON.parse(jsonValue) : [];
      const filteredArray = wordsArray.filter(
        (item) =>
          // String(item.word) !== String(key)
          item.timestamp !== key
      );
      await AsyncStorage.setItem("words", JSON.stringify(filteredArray));
      console.log("Deletion successful");
      if (refresh) setRefreshFlag((prev) => !prev);
      else {
        setSavedWords((prev) => prev.filter((item) => item.timestamp !== key))
      }
    } catch (error) {
      console.log("Error deleting item:", error);
    }
  };

  const editItem = async (key, updatedCitations) => {
    try {
      const jsonValue = await AsyncStorage.getItem("words");
      const wordsArray = jsonValue != null ? JSON.parse(jsonValue) : [];

      const filteredArray = wordsArray.map((item) =>
        item.timestamp === key
          ? { ...item, info: { ...item.info, citations: updatedCitations } }
          : item
      );

      await AsyncStorage.setItem("words", JSON.stringify(filteredArray));
      console.log("Edit successful");
      setRefreshFlag((prev) => !prev);
    } catch (error) {
      console.log("Error editing item:", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      <MyWordsSearch
        fullSavedWords={fullSavedWords}
        setSavedWords={setSavedWords}
      />
      <Animated.FlatList
        style={styles.wordList}
        data={savedWords}
        keyExtractor={(item) => item.timestamp.toString()}
        renderItem={({ item, index }) => {
          return (
            <DefinitionCard
              item={item}
              deleteItem={deleteItem}
              editItem={editItem}
              refresh={() => getAllItems()}
              index={index}
            />
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListEmptyComponent={
          <View
            style={{
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{color: textColor}}>No items found</Text>
          </View>
        }
        ListFooterComponent={() =>
          currentMax < fullSavedWords.length && (
            <Pressable
              onPress={() => {
                if (hapticFeedback) {
                  RNHapticFeedback.trigger("impactHeavy");
                }
                loadMore();
              }}
              style={{
                width: "100%",
                padding: 20,
                alignItems: "center",
                justifyContent: "center",
                color: textColor,
              }}
            >
              <Text
                style={{
                  color: textColor,
                }}
              >
                Load More Words
              </Text>
            </Pressable>
          )
        }
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 20,
          paddingHorizontal: 20,
        }}
        itemLayoutAnimation={LinearTransition}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  wordList: {
    flex: 1,
  },
  word: {
    padding: 10,
  },
});
