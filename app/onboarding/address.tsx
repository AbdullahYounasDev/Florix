// onboarding/address.tsx
import { setOnboardingComplete } from '@/utils/onboarding';
import { updateAddress, UserAddress } from '@/utils/userdata';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddressScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(true);
  const [locationData, setLocationData] = useState<any>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    // Auto-detect location on screen load
    detectCurrentLocation();
  }, []);

  const detectCurrentLocation = async () => {
    try {
      setIsDetectingLocation(true);
      setPermissionDenied(false);

      // Request location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setPermissionDenied(true);
        Alert.alert(
          'Location Permission Required',
          'Please enable location services to automatically detect your farm location. Go to Settings > Privacy > Location Services to enable.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Open Settings', 
              onPress: () => {
                // On iOS, can't programmatically open settings from Expo
                // User will need to do it manually
              }
            }
          ]
        );
        return;
      }

      // Get current position
      let position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Reverse geocode to get address
      let geocode = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      if (geocode.length > 0) {
        const locationInfo = geocode[0];
        setLocationData({
          ...locationInfo,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      }

    } catch (error) {
      console.error('Error detecting location:', error);
      Alert.alert(
        'Location Error',
        'Unable to detect your location. Please try again.',
        [{ text: 'Try Again', onPress: () => detectCurrentLocation() }]
      );
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const formatAddress = (data: any): string => {
    if (!data) return '';
    
    const parts = [];
    if (data.street) parts.push(data.street);
    if (data.city) parts.push(data.city);
    if (data.region) parts.push(data.region);
    if (data.country) parts.push(data.country);
    
    return parts.join(', ');
  };

  const prepareAddressData = (data: any): UserAddress => {
    return {
      street: data.street || '',
      city: data.city || '',
      state: data.region || '',
      country: data.country || '',
      postalCode: data.postalCode || '',
      latitude: data.latitude,
      longitude: data.longitude,
      formattedAddress: formatAddress(data),
    };
  };

  const handleCompleteSetup = async () => {
    if (!locationData) {
      Alert.alert('Location Required', 'Please wait for location detection to complete.');
      return;
    }

    try {
      setIsLoading(true);
      
      // Save address to user data
      const addressData = prepareAddressData(locationData);
      await updateAddress(addressData);
      
      // Complete onboarding
      await setOnboardingComplete();
      
      // Navigate to main app
      router.replace('/(tabs)');
      
    } catch (error) {
      console.error('Error completing setup:', error);
      Alert.alert('Setup Error', 'Failed to complete setup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleRetryDetection = () => {
    detectCurrentLocation();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Current Location</Text>
          <Text style={styles.subtitle}>
            We'll use your device's GPS to automatically find your location
          </Text>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Location Icon */}
          <View style={styles.locationIconContainer}>
            {isDetectingLocation ? (
              <ActivityIndicator size="large" color="#5D8A6F" />
            ) : locationData ? (
              <Ionicons name="checkmark-circle" size={80} color="#5D8A6F" />
            ) : permissionDenied ? (
              <Ionicons name="alert-circle" size={80} color="#FF9800" />
            ) : (
              <Ionicons name="locate" size={80} color="#5D8A6F" />
            )}
          </View>

          {/* Status Message */}
          <Text style={styles.statusTitle}>
            {isDetectingLocation 
              ? 'Detecting your location...' 
              : locationData 
                ? 'Location Found!' 
                : permissionDenied
                  ? 'Permission Denied'
                  : 'Ready to Detect Location'}
          </Text>

          {/* Description */}
          <Text style={styles.description}>
            {isDetectingLocation 
              ? 'Please wait while we detect your precise location'
              : locationData
                ? 'Your current location has been successfully detected'
                : permissionDenied
                  ? 'Location permission is required to continue'
                  : 'Tap "Detect Location" to find your current position'}
          </Text>

          {/* Detected Location Display */}
          {locationData && !isDetectingLocation && (
            <View style={styles.addressCard}>
              <Text style={styles.addressTitle}>Detected Location:</Text>
              <Text style={styles.addressText}>{formatAddress(locationData)}</Text>
              
              <View style={styles.coordinates}>
                <Text style={styles.coordinateText}>
                  Coordinates: {locationData.latitude?.toFixed(6)}, {locationData.longitude?.toFixed(6)}
                </Text>
              </View>
            </View>
          )}

          {/* Error State */}
          {permissionDenied && !isDetectingLocation && (
            <View style={styles.errorCard}>
              <Ionicons name="warning" size={24} color="#FF9800" />
              <Text style={styles.errorText}>
                Please enable location permission in your device settings to continue.
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            {!isDetectingLocation && !locationData && !permissionDenied && (
              <TouchableOpacity
                style={styles.detectButton}
                onPress={detectCurrentLocation}
              >
                <Ionicons name="navigate" size={24} color="#FFFFFF" />
                <Text style={styles.detectButtonText}>Detect My Location</Text>
              </TouchableOpacity>
            )}

            {permissionDenied && !isDetectingLocation && (
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleRetryDetection}
              >
                <Ionicons name="refresh" size={20} color="#5D8A6F" />
                <Text style={styles.retryButtonText}>Retry Location Detection</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationRow}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
          >
            <Ionicons name="arrow-back" size={20} color="#8B4513" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.continueButton,
              (!locationData || isLoading) && styles.continueButtonDisabled
            ]}
            onPress={handleCompleteSetup}
            disabled={!locationData || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={styles.continueButtonText}>Complete Setup</Text>
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#37474F',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#A1887F',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
  },
  locationIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#37474F',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#A1887F',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
    maxWidth: 320,
  },
  addressCard: {
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#5D8A6F',
    width: '100%',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#37474F',
    marginBottom: 12,
  },
  addressText: {
    fontSize: 16,
    color: '#5D8A6F',
    lineHeight: 24,
    marginBottom: 15,
  },
  coordinates: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E8F5E8',
  },
  coordinateText: {
    fontSize: 14,
    color: '#A1887F',
    fontStyle: 'italic',
  },
  errorCard: {
    backgroundColor: '#FFF8E1',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFECB3',
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 25,
  },
  errorText: {
    fontSize: 14,
    color: '#FF9800',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  actionsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  detectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5D8A6F',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 16,
    width: '100%',
  },
  detectButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#5D8A6F',
    width: '100%',
  },
  retryButtonText: {
    color: '#5D8A6F',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  navigationRow: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 20,
  },
  backButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5E8D9',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D7CCC8',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
    marginLeft: 8,
  },
  continueButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5D8A6F',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
  },
  continueButtonDisabled: {
    backgroundColor: '#A1887F',
    opacity: 0.6,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 12,
  },
});