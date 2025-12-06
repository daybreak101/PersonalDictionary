import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Button,
  Modal,
  Alert,
} from "react-native";
import React, { useState } from "react";
import YesNoModal from "../components/YesNoModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDesc, setModalDesc] = useState("");
  const [selectedFunc, setSelectedFunc] = useState(() => {})

  const clearRecentSearches = async () => {
    try {
      await AsyncStorage.removeItem("recentSearches");
    } catch (error) {
      console.log("Error deleting recent searches");
    }
  };

  const clearSavedWords = async () => {
    try {
      await AsyncStorage.removeItem("words");
    } catch (error) {
      console.log("Error deleting saved words");
    }
  };


  return (
    <View style={styles.container}>
      <YesNoModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        desc={modalDesc}
        func={selectedFunc}
      />
      <Text style={styles.header}>Settings</Text>
      <Pressable style={styles.pressable}>
        <Text style={styles.text}>Dark Mode</Text>
      </Pressable>
      <Pressable
        style={styles.pressable}
        onPress={() => {
          setModalDesc("clear recent searches");
          setModalVisible(true);
          setSelectedFunc(() => clearRecentSearches)
        }}
      >
        <Text style={styles.text}>Clear Recent Searches</Text>
      </Pressable>
      <Pressable
        style={styles.pressable}
        onPress={() => {
          setModalDesc("clear saved words");
          setModalVisible(true);
          setSelectedFunc(() => clearSavedWords)
        }}
      >
        <Text style={styles.text}>Clear Saved Words</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 30,
  },
  pressable: {
    width: "100%",
  },
  text: {
    fontSize: 24,
  },
});
