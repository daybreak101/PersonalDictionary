import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  TextInput,
} from "react-native";
import { useState, useEffect } from "react";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";

export default function EditModal({
  setModalVisible,
  modalVisible,
  item,
  currentCitations = [],
  func,
  c, //exisitng citation
}) {
  const [newQuote, setNewQuote] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");

  //if user is editing a citation, update states to include
  //existing data.
  useEffect(() => {
    if (c) {
      setNewQuote(c.quote);
      setNewTitle(c.sourceTitle);
      setNewAuthor(c.sourceAuthor);
    }
  }, [c]);

  //function is responsible for adding new AND editing existing citations
  const newCitation = () => {
    if (newQuote == "") {
      return;
    }
    let updatedCitations;
    //if updating citation
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
    } 
    //if new citation
    else {
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
    //cleanup
    setNewQuote("");
    setNewAuthor("");
    setNewTitle("");
    //send back updated data to WordFocus
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
              <TextInput
                style={[styles.textInput, { minHeight: 100 }]}
                numberOfLines={8}
                multiline={true}
                textAlignVertical="top"
                autoCorrect={false}
                autoCapitalize="sentences"
                placeholder={`"Quote"`}
                placeholderTextColor="gray"
                value={newQuote}
                onChangeText={setNewQuote}
              />
            </View>
            <View style={styles.inputView}>
              <Text> — </Text>
              <TextInput
                style={styles.textInput}
                autoCorrect={false}
                autoCapitalize="words"
                placeholder="Title?"
                placeholderTextColor="gray"
                value={newTitle}
                onChangeText={setNewTitle}
              />
            </View>
            <View style={styles.inputView}>
              <Text>by </Text>
              <TextInput
                style={styles.textInput}
                autoCorrect={false}
                autoCapitalize="words"
                placeholder="Author?"
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
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
  },
  container: {
    position: "absolute",
    width: "100%",
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
    paddingTop: 10,
    paddingLeft: 10,
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
    minHeight: 10,
  },
  buttonContainer: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
