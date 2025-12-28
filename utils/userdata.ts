// utils/userData.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the user data structure
export interface UserAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;

  latitude?: number;
  longitude?: number;
  formattedAddress?: string;
}

export interface UserData {
  // Personal Info
  name?: string;
  email?: string;
  phone?: string;
  
  // Address
  address?: UserAddress;
  
  // Plants (array of plant IDs)
  selectedPlants: string[];
  
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

// Default empty user data
const DEFAULT_USER_DATA: UserData = {
  selectedPlants: [],
  createdAt: new Date().toISOString(),
};

// Keys for AsyncStorage
const USER_DATA_KEY = 'user_data';

// ============ CRUD Operations ============

/**
 * Get complete user data
 */
export const getUserData = async (): Promise<UserData> => {
  try {
    const jsonData = await AsyncStorage.getItem(USER_DATA_KEY);
    if (jsonData) {
      const data = JSON.parse(jsonData) as UserData;
      return {
        ...DEFAULT_USER_DATA,
        ...data,
        selectedPlants: data.selectedPlants || [],
      };
    }
    return DEFAULT_USER_DATA;
  } catch (error) {
    console.error('❌ Error getting user data:', error);
    return DEFAULT_USER_DATA;
  }
};

/**
 * Save complete user data (overwrites everything)
 */
export const saveUserData = async (userData: Partial<UserData>): Promise<void> => {
  try {
    const currentData = await getUserData();
    const updatedData: UserData = {
      ...currentData,
      ...userData,
      updatedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedData));
    console.log('✅ User data saved successfully');
  } catch (error) {
    console.error('❌ Error saving user data:', error);
    throw error;
  }
};

/**
 * Update specific user fields (merges with existing data)
 */
export const updateUserData = async (updates: Partial<UserData>): Promise<void> => {
  try {
    const currentData = await getUserData();
    const updatedData: UserData = {
      ...currentData,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedData));
    console.log('✅ User data updated successfully');
  } catch (error) {
    console.error('❌ Error updating user data:', error);
    throw error;
  }
};

// ==============================
// Plant-related functions (used in components)
// ==============================

/**
 * Update user's selected plants
 */
export const updateSelectedPlants = async (plants: string[]): Promise<void> => {
  try {
    await updateUserData({ selectedPlants: plants });
    console.log(`✅ Plants updated: ${plants.length} plants selected`);
  } catch (error) {
    console.error('❌ Error updating plants:', error);
    throw error;
  }
};

/**
 * Get user's selected plants
 */
export const getSelectedPlants = async (): Promise<string[]> => {
  try {
    const userData = await getUserData();
    return userData.selectedPlants;
  } catch (error) {
    console.error('❌ Error getting selected plants:', error);
    return [];
  }
};

// ==============================
// Address and user info functions (untouched)
// ==============================

export const updateAddress = async (address: UserAddress): Promise<void> => {
  try {
    await updateUserData({ address });
    console.log('✅ Address updated successfully');
  } catch (error) {
    console.error('❌ Error updating address:', error);
    throw error;
  }
};

export const getAddress = async (): Promise<UserAddress | undefined> => {
  try {
    const userData = await getUserData();
    return userData.address;
  } catch (error) {
    console.error('❌ Error getting address:', error);
    return undefined;
  }
};

export const clearUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_DATA_KEY);
    console.log('✅ User data cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing user data:', error);
    throw error;
  }
};

export const hasUserData = async (): Promise<boolean> => {
  try {
    const userData = await getUserData();
    return (
      userData.selectedPlants.length > 0 ||
      !!userData.address ||
      !!userData.name ||
      !!userData.email
    );
  } catch (error) {
    console.error('❌ Error checking user data:', error);
    return false;
  }
};

export const getUserName = async (): Promise<string | undefined> => {
  try {
    const userData = await getUserData();
    return userData.name;
  } catch (error) {
    console.error('❌ Error getting user name:', error);
    return undefined;
  }
};

export const updateUserName = async (name: string): Promise<void> => {
  try {
    await updateUserData({ name });
    console.log(`✅ User name updated: ${name}`);
  } catch (error) {
    console.error('❌ Error updating user name:', error);
    throw error;
  }
};

export const getUserEmail = async (): Promise<string | undefined> => {
  try {
    const userData = await getUserData();
    return userData.email;
  } catch (error) {
    console.error('❌ Error getting user email:', error);
    return undefined;
  }
};

export const updateUserEmail = async (email: string): Promise<void> => {
  try {
    await updateUserData({ email });
    console.log(`✅ User email updated: ${email}`);
  } catch (error) {
    console.error('❌ Error updating user email:', error);
    throw error;
  }
};

// Export types
export type { UserData as UserDataType };

