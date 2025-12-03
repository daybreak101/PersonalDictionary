import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Constants from "expo-constants";
import WordCard from "../components/WordCard";

export default function WordScreen({ word }) {
  const [definitions, setDefinitions] = useState([]);
  const lastWord = useRef("");

  useEffect(() => {
    const getDefinition = async () => {
      if (lastWord.current !== word) {
        setDefinitions([]);
      }
      try {
        const res2 = await axios.get(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        );

        //filter this wacky api
        let apiDef =
          res2.data?.[0]?.meanings?.[0]?.definitions
            ?.map((def) => def.definition)
            ?.filter((d) => typeof d === "string") || [];

        //check if first api returned any data
        setDefinitions((prev) => {
          return [...apiDef];
        });

        lastWord.current = word;
      } catch (error) {
        setDefinitions(["Cannot fetch definition"]);
        console.log(error);
      }
    };
    getDefinition();
  }, [word]);

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.wordList}
        data={definitions}
        renderItem={({ item }) => {
          return <WordCard word={word} definition={item} />;
        }}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListEmptyComponent={
          <View
            style={{ flexGrow: 1, alignItems: "center", justifyContent: "center" }}
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
});
