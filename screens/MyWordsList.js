import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DefinitionCard from "../components/DefinitionCard";
import { useFocusEffect } from "@react-navigation/native";


export default function MyWordsList() {
  const [savedWords, setSavedWords] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false)

  const getAllItems = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("words");
      const wordsArray = jsonValue != null ? JSON.parse(jsonValue) : [];
      setSavedWords(wordsArray);
    } catch (error) {
      console.log("Error loading saved words:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getAllItems();
    }, [refreshFlag])
  );

  const deleteItem = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem("words");
      const wordsArray = jsonValue != null ? JSON.parse(jsonValue) : [];
      const filteredArray = wordsArray.filter((item) => String(item.word) !== String(key));
      await AsyncStorage.setItem("words", JSON.stringify(filteredArray));
      console.log("Deletion successful");
      setRefreshFlag(prev => !prev)
    } catch (error) {
      console.log("Error deleting item:", error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.wordList}
        data={savedWords}
        renderItem={({ item }) => {
          return (
            <DefinitionCard word={item.word} definition={item.definition} deleteItem={deleteItem}/>
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
