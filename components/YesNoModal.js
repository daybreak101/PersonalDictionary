import { StyleSheet, Text, View, Modal, Alert, Pressable } from "react-native";
import React from "react";

export default function YesNoModal({ setModalVisible, modalVisible, desc, func }) {


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
          <Text>{desc}</Text>
          <View style={styles.buttonContainer}>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text>No</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                func()
                setModalVisible(false);
              }}
            >
              <Text>Yes</Text>
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
    paddingVertical: 200,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
  },
});
