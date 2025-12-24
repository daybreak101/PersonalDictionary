import { StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsScreen from "../screens/SettingsScreen";

const Stack = createNativeStackNavigator();

export default function SettingsStack() {
  return (
    <Stack.Navigator
      initialRouteName="Settings Screen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Settings Screen" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
