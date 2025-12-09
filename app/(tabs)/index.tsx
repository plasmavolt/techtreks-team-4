import { BorderRadius, Colors, FontSize, Fonts, Shadows, Spacing } from '@/constants/theme'
import { useQuests } from '@/contexts/QuestContext'
import { useColorScheme } from '@/hooks/use-color-scheme'
import * as Location from 'expo-location'
import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

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
    name: 'Ferrane Bakery',
    type: 'Bakery',
    coordinates: { latitude: 40.69790, longitude: -73.99369249655994 },
    address: { city: 'New York', state: 'NY' },
    categories: ['Food & Drink']
  },
  {
    _id: 'mock_2',
    name: 'Martha\'s Country Bakery',
    type: 'Bakery',
    coordinates: { latitude: 40.71511216956412, longitude: -73.96058761524243 },
    address: { city: 'New York', state: 'NY' },
    categories: ['Food & Drink']
  },
  {
    _id: 'mock_3',
    name: 'The Bearded Baker',
    type: 'Bakery',
    coordinates: { latitude: 40.683065518833146, longitude: -73.9969 },
    address: { city: 'Brooklyn', state: 'NY' },
    categories: ['landmark']
  },
  {
    _id: 'mock_4',
    name: 'Martinez Grocery',
    type: 'Market',
    coordinates: { latitude: 40.683911937805796, longitude: -73.99535181701862 },
    address: { city: 'New York', state: 'NY' },
    categories: ['landmark']
  },
  {
    _id: 'mock_5',
    name: 'Quentin Deli Grocery',
    type: 'Market',
    coordinates: { latitude: 40.61489568975444, longitude:  -73.93830253041396 },
    address: { city: 'New York', state: 'NY' },
    categories: ['landmark']
  },
  {
    _id: 'mock_6',
    name: 'K&K Food Deli',
    type: 'Market',
    coordinates: { latitude: 40.711574826285286, longitude:  -73.99429081675319 },
    address: { city: 'New York', state: 'NY' },
    categories: ['landmark']
  },
  {
    _id: 'mock_7',
    name: 'Brooklyn Bridge Park Basketball Courts',
    type: 'Sports',
    coordinates: { latitude: 40.70045501463707, longitude: -73.99905898385467 },
    address: { city: 'New York', state: 'NY' },
    categories: ['landmark']
  },
 
  {
    _id: 'mock_8',
    name: 'West 4th Street Courts',
    type: 'Market',
    coordinates: { latitude: 40.73238082889741, longitude: -74.00048020847134 },
    address: { city: 'New York', state: 'NY' },
    categories: ['landmark']
  },
  {
    _id: 'mock_9',
    name: 'Adel\'s Famous Halal Food',
    type: 'Food & Drink',
    coordinates: { latitude: 40.75931649988379, longitude: -73.98116282879325 },
    address: { city: 'New York', state: 'NY' },
    categories: ['Food & Drink']
  },
  {
    _id: 'mock_10',
    name: 'Habibi Halal Express',
    type: 'Food & Drink',
    coordinates: { latitude: 40.87777416453969, longitude: -73.8913450348882 },
    address: { city: 'New York', state: 'NY' },
    categories: ['Food & Drink']
  },
  {
    _id: 'mock_11',
    name: 'Up A Notch',
    type: 'Food & Drink',
    coordinates: { latitude: 40.66967411924105, longitude: -73.98663696957699 },
    address: { city: 'New York', state: 'NY' },
    categories: ['Food & Drink']
  },
  {
    _id: 'mock_12',
    name: 'Mahmoud\'s Corner Halal Food Car',
    type: 'Food & Drink',
    coordinates: { latitude: 40.76205124644469, longitude: -73.91994109326656 },
    address: { city: 'New York', state: 'NY' },
    categories: ['Food & Drink']
  },
  {
    _id: 'mock_13',
    name: 'Best Halal Food',
    type: 'Food & Drink',
    coordinates: { latitude: 40.57811975798581, longitude: -74.16413672906623 },
    address: { city: 'New York', state: 'NY' },
    categories: ['Food & Drink']
  }
]

interface UserLocation {
  latitude: number
  longitude: number
}

