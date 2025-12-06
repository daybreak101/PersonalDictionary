import { StyleSheet, Text, View, Animated } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useNotif } from "../context/NotifContext";

export default function Notification({duration = 1000, totalDuration = 2000}) {
  const fadeAnim = useRef(new Animated.Value(1)).current; //initial opacity: 1
    const { setNotifVisible, notifDesc } = useNotif()

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: duration,
        useNativeDriver: true,
      }).start(() => setNotifVisible(false));
    }, totalDuration);

    return () => {
        clearTimeout(timer)
        fadeAnim.stopAnimation()
    }
  }, [duration, totalDuration]);

  return (
    <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
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
    backgroundColor: "#00ff95ff",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
