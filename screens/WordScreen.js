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

  const { themeObject, textColor, darkMode } = useTheme();

  //on component load or input submit, retrieve dictionary info
  //from API and load to state
  useEffect(() => {
    const getDefinition = async () => {
      //when retrieving info, render loading component
      setLoading(true);

      //if a new word has been searched, empty the state then fetch
      if (lastWord.current !== word) {
        setDefinitions([]);
      }
      try {
        //fetch from API
        const res2 = await axios.get(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        );

        //filter this wacky api
        let apiDef = [...res2.data];
        let word2 = "";
        let pronounce = "";

        //set empty state when API didn't return anything useful
        if (apiDef.title === "No Definitions Found") {
          setDefinitions([]);
          return;
        }

        const result = [];
        //api return multiple words for the same word
        for (let i of apiDef) {
          word2 = i.word;
          const origin = i.origin;
          //api returns multiple phonetics for the word
          //we will only get audio url of US pronunciation
          for (let phonetic of i.phonetics) {
            if (phonetic.audio.endsWith("-us.mp3")) {
              pronounce = phonetic.audio;
            }
          }

          //api returns definition blocks for part of speech
          //we will create a new index for each definition that is
          //nested in meanings
          for (let meaning of i.meanings) {
            const partOfSpeech = meaning.partOfSpeech;
            for (let def of meaning.definitions) {
              const definition = def.definition;
              const synonyms = def.synonyms;
              const antonyms = def.antonyms;
              result.push({
                word: word2,
                pronounce: pronounce,
                partOfSpeech: partOfSpeech,
                definition: definition,
                synonyms: synonyms,
                antonyms: antonyms,
                origin: origin,
              });
            }
          }
        }
        //update states
        setDefinitions(result);
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
        <ActivityIndicator
          style={styles.activity}
          size="large"
          color={darkMode ? themeObject.focusColor : themeObject.unfocusColor}
        />
      ) : (
        <>
          <Text style={[styles.header, {color: textColor}]}>{word}</Text>
          <FlatList
            style={styles.wordList}
            data={definitions}
            renderItem={({ item }) => {
              return (
                <WordCard
                  word={word}
                  definition={item}
                  playAudio={(uri) => playAudio(uri)}
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
            contentContainerStyle={{
              paddingTop: 10,
              paddingBottom: 40,
              paddingHorizontal: 20,
            }}
          />
        </>
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
  header: {
    fontSize: 32,
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  activity: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    transform: [{ scale: 3 }],
  },
});
