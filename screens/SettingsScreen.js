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
import ThemeSelector from "../components/settings/ThemeSelector";
import DarkModeToggle from "../components/settings/DarkModeToggle";
import { useTheme } from "../context/ThemeContext";
import HapticFeedback from "../components/settings/HapticFeedback";
import ScreenReader from "../components/settings/ScreenReader";

export default function SettingsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDesc, setModalDesc] = useState("");
  const [selectedFunc, setSelectedFunc] = useState(() => {});

  const {
    gradientColor1,
    gradientColor2,
    focusColor,
    unfocusColor,
    textColor,
    backgroundColor,
    fadeColor1,
    fadeColor2,
    darkMode,
  } = useTheme();

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
    <View style={[styles.container, {backgroundColor: backgroundColor}]}>
      <YesNoModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        desc={modalDesc}
        func={selectedFunc}
      />
      <Text style={[styles.header, {color: textColor}]}>Settings</Text>
      <ThemeSelector />
      <DarkModeToggle />
      <HapticFeedback />
      <ScreenReader />
      <Pressable
        style={styles.pressable}
        onPress={() => {
          setModalDesc("clear recent searches");
          setModalVisible(true);
          setSelectedFunc(() => clearRecentSearches);
        }}
      >
        <Text style={[styles.text, {color: textColor}]}>Clear Recent Searches</Text>
      </Pressable>
      <Pressable
        style={styles.pressable}
        onPress={() => {
          setModalDesc("clear saved words");
          setModalVisible(true);
          setSelectedFunc(() => clearSavedWords);
        }}
      >
        <Text style={[styles.text, {color: textColor}]}>Clear Saved Words</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 30,
  },
  pressable: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "lightgray",
  },

  text: {
    fontSize: 24,
  },
});
