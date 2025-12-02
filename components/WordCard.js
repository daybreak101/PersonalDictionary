import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function WordCard({ item }) {
  return (
    <View style={styles.card}>
      <Text style={styles.definition}>{item}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "black",
    backgroundColor: "lightblue",
  },
  definition: {
    fontSize: 20,
    padding: 10,
  },
});
