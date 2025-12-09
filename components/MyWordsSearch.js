import { StyleSheet, View, Pressable, TextInput, Keyboard } from "react-native";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Foundation from "@expo/vector-icons/Foundation";

export default function MyWordsSearch({ fullSavedWords, setSavedWords }) {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (word) => {
    if (word === "") {
      setInput("");
      setSubmitted(false);
      revert();
    } else {
      setInput(word);
      setSubmitted(true);
      search(word);
    }
  };

  const search = (word) => {
    setSavedWords(
      fullSavedWords.filter((item) =>
        item.word.toLowerCase().includes(word.toLowerCase())
      )
    );
  };

  const revert = () => {
    setSavedWords(fullSavedWords);
  };

  return (
    <View style={styles.inputView}>
      {submitted ? (
        <Pressable
          onPress={() => {
            setSubmitted(false);
            revert();
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
  );
}

const styles = StyleSheet.create({
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
