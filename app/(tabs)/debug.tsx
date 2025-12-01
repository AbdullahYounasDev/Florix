import { getOnboardingStatus, resetOnboarding } from '@/utils/onboarding';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DebugScreen() {
  const router = useRouter();

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Developer Tools</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleResetOnboarding}>
        <Text style={styles.buttonText}>Reset Onboarding</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleCheckStatus}>
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>Check Onboarding Status</Text>
      </TouchableOpacity>

      <Text style={styles.note}>
        Note: This screen is for development testing only. Remove in production.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#37474F',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#5D8A6F',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#E8F5E8',
  },
  secondaryButtonText: {
    color: '#5D8A6F',
  },
  note: {
    fontSize: 12,
    color: '#A1887F',
    textAlign: 'center',
    marginTop: 30,
    lineHeight: 16,
  },
});