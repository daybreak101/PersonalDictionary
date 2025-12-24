import { StyleSheet, Text, View, Pressable } from "react-native";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useNotif } from "../context/NotifContext";
import { useRefresh } from "../context/RefreshContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useAudioPlayer } from "expo-audio";
import { useTheme } from "../context/ThemeContext";

export default function WordCard({ definition, word }) {
  const { themeObject, textColor, darkMode } = useTheme();

  const { setNotifVisible, setNotifDesc } = useNotif();
  const { refreshFlag, setRefreshFlag } = useRefresh();

  const saveItem = async (key, value) => {
    try {
      const jsonValue = await AsyncStorage.getItem("words");
      const wordsArray = jsonValue != null ? JSON.parse(jsonValue) : [];
      const wordObj = wordsArray.find((item) => item.word === key);

      if (!wordObj) {
        wordsArray.unshift({
          word: key,
          info: { ...value, citations: [] },
          timestamp: Date.now(),
        });
        await AsyncStorage.setItem("words", JSON.stringify(wordsArray));
        setNotifVisible(true);
        setNotifDesc(key + " has been added to your dictionary");
        await setRefreshFlag((prev) => !prev);
      }
    } catch (error) {
      console.log("Error saving item:", error);
    }
  };

  if (definition.definition === undefined) {
    return null;
  }

  const player = useAudioPlayer(definition.pronounce, {
    downloadFirst: true,
  });

  return (
    <View style={[styles.card, { backgroundColor: themeObject.unfocusColor }]}>
      <Text style={[styles.pos, { color: "white" }]}>
        {definition.partOfSpeech}
      </Text>
      <Text style={[styles.definition, { color: "white" }]}>
        {definition.definition}
      </Text>
      {definition.synonyms?.length > 0 && (
        <Text style={{ color: "white" }}>
          Synonyms: {definition.synonyms.join(", ")}
        </Text>
      )}
      {definition.antonyms?.length > 0 && (
        <Text style={{ color: "white" }}>
          Antonyms: {definition.antonyms.join(", ")}
        </Text>
      )}
      {definition.origin && (
        <Text style={{ color: "white" }}>Origin: {definition.origin}</Text>
      )}

      <View style={styles.bottom}>
        <Pressable
          style={[styles.refresh, { backgroundColor: themeObject.focusColor }]}
          onPress={() => saveItem(word, definition)}
        >
          <Text>Add to Dictionary</Text>
          <FontAwesome6 name="add" size={24} color="black" />
        </Pressable>
        {definition.pronounce && (
          <Pressable
            style={styles.refresh}
            onPress={() => {
              player.seekTo(0);
              player.play();
            }}
          >
            <MaterialCommunityIcons
              name="volume-high"
              size={24}
              color="white"
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 10,
    borderRadius: 10,
    elevation: 15,
    shadowColor: "black",
  },
  pos: {
    fontStyle: "italic",
  },
  definition: {
    fontSize: 20,
    padding: 10,
    paddingBottom: 20,
  },
  bottom: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
  },
  refresh: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 25,
    gap: 10,
  },
});
