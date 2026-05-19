// contexts/LocationContext.tsx
import { getAddress } from '@/utils/userdata';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

type LocationData = {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
} | null;

type LocationContextType = {
  locationData: LocationData;
  locationVersion: number;
  refreshLocation: () => void;
  isLoading: boolean;
};

const LocationContext = createContext<LocationContextType>({
  locationData: null,
  locationVersion: 0,
  refreshLocation: () => {},
  isLoading: true,
});

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [locationData, setLocationData] = useState<LocationData>(null);
  const [locationVersion, setLocationVersion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial location from storage
  useEffect(() => {
    loadStoredLocation();
  }, []);

  const loadStoredLocation = async () => {
    try {
      setIsLoading(true); // Add this to show loading on refresh too
      const stored = await getAddress();
      if (stored?.city && stored?.country && stored?.latitude && stored?.longitude) {
        setLocationData({
          city: stored.city,
          country: stored.country,
          latitude: stored.latitude,
          longitude: stored.longitude,
        });
      }
    } catch (error) {
      console.error('Error loading location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshLocation = useCallback(() => {
    setLocationVersion(prev => prev + 1);
    // Reload from storage after a small delay to allow storage to update
    setTimeout(() => {
      loadStoredLocation();
    }, 100);
  }, []);

  return (
    <LocationContext.Provider value={{ locationData, locationVersion, refreshLocation, isLoading }}>
      {children}
    </LocationContext.Provider>
  );
}