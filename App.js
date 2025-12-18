import { StatusBar } from "expo-status-bar";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MyWordsStack from "./stack/MyWordsStack";
import SearchStack from "./stack/SearchStack";
import SettingsStack from "./stack/SettingsStack";
import Foundation from "@expo/vector-icons/Foundation";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { NotifProvider } from "./context/NotifContext";
import CustomTab from "./components/CustomTab";
import { ThemeProvider } from "./context/ThemeContext";
import { RefreshProvider } from "./context/RefreshContext";

function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTab {...props} />}
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
  );
}

const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <RefreshProvider>
        <ThemeProvider>
          <NotifProvider>
            <SafeAreaProvider>
              <SafeAreaView style={{ flex: 1 }}>
                <StatusBar
                  style="light"
                  translucent={false}
                  backgroundColor="black"
                  hidden={false}
                />
                <NavigationContainer>
                  <TabNavigator />
                </NavigationContainer>
              </SafeAreaView>
            </SafeAreaProvider>
          </NotifProvider>
        </ThemeProvider>
    </RefreshProvider>
  );
}
