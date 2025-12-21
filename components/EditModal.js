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
import React, { useState } from "react";
import Animated from "react-native-reanimated";

export default function EditModal({
  setModalVisible,
  modalVisible,
  item,
  func,
}) {
  const [newQuote, setNewQuote] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");

  const newCitation = () => {
    if (newQuote == "") {
      return;
    }

    const updatedCitations = [
      ...(item.info.citations ?? []),
      { quote: newQuote, sourceTitle: newTitle, sourceAuthor: newAuthor },
    ];
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
        <View style={styles.container}>
          <Text style={styles.header}>{item.word}</Text>
          {/* {item.info.citations?.length > 0 &&
            item.info.citations.map((citation, index) => (
              <View key={index}>
                <Text>{citation.quote}</Text>
                {citation.sourceTitle !== "" && (
                  <Text>{citation.sourceTitle}</Text>
                )}
                {citation.sourceAuthor !== "" && (
                  <Text>{citation.sourceAuthor}</Text>
                )}
              </View>
            ))} */}

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
            <Pressable onPress={() => setModalVisible(false)}>
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
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    padding: 20,
    paddingVertical: 100,
    height: 500,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
  },
  header: {
    fontSize: 24,
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
    height: 50,
  },
  buttonContainer: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