const app = () => {
  const router = useRouter()
  const colorScheme = useColorScheme()
  const { activeQuest, abandonQuest } = useQuests()
  const insets = useSafeAreaInsets()
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false)
  const mapRef = useRef<MapView>(null)

  useEffect(() => {
    fetchLocations()
    requestLocationPermission()
  }, [])

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status === 'granted') {
        setLocationPermissionGranted(true)
        getCurrentLocation()
      } else {
        console.log('Location permission denied')
      }
    } catch (error) {
      console.error('Error requesting location permission:', error)
    }
  }

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })
      const newUserLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }
      setUserLocation(newUserLocation)
      
      // Center map on user location
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: newUserLocation.latitude,
          longitude: newUserLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        })
      }
    } catch (error) {
      console.error('Error getting current location:', error)
    }
  }

  const fetchLocations = async () => {
    try {
      setLoading(true)
      // // Try to fetch from backend
      // console.log('Fetching from URL:', API_ENDPOINTS.LOCATIONS.GET_ALL)
      // const response = await fetch(API_ENDPOINTS.LOCATIONS.GET_ALL)
      
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`)
      // }
      
      // const data = await response.json()
      // console.log('API Response:', data)

      // // Check if data.data exists, otherwise use mock data
      // if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
      //   setLocations(data.data)
      // } else {
      //   console.warn('No locations data found in API response, using mock data')
      //   setLocations(mockLocations)
      // }
      
      // use mock locations.
      setLocations(mockLocations)

    } catch (error) {
      console.error('Error fetching locations from backend:', error)
      console.log('Falling back to mock locations')
      // Fallback to mock data if backend is unavailable
      setLocations(mockLocations)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: userLocation?.latitude || 40.731101,
          longitude: userLocation?.longitude || -73.997334,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={locationPermissionGranted}
        showsMyLocationButton={true}
        onPress={() => setSelectedLocation(null)}
      >
        {locations
          .filter((location) => {
            // If there's an active quest, only show locations for that quest
            if (activeQuest) {
              return activeQuest.locationIds.includes(location._id)
            }
            // If no active quest, show all locations
            return true
          })
          .map((location) => (
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

      {activeQuest && (
        <View style={[styles.questProgressCard, { top: insets.top + 20 }]}>
          <View style={styles.questCardHeader}>
            <View style={styles.questCardTitleContainer}>
              <Text style={styles.questCardTitle} numberOfLines={1}>
                {activeQuest.title}
              </Text>
              <Text style={styles.questCardSubtitle} numberOfLines={1}>
                {activeQuest.description}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/quests')}
              style={styles.questViewButton}
            >
              <Text style={styles.questViewButtonText}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => abandonQuest()}
              style={styles.abandonQuestButton}
            >
              <Text style={styles.abandonQuestButtonText}>Abandon</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.questProgressContainer}>
            <View style={styles.questProgressBar}>
              <View
                style={[
                  styles.questProgressFill,
                  { width: `${activeQuest.progress || 0}%` },
                ]}
              />
            </View>
            <View style={styles.questProgressInfo}>
              <Text style={styles.questProgressText}>
                {Math.round(activeQuest.progress || 0)}%
              </Text>
              <Text style={styles.questLocationCount}>
                {activeQuest.locationIds.length} location{activeQuest.locationIds.length > 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </View>
      )}

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
    zIndex: 10,
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
    color: Colors.textPrimary,
    fontFamily: Fonts.serif,
  },

  cardSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    fontFamily: Fonts.sans,
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
    fontFamily: Fonts.mono,
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
    fontFamily: Fonts.mono,
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

  questProgressCard: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.primary,
    padding: Spacing.md,
    ...Shadows.medium,
    zIndex: 5,
  },

  questCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },

  questCardTitleContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },

  questCardTitle: {
    fontSize: FontSize.md,
    fontWeight: 'bold',
    color: Colors.primary,
    fontFamily: Fonts.serif,
    marginBottom: Spacing.xs,
  },

  questCardSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontFamily: Fonts.sans,
  },

  questViewButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.xs
  },

  questViewButtonText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.background,
    fontFamily: Fonts.sans,
  },

  abandonQuestButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },

  abandonQuestButtonText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.background,
    fontFamily: Fonts.sans,
  },

  questProgressContainer: {
    marginTop: Spacing.sm,
  },

  questProgressBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },

  questProgressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
  },

  questProgressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  questProgressText: {
    fontSize: FontSize.xs,
    color: Colors.textPrimary,
    fontWeight: '600',
    fontFamily: Fonts.mono,
  },

  questLocationCount: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
  },
})
