import { Fonts } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const app = () => {
  const router = useRouter()
  const colorScheme = useColorScheme()

  return (
    <View style={styles.container}>
      <Text style={styles.text}>SideQuest</Text>
      <Text style={styles.text1}>Welcome to SideQuest</Text>
      
      <View style={styles.navigationContainer}>
        <Text style={styles.navigationHint}>
          Navigate using the tabs at the bottom, or use the button below:
        </Text>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.push('/(tabs)/explore')}
        >
          <Text style={styles.navButtonText}>Go to Explore Tab</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default app

const styles = StyleSheet.create({

container: {
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
},

text: {
  color: '#2596be',
  fontSize: 70,
  fontWeight: 'bold',
  position: 'sticky',
  textAlign: 'center',
  fontFamily: Fonts.rounded,
},

text1: {
  color: '#2596be',
  fontSize: 25,
  textAlign: 'center',
  marginBottom: 40,
  fontFamily: Fonts.rounded,
},

navigationContainer: {
  marginTop: 40,
  alignItems: 'center',
  width: '100%',
},

navigationHint: {
  color: 'white',
  fontSize: 16,
  fontFamily: Fonts.serif,
  textAlign: 'center',
  marginBottom: 20,
  paddingHorizontal: 20,
},

navButton: {
  backgroundColor: '#0a7ea4',
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 8,
  minWidth: 200,
},

navButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: '600',
  textAlign: 'center',
  fontFamily: Fonts.serif,
},

})