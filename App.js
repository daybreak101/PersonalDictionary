import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import MyWordsStack from "./stack/MyWordsStack";
import SearchStack from "./stack/SearchStack";
import SettingsStack from "./stack/SettingsStack";
import Foundation from "@expo/vector-icons/Foundation";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          style="light"
          translucent={false}
          backgroundColor="black"
          hidden={false}
        />
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              animation: "shift",
              headerShown: false,
              tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: 300,
              },
            }}
          >
            <Tab.Screen
              name="Search"
              component={SearchStack}
              options={{
                tabBarIcon: ({ color }) => (
                  <Foundation name="magnifying-glass" size={24} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="My Words"
              component={MyWordsStack}
              options={{
                tabBarIcon: ({ color }) => (
                  <Foundation name="book-bookmark" size={24} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Settings"
              component={SettingsStack}
              options={{
                tabBarIcon: ({ color }) => (
                  <MaterialIcons name="settings" size={24} color={color} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
