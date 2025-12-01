import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PlantsSelectionScreen() {
  const router = useRouter();
  const [selectedPlants, setSelectedPlants] = useState<string[]>([]);

  // Common crops by region
  const cropsByRegion = [
    {
      region: 'Grains & Cereals',
      crops: [
        { id: 'wheat', name: 'Wheat', icon: '🌾' },
        { id: 'rice', name: 'Rice', icon: '🍚' },
        { id: 'corn', name: 'Corn', icon: '🌽' },
        { id: 'barley', name: 'Barley', icon: '🌾' },
        { id: 'sorghum', name: 'Sorghum', icon: '🌾' },
      ]
    },
    {
      region: 'Vegetables',
      crops: [
        { id: 'tomato', name: 'Tomato', icon: '🍅' },
        { id: 'potato', name: 'Potato', icon: '🥔' },
        { id: 'onion', name: 'Onion', icon: '🧅' },
        { id: 'chili', name: 'Chili', icon: '🌶️' },
        { id: 'cabbage', name: 'Cabbage', icon: '🥬' },
      ]
    },
    {
      region: 'Fruits',
      crops: [
        { id: 'mango', name: 'Mango', icon: '🥭' },
        { id: 'banana', name: 'Banana', icon: '🍌' },
        { id: 'apple', name: 'Apple', icon: '🍎' },
        { id: 'orange', name: 'Orange', icon: '🍊' },
        { id: 'grapes', name: 'Grapes', icon: '🍇' },
      ]
    },
    {
      region: 'Cash Crops',
      crops: [
        { id: 'cotton', name: 'Cotton', icon: '🧵' },
        { id: 'sugarcane', name: 'Sugarcane', icon: '🎍' },
        { id: 'coffee', name: 'Coffee', icon: '☕' },
        { id: 'tea', name: 'Tea', icon: '🫖' },
        { id: 'tobacco', name: 'Tobacco', icon: '🍂' },
      ]
    },
    {
      region: 'Others',
      crops: [
        { id: 'soybean', name: 'Soybean', icon: '🫘' },
        { id: 'sunflower', name: 'Sunflower', icon: '🌻' },
        { id: 'pulses', name: 'Pulses', icon: '🫘' },
        { id: 'oilseeds', name: 'Oilseeds', icon: '🫒' },
      ]
    }
  ];

  const togglePlant = (plantId: string) => {
    if (selectedPlants.includes(plantId)) {
      setSelectedPlants(selectedPlants.filter(id => id !== plantId));
    } else {
      setSelectedPlants([...selectedPlants, plantId]);
    }
  };

  const handleContinue = () => {
    router.push('/onboarding/address');
  };

  const handleBack = () => {
    router.back(); // Use router.back() for proper navigation
  };

  const handleSelectAll = () => {
    const allCrops = cropsByRegion.flatMap(region => region.crops.map(crop => crop.id));
    if (selectedPlants.length === allCrops.length) {
      setSelectedPlants([]); // Deselect all if all are selected
    } else {
      setSelectedPlants(allCrops); // Select all
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Select Your Crops</Text>
          <View style={{ width: 40 }} /> {/* Spacer for alignment */}
        </View>

        <Text style={styles.subtitle}>
          Choose the plants you cultivate for personalized advice
        </Text>

        {/* Selection Summary */}
        <View style={styles.selectionSummary}>
          <Text style={styles.selectionCount}>
            {selectedPlants.length} selected
          </Text>
          <TouchableOpacity onPress={handleSelectAll} style={styles.selectAllButton}>
            <Text style={styles.selectAllText}>
              {selectedPlants.length === cropsByRegion.flatMap(r => r.crops).length ? 'Deselect All' : 'Select All'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Crops Selection */}
        <ScrollView
          style={styles.cropsContainer}
          showsVerticalScrollIndicator={false}
        >
          {cropsByRegion.map((region) => (
            <View key={region.region} style={styles.regionSection}>
              <Text style={styles.regionTitle}>{region.region}</Text>
              <View style={styles.cropsGrid}>
                {region.crops.map((crop) => {
                  const isSelected = selectedPlants.includes(crop.id);
                  return (
                    <TouchableOpacity
                      key={crop.id}
                      style={[
                        styles.cropButton,
                        isSelected && styles.selectedCropButton
                      ]}
                      onPress={() => togglePlant(crop.id)}
                    >
                      <View style={styles.cropIconContainer}>
                        {/* ✅ FIX: Wrap emoji in Text component */}
                        <Text style={styles.cropIcon}>{crop.icon}</Text>
                        {isSelected && (
                          <View style={styles.checkmarkOverlay}>
                            <Ionicons name="checkmark-circle" size={20} color="#5D8A6F" />
                          </View>
                        )}
                      </View>
                      {/* ✅ FIX: Wrap crop name in Text component */}
                      <Text style={[
                        styles.cropName,
                        isSelected && styles.selectedCropName
                      ]}>
                        {crop.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Navigation Buttons Row */}
        <View style={styles.navigationRow}>
          {/* Back Button with Brownish Theme */}
          <TouchableOpacity
            style={styles.backButtonBottom}
            onPress={handleBack}
          >
            <Ionicons name="arrow-back" size={20} color="#8B4513" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          {/* Continue Button */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              selectedPlants.length === 0 && styles.continueButtonDisabled
            ]}
            onPress={handleContinue}
            disabled={selectedPlants.length === 0}
          >
            <Text style={styles.continueButtonText}>
              {selectedPlants.length > 0
                ? `Continue (${selectedPlants.length})`
                : 'Select Crop'
              }
            </Text>
            {selectedPlants.length > 0 && (
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
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
    paddingTop: 30,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#37474F',
    flex: 1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#A1887F',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  selectionSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#5D8A6F',
    marginBottom: 25,
  },
  selectionCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5D8A6F',
  },
  selectAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#5D8A6F',
  },
  selectAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5D8A6F',
  },
  cropsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  regionSection: {
    marginBottom: 25,
  },
  regionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#37474F',
    marginBottom: 15,
    paddingLeft: 8,
  },
  cropsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  cropButton: {
    width: '23%', // 4 items per row
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8F5E8',
    marginBottom: 12,
  },
  selectedCropButton: {
    backgroundColor: '#E8F5E8',
    borderColor: '#5D8A6F',
    borderWidth: 2,
  },
  cropIconContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  cropIcon: {
    fontSize: 32,
  },
  checkmarkOverlay: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  cropName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#37474F',
    textAlign: 'center',
  },
  selectedCropName: {
    color: '#5D8A6F',
    fontWeight: '600',
  },
  navigationRow: {
    flexDirection: 'row',
    gap: 12,
  },
  backButtonBottom: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5E8D9', // Light brown background
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D7CCC8', // Light brown border
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513', // Brown text color
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  continueButtonDisabled: {
    backgroundColor: '#A1887F',
    opacity: 0.6,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
});