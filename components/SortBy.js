import { StyleSheet, Text, View, Modal, Alert, Pressable } from "react-native";
import React, { useState } from "react";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { Checkbox } from "expo-checkbox";

export default function SortBy({
  fullSavedWords,
  savedWords,
  setSavedWords,
  setRenderedWords,
  renderedWords,
  modalVisible,
  setModalVisible,
  sortBy,
  setSortBy,
}) {
  const [isChecked, setChecked] = useState(false);

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
          <Text>Sort By: </Text>
          <Pressable>
            <Text>Newest</Text>
          </Pressable>
          <Pressable>
            <Text>Oldest</Text>
          </Pressable>
          <Pressable>
            <Text>Alphabetical</Text>
          </Pressable>
          <Pressable>
            <Text>Reverse Alphabet</Text>
          </Pressable>
          <Pressable>
            <Text>Longest</Text>
          </Pressable>
          <Pressable>
            <Text>Shortest</Text>
          </Pressable>
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
    width: "85%",
    backgroundColor: "white",
    borderRadius: 25,
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
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
});
