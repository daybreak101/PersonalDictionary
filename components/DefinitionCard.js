import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Entypo from "@expo/vector-icons/Entypo";

export default function DefinitionCard({ definition, word, deleteItem }) {
  return (
    <View style={styles.card}>
      <Text style={styles.word}>{word}</Text>
      <Text style={styles.definition}>{definition}</Text>
      <Pressable style={styles.refresh} onPress={() => deleteItem(word)}>
        <Entypo name="trash" size={24} color="black" />
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
  word: {
    fontSize: 30,
  },
  definition: {
    fontSize: 20,
    padding: 10,
  },
});
