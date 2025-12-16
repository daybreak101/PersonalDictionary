import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import WordCard from "../components/WordCard";
import { useTheme } from "../context/ThemeContext";

export default function WordScreen({ word }) {
  const [definitions, setDefinitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const lastWord = useRef("");

  const {
    gradientColor1,
    gradientColor2,
    focusColor,
    unfocusColor,
    textColor,
    backgroundColor,
    fadeColor1,
    fadeColor2,
    darkMode
  } = useTheme();

  useEffect(() => {
    const getDefinition = async () => {
      setLoading(true);
      if (lastWord.current !== word) {
        setDefinitions([]);
      }
      try {
        const res2 = await axios.get(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        );

        //filter this wacky api
        let apiDef = [...res2.data];
        let word2 = "";
        let pronounce = "";
        let partOfSpeech = "";

        if (apiDef.title === "No Definitions Found") {
          setDefinitions([]);
          return;
        }

        for (let i of apiDef) {
          word2 = i.word;
          for (let phonetic of i.phonetics) {
            if (phonetic.audio.endsWith("-us.mp3")) {
              pronounce = phonetic.audio;
            }
          }

          for (let meaning of i.meanings) {
            partOfSpeech = meaning.partOfSpeech;
            for (let def of meaning.definitions) {
              const definition = def.definition;
              const synonyms = def.synonyms;
              const antonyms = def.antonyms;
              setDefinitions((prev) => [
                ...prev,
                {
                  word: word2,
                  pronounce: pronounce,
                  partOfSpeech: partOfSpeech,
                  definition: definition,
                  synonyms: synonyms,
                  antonyms: antonyms,
                },
              ]);
            }
          }
        }
        lastWord.current = word;
        setLoading(false);
      } catch (error) {
        setDefinitions([]);
        console.log(error);
        setLoading(false);
      }
    };
    getDefinition();
  }, [word]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator style={styles.activity} size="large" color={darkMode ? focusColor : unfocusColor}/>
      ) : (
        <FlatList
          style={styles.wordList}
          data={definitions}
          renderItem={({ item }) => {
            return <WordCard word={word} definition={item} />;
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
              <Text style={{color: textColor}}>No items found</Text>
            </View>
          }
          contentContainerStyle={{
            paddingVertical: 40,
            paddingHorizontal: 20,
          }}
        />
      )}
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
  activity: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    transform: [{ scale: 3 }],
  },
});
