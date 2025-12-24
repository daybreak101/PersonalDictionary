import { StyleSheet, View, Pressable, TextInput, Keyboard } from "react-native";
import { useState } from "react";
import Foundation from "@expo/vector-icons/Foundation";
import { useTheme } from "../context/ThemeContext";

export default function MyWordsSearch({ input, setInput, func }) {
  const [submitted, setSubmitted] = useState(false);

  const { themeObject, textColor, darkMode } = useTheme();

  const handleSubmit = (word) => {
    setInput(word);
    setSubmitted(word !== "");
    search(word);
  };

  const search = async (word) => {
    func(word);
  };

  return (
    <View style={styles.inputView}>
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
        placeholderTextColor="gray"
        value={input}
        onChangeText={setInput}
        onSubmitEditing={(e) => handleSubmit(e.nativeEvent.text)}
      />
      <Pressable
        style={styles.searchIconContainer}
        onPress={() => {
          Keyboard.dismiss();
          handleSubmit(input);
        }}
      >
        <Foundation
          name="magnifying-glass"
          size={30}
          color={darkMode ? themeObject.focusColor : themeObject.unfocusColor}
        />
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
    paddingRight: 50,
  },
  searchIconContainer: {
    position: "absolute",
    right: 30,
    top: 30,
  },
});
