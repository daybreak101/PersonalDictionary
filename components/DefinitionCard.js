import { StyleSheet, Text, View, Pressable, Vibration } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import YesNoModal from "../components/YesNoModal";
import EditModal from "../components/EditModal";
import AntDesign from "@expo/vector-icons/AntDesign";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useSpring,
  withTiming,
  withSpring,
  interpolateColor,
  withDelay,
  Easing,
} from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";
import { RadialGradient } from "react-native-gradients";
import RNHapticFeedback from "react-native-haptic-feedback";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

export default function DefinitionCard({
  item,
  deleteItem,
  editItem,
  refresh,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDesc, setModalDesc] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);

  const [citations, setCitations] = useState([]);

  useEffect(() => {
    setCitations(item.info.citations ?? []);
  }, [item]);

  useEffect(() => {
    setContentHeight(0);
  }, [contentVersion]);
  const contentVersion = item.info.citations?.length ?? 0;

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

  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  //expansion animation
  const [contentHeight, setContentHeight] = useState(0);
  const expanded = useSharedValue(0);
  const colorShift = useSharedValue(0);

  const toggleExpand = () => {
    RNHapticFeedback.trigger("impactHeavy", options);
    expanded.value = withTiming(expanded.value ? 0 : 1, { duration: 200 });
  };

  const handleContentLayout = (event) => {
    setContentHeight(event.nativeEvent.layout.height);
  };

  const animatedExpansionStyle = useAnimatedStyle(() => {
    return {
      opacity: expanded.value
        ? withTiming(1, { duration: 500 })
        : withTiming(0, { duration: 100 }),
      height: expanded.value
        ? withTiming(contentHeight, { duration: 250 })
        : withTiming(0, { duration: 250 }),
    };
  });

  //rotate arrow animation
  const animatedRotateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: withSpring(expanded.value ? "180deg" : "0deg") }],
    };
  });

  //background animation
  const animatedColorStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        expanded.value,
        [0, 1],
        [unfocusColor, focusColor]
      ),
    };
  });

  return (
    // my neat little trick to do an animated linear gradient
    <Animated.View style={[styles.card, animatedColorStyle, { opacity: 0.9 }]}>
      <LinearGradient
        colors={[gradientColor1, gradientColor2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <YesNoModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          desc={modalDesc}
          func={() => deleteItem(item.timestamp)}
        />
        <EditModal
          modalVisible={editModalVisible}
          setModalVisible={setEditModalVisible}
          item={item}
          func={async (updatedCitations) => {
            await editItem(item.timestamp, updatedCitations);
            refresh();
          }}
        />

        <Pressable style={styles.wordContainer} onPress={() => toggleExpand()}>
          <LinearGradient
            colors={[fadeColor1, fadeColor2]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0.75, y: 0 }}
            locations={[0.1, 1]}
            style={{ borderRadius: 25, width: "90%" }}
          >
            <Text style={styles.word}>{item.word}</Text>
          </LinearGradient>
          <Animated.View style={animatedRotateStyle}>
            <AntDesign name="caret-down" size={24} color="black" />
          </Animated.View>
        </Pressable>

        <Animated.View style={[animatedExpansionStyle, { overflow: "hidden" }]}>
          {/* the below view wrapper measures the container height for animated expansion */}
          {/* onLayout returns an event that contains: width, height, x-position, y-position */}
          {/* apparently styling MUST have these properties or else it might misbehave */}
          <View
            style={{ position: "absolute", width: "100%", top: 0, left: 0 }}
            onLayout={handleContentLayout}
          >
            <Text style={styles.pof}>{item.info.partOfSpeech}</Text>
            <Text style={styles.definition}>{item.info.definition}</Text>
            {item.info.synonyms.length > 0 && (
              <Text style={styles.similars}>
                Synonyms: {item.info.synonyms.join(", ")}
              </Text>
            )}
            {item.info.antonyms.length > 0 && (
              <Text style={styles.similars}>
                Antonyms: {item.info.antonyms.join(", ")}
              </Text>
            )}

            {item.info.citations.length > 0 && (
              <Text style={styles.definition}>Quotes:</Text>
            )}
            {item.info.citations?.length > 0 &&
              item.info.citations.map((i, index) => (
                <View key={index} style={styles.citation}>
                  <Text style={styles.quote}>"{i.quote}"</Text>

                  {i.sourceTitle !== "" && (
                    <Text style={styles.title}>— {i.sourceTitle}</Text>
                  )}
                  {i.sourceAuthor !== "" && (
                    <Text style={styles.author}> by {i.sourceAuthor}</Text>
                  )}
                </View>
              ))}
            <View style={styles.actions}>
              <Pressable
                style={styles.pressable}
                onPress={() => {
                  setEditModalVisible(true);
                }}
              >
                <Text>Edit</Text>
                <Entypo name="edit" size={24} color="black" />
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
                <Text>Delete</Text>
                <Entypo name="trash" size={24} color="black" />
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#c8c8c8ff",
    elevation: 15,
    shadowColor: "black",
  },
  word: {
    fontSize: 30,
    elevation: 10,
    shadowColor: "white",
    padding: 10,
  },
  definition: {
    fontSize: 20,
    padding: 20,
  },
  wordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  pof: {
    fontStyle: "italic",
    fontSize: 15,
    paddingHorizontal: 10,
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
    fontSize: 16
  },
  title: {},
  author: {
    paddingLeft: 15
  },
});
