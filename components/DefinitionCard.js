import { StyleSheet, Text, View, Pressable, Animated } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Entypo from "@expo/vector-icons/Entypo";
import YesNoModal from "../components/YesNoModal";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function DefinitionCard({ item, deleteItem }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDesc, setModalDesc] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // console.log(info)
  }, []);

  const rotateAnim = useRef(new Animated.Value(0)).current;

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const rotateNow = () => {
    if (!expanded) {
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleExpand = () => {
    setExpanded(!expanded);
    rotateNow();
  };

  return (
    <View style={styles.card}>
      <YesNoModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        desc={modalDesc}
        func={() => deleteItem(item.word)}
      />
      <Pressable style={styles.wordContainer} onPress={() => handleExpand()}>
        <Text style={styles.word}>{item.word}</Text>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <AntDesign name="caret-down" size={24} color="black" />
        </Animated.View>
      </Pressable>
      {expanded && (
        <>
          <Text>{item.info.partOfSpeech}</Text>
          <Text style={styles.definition}>{item.info.definition}</Text>
          {item.info.synonyms.length > 0 && (
            <Text>Synonyms: {item.info.synonyms.join(", ")}</Text>
          )}
          {item.info.antonyms.length > 0 && (
            <Text>Antonyms: {item.info.antonyms.join(", ")}</Text>
          )}
          <Pressable
            style={styles.refresh}
            onPress={() => {
              setModalVisible(true);
              setModalDesc(
                `Are you sure you want to delete ${item.word} from your dictionary?`
              );
            }}
          >
            <Entypo name="trash" size={24} color="black" />
          </Pressable>
        </>
      )}
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
  wordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
});
