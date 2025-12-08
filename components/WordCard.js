import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useNotif } from "../context/NotifContext";

export default function WordCard({ definition, word }) {
  const { setNotifVisible, setNotifDesc } = useNotif();

  useEffect(() => {
    console.log("definition: " + definition);
    console.log(word);
  }, []);

  const saveItem = async (key, value) => {
    try {
      const jsonValue = await AsyncStorage.getItem("words");
      const wordsArray = jsonValue != null ? JSON.parse(jsonValue) : [];
      const wordObj = wordsArray.find((item) => item.word === key);

      if (!wordObj) {
        wordsArray.push({ word: key[0], info: value });
        await AsyncStorage.setItem("words", JSON.stringify(wordsArray));
        setNotifVisible(true);
        setNotifDesc(key + " has been added to your dictionary");
      }
      console.log("Save successful");
    } catch (error) {
      console.log("Error saving item:", error);
    }
  };

  if (definition.definition === undefined) {
    return null;
  }

  return (
    <View style={styles.card}>
      <Text>{definition.partOfSpeech}</Text>
      <Text style={styles.definition}>{definition.definition}</Text>
      <Pressable
        style={styles.refresh}
        onPress={() => saveItem(word, definition)}
      >
        {definition.synonyms?.length > 0 && (
          <Text>Synonyms: {definition.synonyms.join(", ")}</Text>
        )}
        {definition.antonyms?.length > 0 && (
          <Text>Antonyms: {definition.antonyms.join(", ")}</Text>
        )}
        <FontAwesome6 name="add" size={24} color="black" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#c8c8c8ff",
    backgroundColor: "#e6fcffff",
    elevation: 15,
    shadowColor: "black",
  },
  definition: {
    fontSize: 20,
    padding: 10,
  },
});
