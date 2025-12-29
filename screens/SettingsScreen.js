import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { useState } from "react";
import YesNoModal from "../components/YesNoModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ThemeSelector from "../components/settings/ThemeSelector";
import DarkModeToggle from "../components/settings/DarkModeToggle";
import { useTheme } from "../context/ThemeContext";
import HapticFeedback from "../components/settings/HapticFeedback";
import RNHapticFeedback from "react-native-haptic-feedback";
import { useRefresh } from "../context/RefreshContext";
import { useNotif } from "../context/NotifContext";
import Notification from "../components/Notification";

export default function SettingsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDesc, setModalDesc] = useState("");
  const [selectedFunc, setSelectedFunc] = useState(() => {});

  const {
    textColor,
    backgroundColor,
    hapticFeedback,
    darkMode,
    themeObject,
    themeValue,
  } = useTheme();
  const { setRefreshFlag } = useRefresh();
  const { notifVisible, setNotifVisible, setNotifDesc } = useNotif();

  //delete all recent searches from local searches
  //call refresh flag to update appropriate states
  const clearRecentSearches = async () => {
    try {
      await AsyncStorage.removeItem("recentSearches");
      setNotifVisible(true);
      setNotifDesc("All recent searches successfully deleted.");
      setRefreshFlag((prev) => !prev);
    } catch (error) {
      console.log("Error deleting recent searches");
    }
  };

  //delete all saved words from local searches
  //call refresh flag to update appropriate states
  const clearSavedWords = async () => {
    try {
      await AsyncStorage.removeItem("words");
      setRefreshFlag((prev) => !prev);
      setNotifVisible(true);
      setNotifDesc("All saved words successfully deleted.");
      setRefreshFlag((prev) => !prev);
    } catch (error) {
      console.log("Error deleting saved words");
    }
  };

  return (
    <View style={{ flex: 1 }}>
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
          <Text style={[styles.groupHeader, { color: textColor }]}>
            Feedback
          </Text>
          <HapticFeedback />
        </View>
        <View style={styles.group}>
          <Text style={[styles.groupHeader, { color: textColor }]}>
            Storage
          </Text>
          <Pressable
            style={[
              styles.pressable,
              {
                borderColor: darkMode
                  ? themeObject.focusColor
                  : themeObject.unfocusColor,
                backgroundColor: themeObject.unfocusColor,
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
            <Text
              style={[
                styles.text,
                {
                  color:
                    themeValue === "Prism" || themeValue === "Soft Pearl"
                      ? "black"
                      : "white",
                },
              ]}
            >
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
                backgroundColor: themeObject.unfocusColor,
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
            <Text
              style={[
                styles.text,
                {
                  color:
                    themeValue === "Prism" || themeValue === "Soft Pearl"
                      ? "black"
                      : "white",
                },
              ]}
            >
              Clear Saved Words
            </Text>
          </Pressable>
        </View>
      </ScrollView>
      {notifVisible && <Notification />}
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
    marginBottom: 2,
  },

  text: {
    fontSize: 24,
  },
});
