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
import Filters from "../components/Filters";
import SortBy from "../components/SortBy";

export default function MyWordsList() {
  //collection of words that are currently displayed
  const [renderedWords, setRenderedWords] = useState([]);
  //collection of words that matches filters
  const [savedWords, setSavedWords] = useState([]);
  //entire collection of saved words
  const [fullSavedWords, setFullSavedWords] = useState([]);
  const [currentMax, setCurrentMax] = useState(0);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState("Newest");
  const [filters, setFilters] = useState({});

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

    setRenderedWords((prev) => [
      ...prev,
      ...savedWords.slice(currentMax, nextMax),
    ]);

    setCurrentMax(nextMax);
  };

  const refreshList = async () => {
    const words = await getAllItems();
    setFullSavedWords(words);
    setSavedWords(words);
    setCurrentMax(20);
    setRenderedWords([]);
    requestAnimationFrame(() => {
      setRenderedWords(words.slice(0, 20));
    });
  };

  useEffect(() => {
    refreshList();
    setFilters({});
  }, [refreshFlag]);

  const deleteItem = async (key, refresh) => {
    try {
      const jsonValue = await AsyncStorage.getItem("words");
      const wordsArray = jsonValue != null ? JSON.parse(jsonValue) : [];
      const filteredArray = wordsArray.filter((item) => item.timestamp !== key);
      await AsyncStorage.setItem("words", JSON.stringify(filteredArray));
      console.log("Deletion successful");
      if (refresh) setRefreshFlag((prev) => !prev);
      else {
        setRenderedWords((prev) =>
          prev.filter((item) => item.timestamp !== key)
        );
        setSavedWords((prev) => prev.filter((item) => item.timestamp !== key));
        setFullSavedWords((prev) =>
          prev.filter((item) => item.timestamp !== key)
        );
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

  const applyFilters = async (f) => {
    if (f == null) {
      setFilters({});
      setSavedWords([...fullSavedWords]);
    } else {
      setFilters(f);

      setSavedWords(
        fullSavedWords.filter((word) => {
          let quoteMatch = true;
          let pronounceMatch = true;
          let originMatch = true;
          let relationsMatch = true;
          let nounMatch = false;
          let pronounMatch = false;
          let verbMatch = false;
          let adjectiveMatch = false;
          let adverbMatch = false;
          let prepositionMatch = false;
          let conjunctionMatch = false;
          let interjectionMatch = false;
          let otherMatch = true;
          let partOfSpeechMatch = false;
          partOfSpeechMatch =
            f.noun ||
            f.pronoun ||
            f.verb ||
            f.adjective ||
            f.adverb ||
            f.preposition ||
            f.conjunction ||
            f.interjection ||
            f.other;
          if (f.quotes)
            quoteMatch = word.info.citations.length > 0 ? true : false;
          if (f.pronounce)
            pronounceMatch = word.info.pronounce !== "" ? true : false;
          if (f.origin) originMatch = word.info.origin != null ? true : false;
          if (f.relations)
            relationsMatch =
              word.info.synonyms.length > 0 || word.info.antonyms.length > 0
                ? true
                : false;
          if (f.noun)
            nounMatch = word.info.partOfSpeech === "noun" ? true : false;
          if (f.pronoun)
            pronounMatch = word.info.partOfSpeech === "pronoun" ? true : false;
          if (f.verb)
            verbMatch = word.info.partOfSpeech === "verb" ? true : false;
          if (f.adjective)
            adjectiveMatch =
              word.info.partOfSpeech === "adjective" ? true : false;
          if (f.adverb)
            adverbMatch = word.info.partOfSpeech === "adverb" ? true : false;
          if (f.preposition)
            prepositionMatch =
              word.info.partOfSpeech === "preposition" ? true : false;
          if (f.conjunction)
            conjunctionMatch =
              word.info.partOfSpeech === "conjunction" ? true : false;
          if (f.interjection)
            interjectionMatch =
              word.info.partOfSpeech === "interjection" ? true : false;
          if (f.other) {
            const pof = word.info.partOfSpeech;
            otherMatch =
              pof !== "noun" &&
              pof !== "pronoun" &&
              pof !== "verb" &&
              pof !== "adjective" &&
              pof !== "adverb" &&
              pof !== "preposition" &&
              pof !== "conjunction" &&
              pof !== "interjection"
                ? true
                : false;
          }
          return (
            quoteMatch &&
            pronounceMatch &&
            originMatch &&
            relationsMatch &&
            (!partOfSpeechMatch ||
              nounMatch ||
              pronounMatch ||
              verbMatch ||
              adjectiveMatch ||
              adverbMatch ||
              prepositionMatch ||
              conjunctionMatch ||
              interjectionMatch ||
              otherMatch)
          );
        })
      );
    }
  };

  useEffect(() => {
    setRenderedWords(savedWords.slice(0, 20));
  }, [filters]);

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      <Filters
        modalVisible={filterModalVisible}
        setModalVisible={setFilterModalVisible}
        filters={filters}
        func={applyFilters}
      />
      <SortBy
        fullSavedWords={fullSavedWords}
        savedWords={savedWords}
        setSavedWords={setSavedWords}
        setRenderedWords={setRenderedWords}
        renderedWords={renderedWords}
        modalVisible={sortModalVisible}
        setModalVisible={setSortModalVisible}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <MyWordsSearch
        fullSavedWords={fullSavedWords}
        savedWords={savedWords}
        setSavedWords={setSavedWords}
        setRenderedWords={setRenderedWords}
        renderedWords={renderedWords}
      />
      <View style={styles.options}>
        <Pressable
          style={[styles.option, { backgroundColor: themeObject.focusColor }]}
          onPress={() => setFilterModalVisible(true)}
        >
          <Text style={[styles.optionText]}>Filters</Text>
        </Pressable>
        <Pressable
          style={[styles.option, { backgroundColor: themeObject.focusColor }]}
          onPress={() => setSortModalVisible(true)}
        >
          <Text style={[styles.optionText]}>Sort</Text>
        </Pressable>
      </View>
      <Animated.FlatList
        style={styles.wordList}
        data={renderedWords}
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
            <Text style={{ color: textColor }}>No items found</Text>
          </View>
        }
        ListFooterComponent={() =>
          currentMax < savedWords.length && (
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
  options: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingBottom: 10,
    justifyContent: "space-between",
  },
  option: {
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  optionText: {},
});
