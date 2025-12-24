import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SearchScreen from "../screens/SearchScreen";
import WordScreen from "../screens/WordScreen";

const Stack = createNativeStackNavigator();

export default function SearchStack() {
  return (
    <Stack.Navigator
      initialRouteName="Search Screen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Search Screen" component={SearchScreen} />
      <Stack.Screen name="Word Screen" component={WordScreen} />
    </Stack.Navigator>
  );
}
