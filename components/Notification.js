import { StyleSheet, Text, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { useNotif } from "../context/NotifContext";
import { useTheme } from "../context/ThemeContext";

export default function Notification({
  duration = 1000,
  totalDuration = 2000,
}) {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { setNotifVisible, notifDesc } = useNotif();
  const { themeObject } = useTheme();

  //fade notification
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: duration,
        useNativeDriver: true,
      }).start(() => setNotifVisible(false));
    }, totalDuration);

    return () => {
      clearTimeout(timer);
      fadeAnim.stopAnimation();
    };
  }, [duration, totalDuration, notifDesc]);

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, backgroundColor: themeObject.focusColor },
      ]}
    >
      <Text>{notifDesc}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 20,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
