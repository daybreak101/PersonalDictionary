import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Entypo from "@expo/vector-icons/Entypo";
import YesNoModal from "../components/YesNoModal";

export default function DefinitionCard({ info, word, deleteItem }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDesc, setModalDesc] = useState("");

  useEffect(() => {
    console.log(info)
  }, [])

  return (
    <View style={styles.card}>
      <YesNoModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        desc={modalDesc}
        func={() => deleteItem(word)}
      />
      <Text style={styles.word}>{word}</Text>
      <Text>{info.partOfSpeech}</Text>
      <Text style={styles.definition}>{info.definition}</Text>
      {info.synonyms.length > 0 && <Text>Synonyms: {info.synonyms.join(", ")}</Text>}
      {info.antonyms.length > 0 && <Text>Antonyms: {info.antonyms.join(", ")}</Text>} 
      <Pressable
        style={styles.refresh}
        onPress={() => {
          setModalVisible(true);
          setModalDesc(
            `Are you sure you want to delete ${word} from your dictionary?`
          );
        }}
      >
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
