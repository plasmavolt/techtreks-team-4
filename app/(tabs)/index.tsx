import { Fonts } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'

interface Location {
  _id: string
  name: string
  type: string
  coordinates: {
    latitude: number
    longitude: number
  }
  address: {
    street?: string
    city: string
    state: string
  }
  categories: string[]
}

// Mock location data. Used for testing only.
const mockLocations: Location[] = [
  {
    _id: 'mock_1',
    name: 'Central Park',
    type: 'place',
    coordinates: { latitude: 40.7829, longitude: -73.9654 },
    address: { city: 'New York', state: 'NY' },
    categories: ['park']
  },
  {
    _id: 'mock_2',
    name: 'Times Square',
    type: 'place',
    coordinates: { latitude: 40.7580, longitude: -73.9855 },
    address: { city: 'New York', state: 'NY' },
    categories: ['landmark']
  },
  {
    _id: 'mock_3',
    name: 'Brooklyn Bridge',
    type: 'place',
    coordinates: { latitude: 40.7061, longitude: -73.9969 },
    address: { city: 'Brooklyn', state: 'NY' },
    categories: ['landmark']
  },
  {
    _id: 'mock_4',
    name: 'Statue of Liberty',
    type: 'place',
    coordinates: { latitude: 40.6892, longitude: -74.0445 },
    address: { city: 'New York', state: 'NY' },
    categories: ['landmark']
  },
  {
    _id: 'mock_5',
    name: 'Empire State Building',
    type: 'place',
    coordinates: { latitude: 40.7484, longitude: -73.9857 },
    address: { city: 'New York', state: 'NY' },
    categories: ['landmark']
  }
]

const app = () => {
  const router = useRouter()
  const colorScheme = useColorScheme()
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://10.17.26.59:3000/api/locations')
      const data = await response.json()
      console.log('API Response:', data)

      // Check if data.data exists, otherwise use empty array
      if (data && data.data && Array.isArray(data.data)) {
        setLocations(data.data)
      } else {
        console.warn('No locations data found')
        setLocations([])
      }
    } catch (error) {
      console.error('Error fetching locations:', error)
      setLocations([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 40.7831,
          longitude: -73.9712,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={() => setSelectedLocation(null)}
      >
        {locations.map((location) => (
          <Marker
            key={location._id}
            coordinate={{
              latitude: location.coordinates.latitude,
              longitude: location.coordinates.longitude,
            }}
            onPress={(e) => {
              e.stopPropagation()
              console.log('Marker pressed:', location.name)
              setSelectedLocation(location)
            }}
          />
        ))}
      </MapView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2596be" />
        </View>
      )}

      {selectedLocation && (
        <View style={styles.locationCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>{selectedLocation.name}</Text>
              <Text style={styles.cardSubtitle}>
                {selectedLocation.address.city}, {selectedLocation.address.state}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setSelectedLocation(null)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardBody}>
            <Text style={styles.cardLabel}>Type:</Text>
            <Text style={styles.cardValue}>{selectedLocation.type}</Text>

            {selectedLocation.categories.length > 0 && (
              <>
                <Text style={styles.cardLabel}>Categories:</Text>
                <View style={styles.categoryContainer}>
                  {selectedLocation.categories.map((category, index) => (
                    <View key={index} style={styles.categoryTag}>
                      <Text style={styles.categoryText}>{category}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        </View>
      )}
    </View>
  )
}

export default app

const styles = StyleSheet.create({

container: {
  flex: 1,
},

map: {
  flex: 1,
},

loadingOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
},

locationCard: {
  position: 'absolute',
  bottom: 20,
  left: 20,
  right: 20,
  backgroundColor: 'white',
  borderRadius: 16,
  padding: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 5,
},

cardHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: 16,
},

cardTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#2596be',
  fontFamily: Fonts.rounded,
},

cardSubtitle: {
  fontSize: 14,
  color: '#666',
  marginTop: 4,
  fontFamily: Fonts.serif,
},

closeButton: {
  width: 30,
  height: 30,
  borderRadius: 15,
  backgroundColor: '#f0f0f0',
  justifyContent: 'center',
  alignItems: 'center',
},

closeButtonText: {
  fontSize: 18,
  color: '#666',
  fontWeight: 'bold',
},

cardBody: {
  gap: 8,
},

cardLabel: {
  fontSize: 12,
  fontWeight: '600',
  color: '#888',
  textTransform: 'uppercase',
  marginTop: 8,
  fontFamily: Fonts.serif,
},

cardValue: {
  fontSize: 16,
  color: '#333',
  fontFamily: Fonts.serif,
},

categoryContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
  marginTop: 4,
},

categoryTag: {
  backgroundColor: '#e8f4f8',
  borderRadius: 12,
  paddingHorizontal: 12,
  paddingVertical: 6,
},

categoryText: {
  fontSize: 12,
  color: '#2596be',
  fontWeight: '600',
  fontFamily: Fonts.serif,
},

overlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
  pointerEvents: 'none',
},

text: {
  color: '#2596be',
  fontSize: 70,
  fontWeight: 'bold',
  position: 'relative',
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
  color: 'black',
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
  color: 'black',
  fontSize: 16,
  fontWeight: '600',
  textAlign: 'center',
  fontFamily: Fonts.serif,
},

})
