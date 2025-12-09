import { BorderRadius, Colors, FontSize, Fonts, Shadows, Spacing } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
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
      const response = await fetch('http://216.165.95.190:3000/api/locations')
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
          <ActivityIndicator size="large" color={Colors.primary} />
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
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.overlay,
  },

  locationCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    ...Shadows.medium,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },

  cardTitle: {
    fontSize: FontSize.xl,
    fontWeight: 'bold',
    color: Colors.primary,
    fontFamily: Fonts.rounded,
  },

  cardSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    fontFamily: Fonts.serif,
  },

  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButtonText: {
    fontSize: 18,
    color: Colors.accent,
    fontWeight: 'bold',
  },

  cardBody: {
    gap: Spacing.sm,
  },

  cardLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.textLight,
    textTransform: 'uppercase',
    marginTop: Spacing.sm,
    fontFamily: Fonts.serif,
  },

  cardValue: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontFamily: Fonts.serif,
  },

  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },

  categoryTag: {
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  categoryText: {
    fontSize: FontSize.xs,
    color: Colors.accent,
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
    padding: Spacing.lg,
    pointerEvents: 'none',
  },

  text: {
    color: Colors.primary,
    fontSize: FontSize.huge,
    fontWeight: 'bold',
    position: 'relative',
    textAlign: 'center',
    fontFamily: Fonts.rounded,
  },

  text1: {
    color: Colors.primary,
    fontSize: FontSize.xxl,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
    fontFamily: Fonts.rounded,
  },

  navigationContainer: {
    marginTop: Spacing.xxl,
    alignItems: 'center',
    width: '100%',
  },

  navigationHint: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    fontFamily: Fonts.serif,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },

  navButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.sm,
    minWidth: 200,
  },

  navButtonText: {
    color: Colors.accent,
    fontSize: FontSize.md,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: Fonts.serif,
  },
})
