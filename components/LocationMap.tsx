import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

// Mock points of interest with geofencing
const POINTS_OF_INTEREST = [
  {
    id: '1',
    title: 'Music Studio',
    description: 'Professional recording studio',
    coordinate: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
    radius: 100, // meters for geofencing
  },
  {
    id: '2',
    title: 'Concert Hall',
    description: 'Live music venue',
    coordinate: {
      latitude: 37.78925,
      longitude: -122.4344,
    },
    radius: 100,
  },
  {
    id: '3',
    title: 'Music Store',
    description: 'Instruments & equipment',
    coordinate: {
      latitude: 37.78725,
      longitude: -122.4304,
    },
    radius: 100,
  },
];

// Custom dark map style
const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }],
  },
];

interface LocationMapProps {
  height?: number;
}

export default function LocationMap({ height = 400 }: LocationMapProps) {
  const { colors } = useTheme();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [insideGeofence, setInsideGeofence] = useState<string[]>([]);
  const mapRef = useRef<MapView>(null);
  const previousGeofenceRef = useRef<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        // Request permissions
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setLoading(false);
          return;
        }

        // Get current location
        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        
        setLocation(currentLocation);
        setRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        // Start watching location for geofencing
        const locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 10, // Update every 10 meters
          },
          (newLocation) => {
            setLocation(newLocation);
            checkGeofences(newLocation);
          }
        );

        setLoading(false);

        return () => {
          locationSubscription.remove();
        };
      } catch (error) {
        setErrorMsg('Error getting location');
        setLoading(false);
        console.error(error);
      }
    })();
  }, []);

  const checkGeofences = (currentLocation: Location.LocationObject) => {
    const currentlyInside: string[] = [];

    POINTS_OF_INTEREST.forEach((poi) => {
      const distance = getDistance(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
        poi.coordinate.latitude,
        poi.coordinate.longitude
      );

      if (distance <= poi.radius) {
        currentlyInside.push(poi.id);
        
        // Check if we just entered this geofence
        if (!previousGeofenceRef.current.includes(poi.id)) {
          Alert.alert(
            '🎵 Entered Zone',
            `You are near ${poi.title}! ${poi.description}`,
            [{ text: 'OK' }]
          );
        }
      }
    });

    // Check if we left any geofences
    previousGeofenceRef.current.forEach((prevId) => {
      if (!currentlyInside.includes(prevId)) {
        const poi = POINTS_OF_INTEREST.find((p) => p.id === prevId);
        if (poi) {
          Alert.alert(
            '👋 Left Zone',
            `You left the ${poi.title} area`,
            [{ text: 'OK' }]
          );
        }
      }
    });

    setInsideGeofence(currentlyInside);
    previousGeofenceRef.current = currentlyInside;
  };

  // Haversine formula to calculate distance between two coordinates
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const centerOnUser = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const zoomIn = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        ...region,
        latitudeDelta: region.latitudeDelta / 2,
        longitudeDelta: region.longitudeDelta / 2,
      });
    }
  };

  const zoomOut = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        ...region,
        latitudeDelta: region.latitudeDelta * 2,
        longitudeDelta: region.longitudeDelta * 2,
      });
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { height, backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading map...
        </Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={[styles.container, { height, backgroundColor: colors.background }]}>
        <Ionicons name="location-outline" size={48} color={colors.textSecondary} />
        <Text style={[styles.errorText, { color: colors.accent }]}>{errorMsg}</Text>
        <Text style={[styles.errorSubtext, { color: colors.textSecondary }]}>
          Please enable location services in your device settings
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, { height }]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass
        customMapStyle={DARK_MAP_STYLE}
      >
        {/* User location marker */}
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="You are here"
            pinColor={colors.primary}
          />
        )}

        {/* Points of interest */}
        {POINTS_OF_INTEREST.map((poi) => (
          <React.Fragment key={poi.id}>
            <Marker
              coordinate={poi.coordinate}
              title={poi.title}
              description={poi.description}
              pinColor={insideGeofence.includes(poi.id) ? '#1DB954' : '#FF6B6B'}
            />
            <Circle
              center={poi.coordinate}
              radius={poi.radius}
              strokeColor={insideGeofence.includes(poi.id) ? 'rgba(29, 185, 84, 0.5)' : 'rgba(255, 107, 107, 0.5)'}
              fillColor={insideGeofence.includes(poi.id) ? 'rgba(29, 185, 84, 0.2)' : 'rgba(255, 107, 107, 0.2)'}
              strokeWidth={2}
            />
          </React.Fragment>
        ))}
      </MapView>

      {/* Map controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: colors.surface }]}
          onPress={centerOnUser}
        >
          <Ionicons name="navigate" size={24} color={colors.primary} />
        </TouchableOpacity>
        
        <View style={styles.zoomControls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.zoomButton, { backgroundColor: colors.surface }]}
            onPress={zoomIn}
          >
            <Ionicons name="add" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlButton, styles.zoomButton, { backgroundColor: colors.surface }]}
            onPress={zoomOut}
          >
            <Ionicons name="remove" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Status indicator */}
      {insideGeofence.length > 0 && (
        <View style={[styles.statusBadge, { backgroundColor: colors.primary }]}>
          <Ionicons name="radio-outline" size={16} color="#fff" />
          <Text style={styles.statusText}>
            Near {insideGeofence.length} location{insideGeofence.length > 1 ? 's' : ''}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorSubtext: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  controls: {
    position: 'absolute',
    right: 16,
    top: 16,
    gap: 12,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  zoomControls: {
    gap: 8,
  },
  zoomButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
