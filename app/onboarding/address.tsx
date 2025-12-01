import { setOnboardingComplete } from '@/utils/onboarding';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function AddressScreen() {
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [manualMode, setManualMode] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setIsGettingLocation(true);

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to get your farm address automatically.',
          [{ text: 'OK' }]
        );
        setManualMode(true);
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      let geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocode.length > 0) {
        const locationData = geocode[0];
        const formattedAddress = formatAddress(locationData);
        setAddress(formattedAddress);
        Alert.alert(
          'Location Found',
          'Your farm address has been detected automatically.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Location Error',
        'Could not get your location. Please enter address manually.',
        [{ text: 'OK', onPress: () => setManualMode(true) }]
      );
    } finally {
      setIsGettingLocation(false);
    }
  };

  const formatAddress = (locationData: any) => {
    const parts = [];
    if (locationData.name) parts.push(locationData.name);
    if (locationData.street) parts.push(locationData.street);
    if (locationData.city) parts.push(locationData.city);
    if (locationData.region) parts.push(locationData.region);
    if (locationData.country) parts.push(locationData.country);

    return parts.join(', ');
  };

  const handleUseCurrentLocation = async () => {
    await getCurrentLocation();
    setManualMode(false);
  };

  const handleManualEntry = () => {
    setManualMode(true);
    setAddress('');
  };

  const handleComplete = async () => {
    if (address.trim() === '') {
      Alert.alert('Error', 'Please enter your farm address');
      return;
    }

    try {
      setIsLoading(true);
      await setOnboardingComplete();
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      Alert.alert('Error', 'Failed to complete setup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Header - Simplified */}
            <View style={styles.header}>
              <Text style={styles.title}>Farm Location</Text>
            </View>

            {/* Location Detection Section */}
            {!manualMode ? (
              <View style={styles.locationSection}>
                <View style={styles.locationIconContainer}>
                  <Ionicons name="locate" size={60} color="#5D8A6F" />
                </View>

                <Text style={styles.locationTitle}>
                  {isGettingLocation ? 'Detecting your location...' : 'Use Current Location'}
                </Text>

                <Text style={styles.locationDescription}>
                  We'll use your device's GPS to automatically find your farm address
                </Text>

                {isGettingLocation ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#5D8A6F" />
                    <Text style={styles.loadingText}>Getting your location...</Text>
                  </View>
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles.locationButton}
                      onPress={handleUseCurrentLocation}
                      disabled={isGettingLocation}
                    >
                      <Ionicons name="navigate" size={24} color="#FFFFFF" />
                      <Text style={styles.locationButtonText}>
                        {address ? 'Update Location' : 'Detect My Location'}
                      </Text>
                    </TouchableOpacity>

                    {address ? (
                      <View style={styles.detectedAddress}>
                        <Text style={styles.detectedAddressTitle}>Detected Address:</Text>
                        <Text style={styles.detectedAddressText}>{address}</Text>

                        <TouchableOpacity
                          style={styles.editButton}
                          onPress={() => setManualMode(true)}
                        >
                          <Ionicons name="create-outline" size={18} color="#5D8A6F" />
                          <Text style={styles.editButtonText}>Edit Address</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.manualButton}
                        onPress={handleManualEntry}
                      >
                        <Text style={styles.manualButtonText}>Enter Address Manually</Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>
            ) : (
              /* Manual Entry Section */
              <View style={styles.manualSection}>
                <View style={styles.manualHeader}>
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setManualMode(false)}
                  >
                    <Ionicons name="arrow-back" size={24} color="#5D8A6F" />
                  </TouchableOpacity>
                  <Text style={styles.manualTitle}>Enter Address Manually</Text>
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="e.g., 123 Farm Road, Village, District, Country"
                    placeholderTextColor="#A1887F"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    autoFocus={true}
                  />

                  <View style={styles.addressExample}>
                    <Ionicons name="information-circle-outline" size={18} color="#A1887F" />
                    <Text style={styles.exampleText}>
                      Include landmarks, village/town, district, and country for best results
                    </Text>
                  </View>
                </View>

                {!address && (
                  <TouchableOpacity
                    style={styles.autoDetectButton}
                    onPress={handleUseCurrentLocation}
                  >
                    <Ionicons name="locate-outline" size={20} color="#5D8A6F" />
                    <Text style={styles.autoDetectText}>Auto-detect my location</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Navigation Buttons Row */}
            <View style={styles.navigationRow}>
              {/* Back Button */}
              <TouchableOpacity 
                style={styles.backButtonBottom}
                onPress={handleBack}
              >
                <Ionicons name="arrow-back" size={20} color="#8B4513" />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>

              {/* Complete Setup Button */}
              <TouchableOpacity
                style={[
                  styles.completeButton,
                  (address.trim() === '' || isLoading) && styles.completeButtonDisabled
                ]}
                onPress={handleComplete}
                disabled={address.trim() === '' || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.completeButtonText}>
                      Complete Setup
                    </Text>
                    <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 30,
    minHeight: '100%',
  },
  header: {
    marginBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#37474F',
    marginBottom: 8,
    textAlign: 'center',
  },
  locationSection: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  locationIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#37474F',
    marginBottom: 10,
    textAlign: 'center',
  },
  locationDescription: {
    fontSize: 16,
    color: '#A1887F',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
    maxWidth: 280,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  loadingText: {
    fontSize: 16,
    color: '#5D8A6F',
    marginTop: 15,
    fontWeight: '500',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5D8A6F',
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 25,
    minWidth: 200,
  },
  locationButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  detectedAddress: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8F5E8',
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  detectedAddressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#37474F',
    marginBottom: 10,
    textAlign: 'center',
  },
  detectedAddressText: {
    fontSize: 14,
    color: '#5D8A6F',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 15,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  editButtonText: {
    fontSize: 14,
    color: '#5D8A6F',
    fontWeight: '500',
    marginLeft: 6,
  },
  manualButton: {
    paddingVertical: 12,
  },
  manualButtonText: {
    fontSize: 16,
    color: '#5D8A6F',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  manualSection: {
    flex: 1,
  },
  manualHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  manualTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#37474F',
    flex: 1,
  },
  inputContainer: {
    marginBottom: 25,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8F5E8',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: '#37474F',
    minHeight: 120,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  addressExample: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#E8F5E8',
  },
  exampleText: {
    fontSize: 13,
    color: '#A1887F',
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },
  autoDetectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    marginBottom: 25,
  },
  autoDetectText: {
    fontSize: 16,
    color: '#5D8A6F',
    fontWeight: '600',
    marginLeft: 10,
  },
  navigationRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  backButtonBottom: {
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
  completeButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5D8A6F',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
  },
  completeButtonDisabled: {
    backgroundColor: '#A1887F',
    opacity: 0.6,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 12,
  },
});