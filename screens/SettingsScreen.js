import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Button,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import YesNoModal from "../components/YesNoModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ThemeSelector from "../components/settings/ThemeSelector";
import DarkModeToggle from "../components/settings/DarkModeToggle";
import { useTheme } from "../context/ThemeContext";
import HapticFeedback from "../components/settings/HapticFeedback";
import ScreenReader from "../components/settings/ScreenReader";
import RNHapticFeedback from "react-native-haptic-feedback";
import { useRefresh } from "../context/RefreshContext";

export default function SettingsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDesc, setModalDesc] = useState("");
  const [selectedFunc, setSelectedFunc] = useState(() => {});

  const { textColor, backgroundColor, hapticFeedback, darkMode, themeObject } = useTheme();
  const { setRefreshFlag } = useRefresh()

  const clearRecentSearches = async () => {
    try {
      await AsyncStorage.removeItem("recentSearches");
      setRefreshFlag((prev) => !prev)
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
    <ScrollView
      style={[styles.container, { backgroundColor: backgroundColor }]}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      <YesNoModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        desc={modalDesc}
        func={selectedFunc}
      />
      <Text style={[styles.header, { color: textColor }]}>Settings</Text>
      <View style={styles.group}>
        <Text style={[styles.groupHeader, { color: textColor }]}>
          Appearance
        </Text>
        <ThemeSelector />
        <DarkModeToggle />
      </View>
      <View style={styles.group}>
        <Text style={[styles.groupHeader, { color: textColor }]}>Feedback</Text>
        <HapticFeedback />
        <ScreenReader />
      </View>
      <View style={styles.group}>
        <Text style={[styles.groupHeader, { color: textColor }]}>Storage</Text>
        <Pressable
          style={[
            styles.pressable,
            {
              borderColor: darkMode
                ? themeObject.focusColor
                : themeObject.unfocusColor,
            },
          ]}
          onPress={() => {
            if (hapticFeedback) {
              RNHapticFeedback.trigger("notificationWarning");
            }
            setModalDesc("clear recent searches");
            setModalVisible(true);
            setSelectedFunc(() => clearRecentSearches);
          }}
        >
          <Text style={[styles.text, { color: textColor }]}>
            Clear Recent Searches
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.pressable,
            {
              borderColor: darkMode
                ? themeObject.focusColor
                : themeObject.unfocusColor,
            },
          ]}
          onPress={() => {
            if (hapticFeedback) {
              RNHapticFeedback.trigger("notificationWarning");
            }
            setModalDesc("clear saved words");
            setModalVisible(true);
            setSelectedFunc(() => clearSavedWords);
          }}
        >
          <Text style={[styles.text, { color: textColor }]}>
            Clear Saved Words
          </Text>
        </Pressable>
      </View>
    </ScrollView>
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
  group: {
    paddingVertical: 10,
  },
  groupHeader: {
    padding: 10,
  },
  pressable: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 2,
  },

  text: {
    fontSize: 24,
  },
});
