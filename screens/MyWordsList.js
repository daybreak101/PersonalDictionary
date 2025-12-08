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
import Ionicons from "@expo/vector-icons/Ionicons";
import Foundation from "@expo/vector-icons/Foundation";

export default function MyWordsList() {
  const [savedWords, setSavedWords] = useState([]);
  const [fullSavedWords, setFullSavedWords] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [wordSearched, setWordSearched] = useState("");

  const getAllItems = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("words");
      const wordsArray = jsonValue != null ? JSON.parse(jsonValue) : [];
      setSavedWords(wordsArray);
      setFullSavedWords(wordsArray);
    } catch (error) {
      console.log("Error loading saved words:", error);
    }
  };

  const search = () => {
    console.log(fullSavedWords);
    setSavedWords(
      fullSavedWords.filter((item) => 
        item.word.toLowerCase().includes(wordSearched.toLowerCase())
      )
    );
  };

  const revert = () => {
    setSavedWords(fullSavedWords);
  };

  const handleSubmit = (word) => {
    if (word === "") {
      setWordSearched("");
      setInput("");
      setSubmitted(false);
      revert();
    } else {
      setWordSearched(word);
      setInput(word);
      setSubmitted(true);
      search();
    }
  };

  useFocusEffect(
    useCallback(() => {
      getAllItems();
    }, [refreshFlag])
  );

  const deleteItem = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem("words");
      const wordsArray = jsonValue != null ? JSON.parse(jsonValue) : [];
      const filteredArray = wordsArray.filter(
        (item) => String(item.word) !== String(key)
      );
      await AsyncStorage.setItem("words", JSON.stringify(filteredArray));
      console.log("Deletion successful");
      setRefreshFlag((prev) => !prev);
    } catch (error) {
      console.log("Error deleting item:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputView}>
        {submitted ? (
          <Pressable
            onPress={() => {
              setSubmitted(false);
              revert()
              Keyboard.dismiss();
            }}
            style={styles.inputPressable}
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </Pressable>
        ) : (
          <></>
        )}
        <TextInput
          style={styles.textInput}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Search for a word"
          placeholderTextColor="gray"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={(e) => handleSubmit(e.nativeEvent.text)}
        />
        <Pressable
          style={styles.searchIconContainer}
          onPress={() => handleSubmit(input)}
        >
          <Foundation name="magnifying-glass" size={30} color="black" />
        </Pressable>
      </View>
      <FlatList
        style={styles.wordList}
        data={savedWords}
        renderItem={({ item }) => {
          return (
            <DefinitionCard
              word={item.word}
              info={item.info}
              deleteItem={deleteItem}
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
        contentContainerStyle={{
          paddingVertical: 40,
          paddingHorizontal: 20,
          // backgroundColor: "#ffffffff",
        }}
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
  },
  searchIconContainer: {
    position: "absolute",
    right: 30,
    top: 30,
  },
});
