import AsyncStorage from '@react-native-async-storage/async-storage';

export const resetOnboarding = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(['isOnboarded', 'onboardingStep']);
    console.log('✅ Onboarding reset successfully');
  } catch (error) {
    console.error('❌ Error resetting onboarding:', error);
    throw error;
  }
};

export const getOnboardingStatus = async (): Promise<boolean> => {
  try {
    const status = await AsyncStorage.getItem('isOnboarded');
    return status === 'true';
  } catch (error) {
    console.error('❌ Error getting onboarding status:', error);
    return false;
  }
};

export const setOnboardingComplete = async (): Promise<void> => {
  try {
    await AsyncStorage.multiSet([
      ['isOnboarded', 'true'],
      ['onboardingStep', 'completed']
    ]);
    console.log('✅ Onboarding marked as complete');
  } catch (error) {
    console.error('❌ Error saving onboarding status:', error);
    throw error;
  }
};

export const getOnboardingStep = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('onboardingStep');
  } catch (error) {
    console.error('❌ Error getting onboarding step:', error);
    return null;
  }
};

export const setOnboardingStep = async (step: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('onboardingStep', step);
    console.log(`✅ Onboarding step saved: ${step}`);
  } catch (error) {
    console.error('❌ Error saving onboarding step:', error);
    throw error;
  }
};