import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const app = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>SideQuest</Text>
      <Text style={styles.text1}>Welcome to SideQuest</Text>

    </View>
  )
}

export default app

const styles = StyleSheet.create({

container: {
  flex: 1,
  flexDirection: 'column',
},

text: {

  color: 'white',
  fontSize: 42,
  fontWeight: 'bold',
  textAlign: 'center',
},

text1: {

  color: 'blue',
  fontSize: 32,
  textAlign: 'center',
},


})