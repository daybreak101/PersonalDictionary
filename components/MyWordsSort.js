import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function MyWordsSort({ savedWords, setSavedWords }) {
  if(savedWords.length < 1){
    return null
  }




  return (
    <View>
      <Text>Sort By: </Text>
      <Pressable>

      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({})