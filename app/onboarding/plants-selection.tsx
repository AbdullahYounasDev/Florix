import PlantsSelector, { PlantCategory } from '@/components/ui/PlantsSelector';
import { plantCategories } from '@/utils/plantCategories';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ✅ Import AsyncStorage utilities
import {
  getSelectedPlants,
  updateSelectedPlants,
} from '@/utils/userdata';

export default function PlantsSelectionScreen() {
  const router = useRouter();
  const [selectedPlants, setSelectedPlants] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // ==============================
  // 1️⃣ Load plants when screen opens
  // ==============================
  useEffect(() => {
    const loadPlants = async () => {
      const savedPlants = await getSelectedPlants();
      setSelectedPlants(savedPlants);
      setLoading(false);
    };
    loadPlants();
  }, []);

  // ==============================
  // 2️⃣ Local toggle (no AsyncStorage yet)
  // ==============================
  const togglePlant = (plantId: string) => {
    if (selectedPlants.includes(plantId)) {
      // Remove plant
      setSelectedPlants(prev => prev.filter(id => id !== plantId));
    } else {
      // Limit to 9 plants
      if (selectedPlants.length >= 9) {
        Alert.alert("Limit reached", "You can select up to 9 plants only.");
        return;
      }
      setSelectedPlants(prev => [...prev, plantId]);
    }
  };

  // ==============================
  // 3️⃣ Deselect All (local only)
  // ==============================
  const handleDeselectAll = () => {
    setSelectedPlants([]);
  };

  // ==============================
  // 4️⃣ Continue → save to AsyncStorage
  // ==============================
  const handleContinue = async () => {
    try {
      await updateSelectedPlants(selectedPlants);
      router.push('/onboarding/address');
    } catch (error) {
      console.error("❌ Error saving selected plants:", error);
      Alert.alert("Error", "Failed to save selected plants. Please try again.");
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) return null; // or a spinner

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PlantsSelector
        selectedPlants={selectedPlants}
        onPlantToggle={togglePlant}
        onDeselectAll={handleDeselectAll}
        categories={plantCategories as PlantCategory[]}
        onContinue={handleContinue}
        onBack={handleBack}
        showHeader={true}
        showSelectionSummary={true}
        showActions={true}
        continueButtonText="Continue"
        backButtonText="Back"
      />
    </SafeAreaView>
  );
}
