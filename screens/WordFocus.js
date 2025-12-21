import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import Animated, { FadeIn, SlideInDown, SlideInLeft, SlideInRight, SlideInUp } from "react-native-reanimated";
import { useRoute } from "@react-navigation/native";
import Entypo from "@expo/vector-icons/Entypo";
import YesNoModal from "../components/YesNoModal";
import EditModal from "../components/EditModal";
import { useNavigation } from "@react-navigation/native";
import { useAudioPlayer } from "expo-audio";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function WordFocus() {
  const {
    gradientColor1,
    gradientColor2,
    focusColor,
    unfocusColor,
    textColor,
    backgroundColor,
    fadeColor1,
    fadeColor2,
  } = useTheme();

  const navigation = useNavigation();

  const { item, editItem, deleteItem } = useRoute().params;

  const [modalVisible, setModalVisible] = useState(false);
  const [modalDesc, setModalDesc] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);

  const [citations, setCitations] = useState([]);

  const deleteThis = async () => {
    await deleteItem(item.timestamp, true);
    navigation.navigate("My Words List");
  };

  useEffect(() => {
    setCitations([...item.info.citations]);
  }, []);

  const player = useAudioPlayer(item.info.pronounce, {
    downloadFirst: true,
  });

  return (
    <Animated.View
      entering={FadeIn.withInitialValues({
        backgroundColor: "black",
      }).duration(600)}
      style={[styles.container, { backgroundColor: backgroundColor }]}
    >
      <YesNoModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        desc={modalDesc}
        func={() => deleteThis()}
      />
      <EditModal
        modalVisible={editModalVisible}
        setModalVisible={setEditModalVisible}
        item={item}
        func={async (updatedCitations) => {
          await editItem(item.timestamp, updatedCitations);
          setCitations([...updatedCitations]);
          refresh();
        }}
      />
      <Animated.Text
        entering={SlideInLeft.duration(100).delay(300)}
        selectable={true}
        style={[styles.word, { color: textColor }]}
      >
        {item.info.word}
      </Animated.Text>
      <Animated.ScrollView style={styles.content} entering={SlideInRight.duration(300).delay(600)}>
        <View style={styles.secondRow}>
          <Text selectable={true} style={[styles.pof, { color: textColor }]}>
            {item.info.partOfSpeech}
          </Text>
          {item.info.pronounce && (
            <Pressable
              style={styles.audio}
              onPress={() => {
                player.seekTo(0);
                player.play();
              }}
            >
              <MaterialCommunityIcons
                name="volume-high"
                size={32}
                color={textColor}
              />
            </Pressable>
          )}
        </View>
        {item.origin && (
          <Text selectable={true} style={styles.definition}>
            {item.info.origin}
          </Text>
        )}
        <Text
          selectable={true}
          style={[styles.definition, { color: textColor }]}
        >
          {item.info.definition}
        </Text>
        {item.info.synonyms.length > 0 && (
          <Text
            selectable={true}
            style={[styles.similars, { color: textColor }]}
          >
            Synonyms: {item.info.synonyms.join(", ")}
          </Text>
        )}
        {item.info.antonyms.length > 0 && (
          <Text
            selectable={true}
            style={[styles.similars, { color: textColor }]}
          >
            Antonyms: {item.info.antonyms.join(", ")}
          </Text>
        )}

        {citations.length > 0 && (
          <Text style={[styles.definition, { color: textColor }]}>Quotes:</Text>
        )}
        {citations?.length > 0 &&
          citations.map((i, index) => (
            <View key={index} style={styles.citation}>
              <Text
                selectable={true}
                style={[styles.quote, { color: textColor }]}
              >
                "{i.quote}"
              </Text>

              {i.sourceTitle !== "" && (
                <Text
                  selectable={true}
                  style={[styles.title, { color: textColor }]}
                >
                  — {i.sourceTitle}
                </Text>
              )}
              {i.sourceAuthor !== "" && (
                <Text
                  selectable={true}
                  style={[styles.author, { color: textColor }]}
                >
                  by {i.sourceAuthor}
                </Text>
              )}
            </View>
          ))}
      </Animated.ScrollView>
      <Animated.View style={styles.actions} entering={SlideInDown.duration(800).delay(500)}>
        <Pressable
          style={styles.pressable}
          onPress={() => {
            setEditModalVisible(true);
          }}
        >
          <Text style={{ color: textColor }}>Edit</Text>
          <Entypo name="edit" size={24} color={textColor} />
        </Pressable>
        <Pressable
          style={styles.pressable}
          onPress={() => {
            setModalVisible(true);
            setModalDesc(
              `Are you sure you want to delete ${item.word} from your dictionary?`
            );
          }}
        >
          <Text style={{ color: textColor }}>Delete</Text>
          <Entypo name="trash" size={24} color={textColor} />
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  word: {
    fontSize: 48,
    padding: 20
  },
  secondRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pof: {
    alignSelf: "flex-end",
    fontStyle: "italic",
    fontSize: 15,
    padding: 10,
  },
  audio: {
    paddingRight: 50,
    alignSelf: "flex-end",
  },
  definition: {
    paddingVertical: 20,
  },
  similars: {
    padding: 10,
    fontSize: 15,
  },
  actions: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  pressable: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  citation: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  quote: {
    fontStyle: "italic",
    fontSize: 16,
  },
  title: {
    alignSelf: "flex-end",
  },
  author: {
    paddingLeft: 15,
    alignSelf: "flex-end",
  },
});
