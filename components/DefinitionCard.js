import { StyleSheet, Text, View, Pressable, Vibration } from "react-native";
import React, { useState, useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolateColor,
  SlideInLeft,
  SlideOutRight,
  withTiming,
} from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";
import RNHapticFeedback from "react-native-haptic-feedback";
import { useTheme } from "../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Entypo from "@expo/vector-icons/Entypo";

export default function DefinitionCard({
  item,
  deleteItem,
  editItem,
  refresh,
  index = 1,
}) {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDesc, setModalDesc] = useState("");

  const { themeObject, hapticFeedback, textColor } = useTheme();

  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  //expansion animation
  const expanded = useSharedValue(0);

  //background animation
  const animatedColorStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        expanded.value,
        [0, 1],
        [themeObject.unfocusColor, themeObject.focusColor]
      ),
    };
  });

  const renderRightActions = () => {
    const animatedStyle = useAnimatedStyle(() => ({
      minWidth: withTiming(100, { duration: 200 }),
    }));

    return (
      <Animated.View
        style={[
          {
            justifyContent: "center",
            backgroundColor: "red",
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5,
          },
        ]}
      >
        <Pressable
          style={{
            flex: 1,
            padding: 25,
            justifyContent: "center",
            borderRadius: 25,
            alignSelf: "center",
          }}
          onPress={() => deleteItem(item.timestamp, false)}
        >
          <Entypo name="trash" size={32} color="white" />
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <ReanimatedSwipeable
      containerStyle={[{ borderWidth: 0 }]}
      childrenContainerStyle={{ flex: 1 }}
      renderRightActions={renderRightActions}
      overshootRight={false}
    >
      <Animated.View
        entering={SlideInLeft.duration(1000).delay((index % 20) * 50)}
        exiting={SlideOutRight.duration(400)}
        style={[styles.card, animatedColorStyle, { opacity: 0.9 }]}
      >
        <LinearGradient
          style={{ borderBottomLeftRadius: 8, borderTopLeftRadius: 8 }}
          colors={[themeObject.gradientColor1, themeObject.gradientColor2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Pressable
            style={styles.wordContainer}
            onPress={() => {
              if (hapticFeedback) {
                RNHapticFeedback.trigger("impactHeavy");
              }
              navigation.navigate("Word Focus", {
                item: item,
                editItem: editItem,
                deleteItem: deleteItem,
              });
            }}
          >
            <LinearGradient
              colors={[themeObject.fadeColor1, themeObject.fadeColor2]}
              start={{ x: 0, y: 1 }}
              end={{ x: 0.75, y: 0 }}
              locations={[0.1, 1]}
              style={{ borderRadius: 25, width: "90%" }}
            >
              <Text style={styles.word}>{item.word}</Text>
            </LinearGradient>
          </Pressable>
        </LinearGradient>
      </Animated.View>
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    elevation: 15,
    shadowColor: "black",
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
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
});
