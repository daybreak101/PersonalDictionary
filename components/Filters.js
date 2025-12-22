import { StyleSheet, Text, View, Modal, Alert, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { Checkbox } from "expo-checkbox";
export default function Filters({
  modalVisible,
  setModalVisible,
  filters,
  func,
}) {
  const [quotes, setQuotes] = useState(false);
  const [pronounce, setPronounce] = useState(false);
  const [origin, setOrigin] = useState(false);
  const [relations, setRelations] = useState(false);
  const [noun, setNoun] = useState(false);
  const [pronoun, setPronoun] = useState(false);
  const [verb, setVerb] = useState(false);
  const [adjective, setAdjective] = useState(false);
  const [adverb, setAdverb] = useState(false);
  const [preposition, setPreposition] = useState(false);
  const [conjunction, setConjunction] = useState(false);
  const [interjection, setInterjection] = useState(false);
  const [other, setOther] = useState(false);

  useEffect(() => {
    if (filters) {
      setQuotes(filters.quotes ?? false);
      setPronounce(filters.pronounce ?? false);
      setOrigin(filters.origin ?? false);
      setRelations(filters.relations ?? false);
      setNoun(filters.noun ?? false);
      setPronoun(filters.pronoun ?? false);
      setVerb(filters.verb ?? false);
      setAdjective(filters.adjective ?? false);
      setAdverb(filters.adverb ?? false);
      setPreposition(filters.preposition ?? false);
      setConjunction(filters.conjunction ?? false);
      setInterjection(filters.interjection ?? false);
      setOther(filters.other ?? false);
    }
  }, [filters, modalVisible]);

  const returnFilters = () => {
      func({
        quotes: quotes,
        pronounce: pronounce,
        origin: origin,
        relations: relations,
        noun: noun,
        pronoun: pronoun,
        verb: verb,
        adjective: adjective,
        adverb: adverb,
        preposition: preposition,
        conjunction: conjunction,
        interjection: interjection,
        other: other,
      });
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={styles.container}
          entering={SlideInDown.duration(200)}
          exiting={SlideOutDown.duration(200)}
        >
          <Pressable style={styles.optionContainer}>
            <Checkbox
              style={styles.checkbox}
              value={quotes}
              onValueChange={setQuotes}
              color={quotes ? "#4630EB" : undefined}
            />
            <Text>Has Quotes</Text>
          </Pressable>
          <Pressable style={styles.optionContainer}>
            <Checkbox
              style={styles.checkbox}
              value={pronounce}
              onValueChange={setPronounce}
              color={pronounce ? "#4630EB" : undefined}
            />
            <Text>Has Pronounce</Text>
          </Pressable>
          <Pressable style={styles.optionContainer}>
            <Checkbox
              style={styles.checkbox}
              value={origin}
              onValueChange={setOrigin}
              color={origin ? "#4630EB" : undefined}
            />
            <Text>Has Origin</Text>
          </Pressable>
          <Pressable style={styles.optionContainer}>
            <Checkbox
              style={styles.checkbox}
              value={relations}
              onValueChange={setRelations}
              color={relations ? "#4630EB" : undefined}
            />
            <Text>Has Synonyms/Antonyms</Text>
          </Pressable>
          <Text style={styles.header}>
            Part of Speech
            <Text style={{ fontStyle: "italic" }}> (Matches any)</Text>
          </Text>
          <View style={styles.pofGrid}>
            <View style={styles.column}>
              <Pressable style={styles.optionContainer}>
                <Checkbox
                  style={styles.checkbox}
                  value={noun}
                  onValueChange={setNoun}
                  color={noun ? "#4630EB" : undefined}
                />
                <Text>Noun</Text>
              </Pressable>
              <Pressable style={styles.optionContainer}>
                <Checkbox
                  style={styles.checkbox}
                  value={pronoun}
                  onValueChange={setPronoun}
                  color={pronoun ? "#4630EB" : undefined}
                />
                <Text>Pronoun</Text>
              </Pressable>
              <Pressable style={styles.optionContainer}>
                <Checkbox
                  style={styles.checkbox}
                  value={verb}
                  onValueChange={setVerb}
                  color={verb ? "#4630EB" : undefined}
                />
                <Text>Verb</Text>
              </Pressable>
              <Pressable style={styles.optionContainer}>
                <Checkbox
                  style={styles.checkbox}
                  value={adjective}
                  onValueChange={setAdjective}
                  color={adjective ? "#4630EB" : undefined}
                />
                <Text>Adjective</Text>
              </Pressable>
              <Pressable style={styles.optionContainer}>
                <Checkbox
                  style={styles.checkbox}
                  value={adverb}
                  onValueChange={setAdverb}
                  color={adverb ? "#4630EB" : undefined}
                />
                <Text>Adverb</Text>
              </Pressable>
            </View>
            <View style={styles.column}>
              <Pressable style={styles.optionContainer}>
                <Checkbox
                  style={styles.checkbox}
                  value={preposition}
                  onValueChange={setPreposition}
                  color={preposition ? "#4630EB" : undefined}
                />
                <Text>Preposition</Text>
              </Pressable>
              <Pressable style={styles.optionContainer}>
                <Checkbox
                  style={styles.checkbox}
                  value={conjunction}
                  onValueChange={setConjunction}
                  color={conjunction ? "#4630EB" : undefined}
                />
                <Text>Conjunction</Text>
              </Pressable>
              <Pressable style={styles.optionContainer}>
                <Checkbox
                  style={styles.checkbox}
                  value={interjection}
                  onValueChange={setInterjection}
                  color={interjection ? "#4630EB" : undefined}
                />
                <Text>Interjection</Text>
              </Pressable>
              <Pressable style={styles.optionContainer}>
                <Checkbox
                  style={styles.checkbox}
                  value={other}
                  onValueChange={setOther}
                  color={other ? "#4630EB" : undefined}
                />
                <Text>Other</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Text>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                returnFilters();
                setModalVisible(false);
              }}
            >
              <Text>Done</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    position: "absolute",
    width: "95%",
    backgroundColor: "white",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  optionContainer: {
    width: "100%",
    flexDirection: "row",
    padding: 10,
  },
  buttonContainer: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  textBox: {
    padding: 20,
  },
  text: {
    fontSize: 24,
    textAlign: "center",
  },
  button: {
    paddingVertical: 10,
    flexGrow: 1,
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "#e0e0e0ff",
  },
  checkbox: {
    marginRight: 10,
  },
  pofGrid: {
    flexDirection: "row",
  },
  header: {
    padding: 10,
  },
});
