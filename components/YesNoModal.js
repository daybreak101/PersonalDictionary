import { StyleSheet, Text, View, Modal, Pressable } from "react-native";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";

export default function YesNoModal({
  setModalVisible,
  modalVisible,
  desc,
  func,
}) {
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
          <View style={styles.textBox}>
            <Text style={styles.text}>Are you sure you want to {desc}?</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable
              style={[
                styles.button,
                {
                  borderBottomLeftRadius: 25,
                  borderRightWidth: 1,
                  borderColor: "#9c9c9cff",
                },
              ]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.text}>No</Text>
            </Pressable>
            <Pressable
              style={[styles.button, { borderBottomRightRadius: 25 }]}
              onPress={() => {
                func();
                setModalVisible(false);
              }}
            >
              <Text style={styles.text}>Yes</Text>
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
