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
        //fetching data from two apis because no good dictionary apis exist
        // const res = await axios.get(
        //   `https://api.api-ninjas.com/v1/dictionary?word=${word}`,
        //   {
        //     headers: { "X-Api-Key": Constants.expoConfig.extra.API_NINJAS_KEY },
        //   }
        // );
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
          // const ninjasDef = res.data?.definition
          //   ? [String(res.data.definition)]
          //   : [];
          //return [...ninjasDef, ...apiDef];
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
          return <WordCard item={item} />;
        }}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListEmptyComponent={
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text>No items found</Text>
          </View>
        }
        contentContainerStyle={{paddingVertical: 40, paddingHorizontal: 20}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%"
  },
  wordList: {
    flex: 1,
  },
  word: {
    padding: 10,
  },
});
