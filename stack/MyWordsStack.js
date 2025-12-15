import { StyleSheet, Text, View } from 'react-native'
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyWordsList from '../screens/MyWordsList';
import WordFocus from '../screens/WordFocus';

const Stack = createNativeStackNavigator();

export default function MyWordsStack() {
  return (
    <Stack.Navigator initialRouteName="My Words List"  screenOptions={{headerShown: false}}>
        <Stack.Screen name="My Words List" component={MyWordsList}/>
        <Stack.Screen name="Word Focus" component={WordFocus}/>
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})