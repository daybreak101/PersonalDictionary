import { StyleSheet, Text, View, Pressable, Vibration } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import YesNoModal from "../components/YesNoModal";
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

export default function DefinitionCard({ item, deleteItem }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDesc, setModalDesc] = useState("");

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
    if (contentHeight === 0) {
      setContentHeight(event.nativeEvent.layout.height);
    }
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
          func={() => deleteItem(item.word)}
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
            <Pressable
              style={styles.refresh}
              onPress={() => {
                setModalVisible(true);
                setModalDesc(
                  `Are you sure you want to delete ${item.word} from your dictionary?`
                );
              }}
            >
              <Entypo name="trash" size={24} color="black" />
            </Pressable>
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
});
