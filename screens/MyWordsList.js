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
  const [filters, setFilters] = useState({
    quotes: false,
    pronounce: false,
    origin: false,
    relations: false,
    noun: false,
    pronoun: false,
    verb: false,
    adjective: false,
    adverb: false,
    preposition: false,
    conjunction: false,
    interjection: false,
    other: false,
  });
  const [input, setInput] = useState("");
  const [submit, setSubmit] = useState(false);
  const [searched, setSearched] = useState("");

  const { refreshFlag, setRefreshFlag } = useRefresh();

  const {
    themeValue,
    themeObject,
    textColor,
    backgroundColor,
    hapticFeedback,
  } = useTheme();

  //load all words from local storage
  const getAllItems = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("words");
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.log("Error loading saved words:", error);
      return [];
    }
  };

  //update the rendered list with at most 20 more words that follows filter and sort rules
  const BATCH_SIZE = 20;
  const loadMore = async () => {
    if (currentMax >= savedWords.length) return;

    const nextMax = Math.min(currentMax + BATCH_SIZE, savedWords.length);

    setRenderedWords((prev) => [
      ...prev,
      ...savedWords.slice(currentMax, nextMax),
    ]);

    setCurrentMax(nextMax);
  };

  //refreshList and useEffect are responsible to reset the entire
  //screen state to its default render.
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
    setSortBy("Newest");
    setInput("");
  }, [refreshFlag]);

  //delete word from state & storage. Key is word's timestamp and refresh is a
  // boolean that determines if screen needs a complete refresh or not.
  const deleteItem = async (key, refresh) => {
    try {
      const jsonValue = await AsyncStorage.getItem("words");
      const wordsArray = jsonValue != null ? JSON.parse(jsonValue) : [];
      const filteredArray = wordsArray.filter((item) => item.timestamp !== key);
      await AsyncStorage.setItem("words", JSON.stringify(filteredArray));
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

  //editItem is done by finding a word using it's timestamp as key, and update it
  // with an entire new updatedCitations that was created in WordFocus component.
  // This would update in local storage, state is handled elsewhere.
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
      setRefreshFlag((prev) => !prev);
    } catch (error) {
      console.log("Error editing item:", error);
    }
  };

  //search using input passed in as "word" from MyWordsSearch component,
  //  returning a list of words that follows filter and sort rules.
  const search = async (word) => {
    setInput(word);
    setSearched(word);
    await applyFilters(filters, word);
    setSubmit((prev) => !prev);
  };

  //function that returns a list of words that follows the user-selected
  // filter and sort rules.
  const applyFilters = async (f, searchText = input) => {
    //reset list to show only first 20
    setCurrentMax(20);
    //if user removes all filters go here
    if (f == null && searchText === "") {
      setFilters({});
      setSavedWords(
        [...fullSavedWords].sort((a, b) => {
          switch (sortBy) {
            case "Newest":
              return b.timestamp - a.timestamp;
            case "Oldest":
              return a.timestamp - b.timestamp;
            case "Alphabetical":
              return a.info.word.localeCompare(b.info.word, undefined, {
                sensitivity: "base",
              });
            case "Reverse Alphabet":
              return b.info.word.localeCompare(a.info.word, undefined, {
                sensitivity: "base",
              });
            case "Longest":
              return b.info.word.length - a.info.word.length;
            case "Shortest":
              return a.info.word.length - b.info.word.length;
          }
        })
      );
    }
    //if user has a filter selected or searched for a word, go here
    else {
      const activeFilters = f ?? filters;
      setFilters(activeFilters);
      setSavedWords(
        fullSavedWords
          .filter((word) => {
            //start by filtering out words that don't match the input if it has one
            let searchMatch =
              word.info.word.toLowerCase().includes(searchText.toLowerCase()) ||
              input === ""
                ? true
                : false;

            //initialize booleans. 
            //First four are initialized as true first in case user has not selected them as a filter
            //relations refer to synonyms/antonyms
            let quoteMatch = true;
            let pronounceMatch = true;
            let originMatch = true;
            let relationsMatch = true;
            //Since parts of speech returns any word that matches any selected part of speech filter,
            //we create these rules:
            //if any part of speech is selected, we make partOfSpeechMatch true, otherwise false
            //if partOfSpeechMatch is true, then one of the individual part of speeches must be true
            //if partOfSpeechMatch is false, then we can ignore the individuals and just return true.
            let nounMatch = false;
            let pronounMatch = false;
            let verbMatch = false;
            let adjectiveMatch = false;
            let adverbMatch = false;
            let prepositionMatch = false;
            let conjunctionMatch = false;
            let interjectionMatch = false;
            let otherMatch = false;
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
              pronounMatch =
                word.info.partOfSpeech === "pronoun" ? true : false;
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
              searchMatch &&
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
          .sort((a, b) => {
            //then finally sort the list by preferred sorting option.
            switch (sortBy) {
              case "Newest":
                return b.timestamp - a.timestamp;
              case "Oldest":
                return a.timestamp - b.timestamp;
              case "Alphabetical":
                return a.info.word.localeCompare(b.info.word, undefined, {
                  sensitivity: "base",
                });
              case "Reverse Alphabet":
                return b.info.word.localeCompare(a.info.word, undefined, {
                  sensitivity: "base",
                });
              case "Longest":
                return b.info.word.length - a.info.word.length;
              case "Shortest":
                return a.info.word.length - b.info.word.length;
            }
          })
      );
    }
  };

  //run this when filters have changed, or input has been submitted
  useEffect(() => {
    setRenderedWords(savedWords.slice(0, 20));
  }, [filters, submit]);

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      <Filters
        modalVisible={filterModalVisible}
        setModalVisible={setFilterModalVisible}
        filters={filters}
        func={applyFilters}
      />
      <SortBy
        modalVisible={sortModalVisible}
        setModalVisible={setSortModalVisible}
        sortBy={sortBy}
        setSortBy={setSortBy}
        func={applyFilters}
      />
      <MyWordsSearch
        filters={filters}
        input={input}
        setInput={setInput}
        func={search}
      />
      <View style={styles.options}>
        <Pressable
          style={[
            styles.option,
            {
              backgroundColor:
                themeValue === "Comet" || themeValue === "Default"
                  ? themeObject.gradientColor2
                  : themeObject.focusColor,
            },
          ]}
          onPress={() => setFilterModalVisible(true)}
        >
          <Text
            style={[
              styles.optionText,
              { color: themeValue === "Comet" ? "white" : "black" },
            ]}
          >
            Filters
          </Text>
        </Pressable>
        {searched !== "" && (
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.searched, { color: textColor }]}
          >
            Searched for: {searched}
          </Text>
        )}
        <Pressable
          style={[
            styles.option,
            {
              backgroundColor:
                themeValue === "Comet" || themeValue === "Default"
                  ? themeObject.gradientColor2
                  : themeObject.focusColor,
            },
          ]}
          onPress={() => setSortModalVisible(true)}
        >
          <Text
            style={[
              styles.optionText,
              { color: themeValue === "Comet" ? "white" : "black" },
            ]}
          >
            Sort
          </Text>
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
  searched: {
    flexShrink: 1,
    alignSelf: "center",
  },
  optionText: {},
});
