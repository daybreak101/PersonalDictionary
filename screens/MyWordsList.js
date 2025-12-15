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
import Animated, { LinearTransition } from "react-native-reanimated";

export default function MyWordsList() {
  const [savedWords, setSavedWords] = useState([]);
  const [fullSavedWords, setFullSavedWords] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [currentMax, setCurrentMax] = useState(0);

  const {
    gradientColor1,
    gradientColor2,
    focusColor,
    unfocusColor,
    textColor,
    backgroundColor,
    fadeColor1,
    fadeColor2,
    darkMode,
  } = useTheme();

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

  // useFocusEffect(
  //   useCallback(() => {
  useEffect(() => {
    refreshList();
  }, [refreshFlag]);
  // );

  const deleteItem = async (key) => {
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
      setRefreshFlag((prev) => !prev);
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
            <Text>No items found</Text>
          </View>
        }
        ListFooterComponent={() => (
          <Pressable
            onPress={() => loadMore()}
            style={{
              width: "100%",
              padding: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text>Load More Words</Text>
          </Pressable>
        )}
        contentContainerStyle={{
          paddingVertical: 40,
          paddingHorizontal: 20,
          // backgroundColor: "#ffffffff",
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
