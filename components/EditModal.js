import {
  StyleSheet,
  Text,
  View,
  Modal,
  Alert,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";

export default function EditModal({
  setModalVisible,
  modalVisible,
  item,
  currentCitations = [],
  func,
  c,
}) {
  const [newQuote, setNewQuote] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");

  useEffect(() => {
    if (c) {
      setNewQuote(c.quote);
      setNewTitle(c.sourceTitle);
      setNewAuthor(c.sourceAuthor);
    }
  }, [c]);

  const newCitation = () => {
    if (newQuote == "") {
      return;
    }
    let updatedCitations;
    if (c) {
      updatedCitations = currentCitations.map((i) =>
        i.timestamp === c.timestamp
          ? {
              ...i,
              quote: newQuote,
              sourceTitle: newTitle,
              sourceAuthor: newAuthor,
            }
          : i
      );
    } else {
      updatedCitations = [
        ...currentCitations,
        {
          quote: newQuote,
          sourceTitle: newTitle,
          sourceAuthor: newAuthor,
          timestamp: Date.now(),
        },
      ];
    }
    setNewQuote("");
    setNewAuthor("");
    setNewTitle("");
    func(updatedCitations);
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
          <Text style={styles.header}>{item.word}</Text>
          <View>
            <Text>Add a new citation?</Text>
            <View style={styles.inputView}>
              <Text>Quote:</Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    // borderColor: darkMode ? focusColor : unfocusColor,
                    // color: textColor,
                  },
                ]}
                numberOfLines={10}
                multiline={true}
                textAlignVertical="top"
                autoCorrect={false}
                autoCapitalize="sentences"
                placeholder=""
                placeholderTextColor="gray"
                value={newQuote}
                onChangeText={setNewQuote}
              />
            </View>
            <View style={styles.inputView}>
              <Text>Title:</Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    // borderColor: darkMode ? focusColor : unfocusColor,
                    // color: textColor,
                  },
                ]}
                autoCorrect={false}
                autoCapitalize="words"
                placeholder=""
                placeholderTextColor="gray"
                value={newTitle}
                onChangeText={setNewTitle}
              />
            </View>
            <View style={styles.inputView}>
              <Text>Author:</Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    // borderColor: darkMode ? focusColor : unfocusColor,
                    // color: textColor,
                  },
                ]}
                autoCorrect={false}
                autoCapitalize="words"
                placeholder=""
                placeholderTextColor="gray"
                value={newAuthor}
                onChangeText={setNewAuthor}
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Pressable
              onPress={() => {
                setNewQuote("");
                setNewAuthor("");
                setNewTitle("");
                setModalVisible(false);
              }}
            >
              <Text>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                newCitation();
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
    alignItems: "center",
  },
  container: {
    position: "absolute",
    width: "95%",
    backgroundColor: "white",
    borderRadius: 25,
    padding: 10,
    marginTop: 50,
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
  },
  header: {
    fontSize: 24,
    paddingBottom: 20,
  },
  inputView: {
    width: "100%",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: "black",
    color: "black",
    borderRadius: 10,
    minHeight: 50,
  },
  buttonContainer: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
