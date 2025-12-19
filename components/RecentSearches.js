import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Keyboard,
} from "react-native";
import React from "react";
import Animated from "react-native-reanimated";
import { useTheme } from "../context/ThemeContext";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Entypo from "@expo/vector-icons/Entypo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNHapticFeedback from "react-native-haptic-feedback";

export default function RecentSearches({
  recentSearches,
  setRecentSearches,
  handleSubmit,
}) {
  const { themeObject, textColor, hapticFeedback, themeValue, darkMode } = useTheme();

  const deleteRecentSearch = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem("recentSearches");
      const array = jsonValue != null ? JSON.parse(jsonValue) : [];
      const removeExisting = array.filter((item) => item !== key);
      await AsyncStorage.setItem(
        "recentSearches",
        JSON.stringify(removeExisting)
      );
      setRecentSearches((prev) => prev.filter((item) => key !== item));
      console.log("Recent Search Delete successful");
    } catch (error) {
      console.log("Error deleting recent search:", error);
    }
  };
  const renderRightActions = (item) => (
    <View
      style={{
        flex: 1,
        maxWidth: 100,
        minWidth: 0,
        justifyContent: "center",
        backgroundColor: "red",
        borderRadius: 5,
      }}
    >
      <Pressable
        style={{
          padding: 15,
          justifyContent: "center",
          borderRadius: 25,
          alignSelf: "center",
        }}
        onPress={() => deleteRecentSearch(item)}
      >
        <Entypo name="trash" size={32} color="white" />
      </Pressable>
    </View>
  );

  return (
    <View style={styles.recentSearches}>
      {recentSearches.length > 0 && (
        <>
          <Text style={[styles.recentHeader, { color: textColor }]}>
            Recent:
          </Text>

          <FlatList
            data={recentSearches}
            renderItem={({ item }) => {
              return (
                <Animated.View key={item}>
                  <ReanimatedSwipeable
                    key={item}
                    renderRightActions={() => renderRightActions(item)}
                    overshootRight={false}
                  >
                    <Pressable
                      style={[
                        styles.recentSearch,
                        { backgroundColor: themeObject.unfocusColor },
                      ]}
                      onPress={() => {
                        if (hapticFeedback) {
                          RNHapticFeedback.trigger("impactHeavy");
                        }
                        Keyboard.dismiss();
                        handleSubmit(item);
                      }}
                    >
                      <Text
                        style={[
                          styles.recentWord,
                          {
                            color:
                              themeValue === "Prism" ||
                              themeValue === "Soft Pearl"
                            ? "black" : "white"
                          },
                        ]}
                      >
                        {item}
                      </Text>
                    </Pressable>
                  </ReanimatedSwipeable>
                </Animated.View>
              );
            }}
            contentContainerStyle={{
              paddingVertical: 20,
              paddingHorizontal: 20,
            }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  recentSearches: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  recentHeader: {
    fontSize: 32,
  },
  recentSearch: {
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderColor: "gray",
  },
  recentWord: {
    fontSize: 24,
  },
});
