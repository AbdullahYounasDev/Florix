import { getOnboardingStatus, resetOnboarding } from '@/utils/onboarding';
import {
  clearUserData,
  getUserData,
  hasUserData,
  UserAddress
} from '@/utils/userdata';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function DebugScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const data = await getUserData();
      setUserData(data);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetOnboarding = async () => {
    try {
      await resetOnboarding();
      Alert.alert(
        'Success',
        'Onboarding has been reset. Restart the app to see welcome screen.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to reset onboarding');
    }
  };

  const handleCheckStatus = async () => {
    const status = await getOnboardingStatus();
    Alert.alert('Status', `Onboarding status: ${status ? 'COMPLETED' : 'NOT COMPLETED'}`);
  };

  const handleCheckUserData = async () => {
    const hasData = await hasUserData();
    Alert.alert('User Data Status', `User has data: ${hasData ? 'YES' : 'NO'}`);
  };

  const handleClearUserData = async () => {
    Alert.alert(
      'Clear All User Data',
      'Are you sure you want to delete all user data? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearUserData();
              await loadUserData();
              Alert.alert('Success', 'All user data has been cleared.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear user data');
            }
          }
        },
      ]
    );
  };

  const handleRefresh = async () => {
    await loadUserData();
  };

  const formatAddress = (address: UserAddress | undefined): string => {
    if (!address) return 'No address';

    const parts = [
      address.street,
      address.city,
      address.state,
      address.country,
      address.postalCode
    ].filter(Boolean);

    return parts.join(', ') || 'Address (incomplete)';
  };

  const formatPlants = (plants: string[]): string => {
    if (!plants || plants.length === 0) return 'No plants selected';
    return `${plants.length} plant(s): ${plants.join(', ')}`;
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Developer Tools</Text>

      {/* Refresh Button */}
      <TouchableOpacity
        style={[styles.button, styles.refreshButton]}
        onPress={handleRefresh}
      >
        <Text style={styles.buttonText}>🔄 Refresh Data</Text>
      </TouchableOpacity>

      {/* User Data Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Data</Text>

        {isLoading ? (
          <Text style={styles.loadingText}>Loading user data...</Text>
        ) : userData ? (
          <View style={styles.dataCard}>
            {/* Basic Info */}
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Has Data:</Text>
              <Text style={styles.dataValue}>
                {userData.selectedPlants?.length > 0 || userData.name || userData.email || userData.address
                  ? '✅ YES' : '❌ NO'}
              </Text>
            </View>

            {/* Name */}
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Name:</Text>
              <Text style={styles.dataValue}>{userData.name || 'Not set'}</Text>
            </View>

            {/* Email */}
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Email:</Text>
              <Text style={styles.dataValue}>{userData.email || 'Not set'}</Text>
            </View>

            {/* Phone */}
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Phone:</Text>
              <Text style={styles.dataValue}>{userData.phone || 'Not set'}</Text>
            </View>

            {/* Address */}
            {/* Address */}
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Address:</Text>
              <Text style={styles.dataValue}>{formatAddress(userData.address)}</Text>
            </View>

            {/* ADD THESE LAT/LNG ROWS AFTER THE ADDRESS ROW */}
            {userData.address?.latitude && userData.address?.longitude && (
              <>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Latitude:</Text>
                  <Text style={styles.dataValue}>{userData.address.latitude}</Text>
                </View>

                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Longitude:</Text>
                  <Text style={styles.dataValue}>{userData.address.longitude}</Text>
                </View>

                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Coordinates:</Text>
                  <Text style={styles.dataValue}>
                    {userData.address.latitude.toFixed(6)}, {userData.address.longitude.toFixed(6)}
                  </Text>
                </View>
              </>
            )}

            {/* Plants */}
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Plants:</Text>
              <Text style={styles.dataValue}>{formatPlants(userData.selectedPlants || [])}</Text>
            </View>

            {/* Plant Count */}
            {userData.selectedPlants?.length > 0 && (
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Plant Count:</Text>
                <Text style={styles.dataValue}>{userData.selectedPlants.length}</Text>
              </View>
            )}

            {/* Timestamps */}
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Created:</Text>
              <Text style={styles.dataValue}>{formatDate(userData.createdAt)}</Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Last Updated:</Text>
              <Text style={styles.dataValue}>{formatDate(userData.updatedAt)}</Text>
            </View>

            {/* Raw JSON Button */}
            <TouchableOpacity
              style={[styles.button, styles.jsonButton]}
              onPress={() => {
                Alert.alert(
                  'Raw User Data',
                  JSON.stringify(userData, null, 2),
                  [{ text: 'OK' }]
                );
              }}
            >
              <Text style={styles.jsonButtonText}>📋 View Raw JSON</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.noDataText}>No user data found</Text>
        )}
      </View>

      {/* Action Buttons Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>

        <TouchableOpacity
          style={[styles.button, styles.checkButton]}
          onPress={handleCheckUserData}
        >
          <Text style={styles.buttonText}>🔍 Check User Data Status</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.statusButton]}
          onPress={handleCheckStatus}
        >
          <Text style={styles.buttonText}>📊 Check Onboarding Status</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={handleResetOnboarding}
        >
          <Text style={styles.buttonText}>🔄 Reset Onboarding</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={handleClearUserData}
        >
          <Text style={styles.clearButtonText}>🗑️ Clear All User Data</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.note}>
        Note: This screen is for development testing only. Remove in production.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#37474F',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#5D8A6F',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
  },
  dataCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8F5E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  dataLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#37474F',
    flex: 1,
  },
  dataValue: {
    fontSize: 14,
    color: '#607D8B',
    flex: 2,
    textAlign: 'right',
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: '#5D8A6F',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  refreshButton: {
    backgroundColor: '#4A6572',
    marginBottom: 20,
  },
  checkButton: {
    backgroundColor: '#2196F3',
  },
  statusButton: {
    backgroundColor: '#FF9800',
  },
  resetButton: {
    backgroundColor: '#9C27B0',
  },
  clearButton: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  clearButtonText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: '600',
  },
  jsonButton: {
    backgroundColor: '#ECEFF1',
    borderWidth: 1,
    borderColor: '#CFD8DC',
    marginTop: 15,
  },
  jsonButtonText: {
    color: '#37474F',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingText: {
    textAlign: 'center',
    color: '#A1887F',
    fontSize: 16,
    padding: 20,
  },
  noDataText: {
    textAlign: 'center',
    color: '#BDBDBD',
    fontSize: 16,
    padding: 20,
    fontStyle: 'italic',
  },
  note: {
    fontSize: 12,
    color: '#A1887F',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
    lineHeight: 16,
    paddingHorizontal: 10,
  },
});