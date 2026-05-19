// components/Reusable/LocationChangeModal.tsx
import { useLocation } from '@/contexts/LocationContext';
import { theme } from '@/utils/theme';
import { getAddress, updateAddress } from '@/utils/userdata';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface LocationChangeModalProps {
  visible: boolean;
  onClose: () => void;
  onLocationUpdated?: () => void;
}

type LoadingStage = 'locating' | 'fetching' | 'saving' | null;
type ErrorType = 'no_permission' | 'location_failed' | 'unknown' | null;

export default function LocationChangeModal({
  visible,
  onClose,
  onLocationUpdated,
}: LocationChangeModalProps) {
  const { locationData, refreshLocation } = useLocation();
  const [currentLocation, setCurrentLocation] = useState<{
    city: string;
    country: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<LoadingStage>(null);
  const [error, setError] = useState<ErrorType>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (visible) {
      loadCurrentLocation();
      setSuccess(false);
      setError(null);
    }
  }, [visible]);

  // Also update when context locationData changes
  useEffect(() => {
    if (locationData) {
      setCurrentLocation(locationData);
    }
  }, [locationData]);

  const loadCurrentLocation = async () => {
    try {
      const stored = await getAddress();
      console.log('Stored location:', stored); // Debug log
      if (stored?.city && stored?.country && stored?.latitude && stored?.longitude) {
        setCurrentLocation({
          city: stored.city,
          country: stored.country,
          latitude: stored.latitude,
          longitude: stored.longitude,
        });
      } else {
        // If no stored location, check context
        if (locationData) {
          setCurrentLocation(locationData);
        }
      }
    } catch (err) {
      console.error('Error loading current location:', err);
    }
  };

  const handleUpdateLocation = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Step 1: Request permission
      setLoadingStage('locating');
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setError('no_permission');
        return;
      }

      // Step 2: Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      if (!location || !location.coords) {
        setError('location_failed');
        return;
      }

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      // Step 3: Fetch city/country from coordinates
      setLoadingStage('fetching');
      const response = await fetch(
        'https://florix-backend.vercel.app/api/v1/weather/getweather',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(coords),
        }
      );

      if (!response.ok) {
        setError('location_failed');
        return;
      }

      const data = await response.json();
      const apiData = data.data;

      // Step 4: Save to storage
      setLoadingStage('saving');
      await updateAddress({
        city: apiData.city,
        country: apiData.country,
        ...coords,
      });

      // Update local state immediately
      setCurrentLocation({
        city: apiData.city,
        country: apiData.country,
        ...coords,
      });

      // Step 5: Refresh context
      refreshLocation();

      setSuccess(true);

      // Notify parent component
      if (onLocationUpdated) {
        onLocationUpdated();
      }
    } catch (err) {
      console.error('Error updating location:', err);
      setError('unknown');
    } finally {
      setLoading(false);
      setLoadingStage(null);
    }
  };

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const renderContent = () => {
    return (
      <View style={styles.mainContent}>
        {/* Current Location Display */}
        <View style={styles.currentLocationCard}>
          <View style={styles.locationIconContainer}>
            <Ionicons name="location" size={24} color={theme.colors.primary} />
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>Current Location</Text>
            <Text style={styles.locationValue}>
              {currentLocation?.city && currentLocation?.country
                ? `${currentLocation.city}, ${currentLocation.country}`
                : 'No location set'}
            </Text>
            {currentLocation?.latitude && (
              <Text style={styles.locationCoords}>
                {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
              </Text>
            )}
          </View>
        </View>

        {/* Info Message */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color={theme.colors.primary} />
          <Text style={styles.infoText}>
            We'll use your device's GPS to get your exact location. This helps us provide accurate
            weather data and local farming recommendations.
          </Text>
        </View>

        {/* Update Button */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>
              {loadingStage === 'locating' && 'Getting your location...'}
              {loadingStage === 'fetching' && 'Fetching location details...'}
              {loadingStage === 'saving' && 'Saving your location...'}
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleUpdateLocation}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="crosshairs-gps" size={22} color={theme.colors.fourthly} />
            <Text style={styles.updateButtonText}>Use My Current Location</Text>
          </TouchableOpacity>
        )}

        {/* Success Message - Shows under button */}
        {success && (
          <View style={styles.successMessageContainer}>
            <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
            <Text style={styles.successMessageText}>
              Location updated to {currentLocation?.city}, {currentLocation?.country}
            </Text>
          </View>
        )}

        {/* Error Message - Shows under button */}
        {error && (
          <View style={styles.errorMessageContainer}>
            <MaterialCommunityIcons name="alert-circle-outline" size={20} color="#C0392B" />
            <View style={styles.errorTextContainer}>
              <Text style={styles.errorMessageText}>
                {error === 'no_permission' && 'Location permission denied. Please enable in settings.'}
                {error === 'location_failed' && "Couldn't get your location. Please try again."}
                {error === 'unknown' && 'Something went wrong. Please try again.'}
              </Text>
              <TouchableOpacity onPress={handleUpdateLocation} activeOpacity={0.7}>
                <Text style={styles.retryText}>Tap to retry</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.fourthly} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Update Location</Text>
          <TouchableOpacity
            onPress={handleClose}
            style={styles.closeButton}
            activeOpacity={0.85}
            disabled={loading}
          >
            <Feather
              name="x"
              size={24}
              color={loading ? theme.colors.tertiary : theme.colors.secondary}
            />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>{renderContent()}</View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.fourthly,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.tertiary,
    backgroundColor: theme.colors.fourthly,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  mainContent: {
    flex: 1,
    gap: 20,
  },
  currentLocationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.tertiary,
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  locationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.fourthly,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfo: {
    flex: 1,
    gap: 4,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.secondary,
    opacity: 0.5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  locationValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.secondary,
  },
  locationCoords: {
    fontSize: 11,
    fontWeight: '400',
    color: theme.colors.secondary,
    opacity: 0.4,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.secondary,
    lineHeight: 19,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: { elevation: 6 },
    }),
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.fourthly,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: theme.colors.secondary,
    textAlign: 'center',
    opacity: 0.7,
  },
  successMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  successMessageText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.secondary,
    lineHeight: 20,
  },
  errorMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FDE8E8',
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  errorTextContainer: {
    flex: 1,
    gap: 6,
  },
  errorMessageText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#C0392B',
    lineHeight: 20,
  },
  retryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#C0392B',
    textDecorationLine: 'underline',
  },
});