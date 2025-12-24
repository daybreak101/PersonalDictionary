import { StyleSheet, Text, View, Modal, Pressable } from "react-native";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { RadioButton } from "react-native-paper";

export default function SortBy({
  modalVisible,
  setModalVisible,
  sortBy,
  setSortBy,
  func,
}) {
  const returnSort = () => {
    func();
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
          <RadioButton.Group onValueChange={(newValue) => setSortBy(newValue)}>
            <Text>Sort By: </Text>
            <View style={styles.optionContainer}>
              <RadioButton
                value="Newest"
                status={sortBy === "Newest" ? "checked" : "unchecked"}
              />
              <Text>Newest</Text>
            </View>
            <View style={styles.optionContainer}>
              <RadioButton
                value="Oldest"
                status={sortBy === "Oldest" ? "checked" : "unchecked"}
              />
              <Text>Oldest</Text>
            </View>
            <View style={styles.optionContainer}>
              <RadioButton
                value="Alphabetical"
                status={sortBy === "Alphabetical" ? "checked" : "unchecked"}
              />
              <Text>Alphabetical</Text>
            </View>
            <View style={styles.optionContainer}>
              <RadioButton
                value="Reverse Alphabet"
                status={sortBy === "Reverse Alphabet" ? "checked" : "unchecked"}
              />
              <Text>Reverse Alphabet</Text>
            </View>
            <View style={styles.optionContainer}>
              <RadioButton
                value="Longest"
                status={sortBy === "Longest" ? "checked" : "unchecked"}
              />
              <Text>Longest</Text>
            </View>
            <View style={styles.optionContainer}>
              <RadioButton
                value="Shortest"
                status={sortBy === "Shortest" ? "checked" : "unchecked"}
              />
              <Text>Shortest</Text>
            </View>
          </RadioButton.Group>

          <View style={styles.buttonContainer}>
            <Pressable
              onPress={() => {
                returnSort();
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
    alignItems: "center",
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
