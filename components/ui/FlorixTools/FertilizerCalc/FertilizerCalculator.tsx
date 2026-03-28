// components/FertilizerCalculator.tsx
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { cropFertilizerData } from '@/utils/cropFertilizerData';
import { plantCategories } from '@/utils/plantCategories';
import { theme } from '@/utils/theme';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import CropSelector from '../../Useable/CropSelector';

const { width } = Dimensions.get('window');

// Simple fertilizer calculation function
const calculateFertilizerPro = (
  cropId: string,
  area: number,
  unit: 'acre' | 'hectare'
) => {
  const crop = cropFertilizerData.find(c => c.id === cropId);
  if (!crop) return null;

  const areaInHectares = unit === 'hectare' ? area : area * 0.404686;

  return {
    cropName: crop.name,
    area,
    areaUnit: unit,
    areaInHectares,
    N: crop.npk.nitrogen * areaInHectares,
    P: crop.npk.phosphorus * areaInHectares,
    K: crop.npk.potassium * areaInHectares,
  };
};

interface Props {
  onClose?: () => void;
}

export default function FertilizerCalculator({ onClose }: Props) {
  const [selectedCrop, setSelectedCrop] = useState<any>(null);
  const [area, setArea] = useState('');
  const [areaUnit, setAreaUnit] = useState<'acre' | 'hectare'>('acre');
  const [result, setResult] = useState<any>(null);

  // Get only crops with fertilizer data
  const fertilizerCropIds = cropFertilizerData.map(crop => crop.id);

  const allCrops = plantCategories
    .flatMap((cat: any) =>
      cat.crops.map((crop: any) => ({
        id: crop.id,
        name: crop.name,
        icon: crop.icon,
        category: cat.region,
      }))
    )
    .filter(crop => fertilizerCropIds.includes(crop.id));

  const handleClose = () => {
    setSelectedCrop(null);
    setArea('');
    setResult(null);
    if (onClose) onClose();
  };

  const handleCalculate = () => {
    if (!selectedCrop) {
      return Alert.alert('Invalid Crop', 'Please select a crop');
    }

    const numericArea = parseFloat(area);
    if (isNaN(numericArea) || numericArea <= 0) {
      return Alert.alert(
        'Invalid Area',
        'Please enter a valid numeric area greater than 0'
      );
    }

    const res = calculateFertilizerPro(selectedCrop.id, numericArea, areaUnit);
    if (!res) return Alert.alert('Error', 'Calculation failed');

    setResult(res);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Fertilizer Calculator</Text>
        </View>
        {onClose && (
          <TouchableOpacity onPress={handleClose} style={styles.closeButton} activeOpacity={0.85}>
            <Feather name="x" size={22} color={theme.colors.secondary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        
        {/* Crop Selection Card */}
        <View style={styles.card}>
          <CropSelector
            crops={allCrops}
            selectedCrop={selectedCrop}
            onSelectCrop={setSelectedCrop}
            placeholder="Choose a crop"
            label="Select Crop"
          />
        </View>

        {/* Area Input Card */}
        <View style={styles.card}>
          <Text style={styles.label}>
            Land Area
          </Text>
          
          <View style={styles.areaRow}>
            <TextInput
              placeholder="0.00"
              keyboardType="numeric"
              value={area}
              onChangeText={setArea}
              style={styles.areaInput}
              placeholderTextColor={theme.colors.secondary}
            />
            
            <View style={styles.unitToggle}>
              <TouchableOpacity
                style={[
                  styles.unitButton,
                  areaUnit === 'acre' && styles.unitButtonActive
                ]}
                onPress={() => setAreaUnit('acre')}
                activeOpacity={0.85}
              >
                <Text style={[
                  styles.unitButtonText,
                  areaUnit === 'acre' && styles.unitButtonTextActive
                ]}>Acre</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.unitButton,
                  areaUnit === 'hectare' && styles.unitButtonActive
                ]}
                onPress={() => setAreaUnit('hectare')}
                activeOpacity={0.85}
              >
                <Text style={[
                  styles.unitButtonText,
                  areaUnit === 'hectare' && styles.unitButtonTextActive
                ]}>Hectare</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={styles.hint}>
            {areaUnit === 'acre' 
              ? '1 acre = 0.4047 hectares' 
              : '1 hectare = 2.471 acres'}
          </Text>
        </View>

        {/* Calculate Button */}
        <TouchableOpacity
          style={[
            styles.calculateButton,
            (!selectedCrop || !area) && styles.calculateButtonDisabled
          ]}
          onPress={handleCalculate}
          disabled={!selectedCrop || !area}
          activeOpacity={0.85}
        >
          <Text style={styles.calculateButtonText}>Calculate Fertilizer</Text>
        </TouchableOpacity>

        {/* Result Section */}
        {result && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View style={styles.resultTitleContainer}>
                <Text style={styles.resultCropName}>{result.cropName}</Text>
                <Text style={styles.resultArea}>
                  {result.area} {result.areaUnit}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.npkTitle}>Required Nutrients</Text>
            
            <View style={styles.npkGrid}>
              <View style={[styles.npkBox, { backgroundColor: theme.colors.tertiary }]}>
                <Text style={styles.npkLabel}>Nitrogen</Text>
                <Text style={styles.npkValue}>{result.N.toFixed(1)} kg</Text>
                <MaterialCommunityIcons name="flask" size={24} color={theme.colors.primary} />
              </View>
              
              <View style={[styles.npkBox, { backgroundColor: theme.colors.tertiary }]}>
                <Text style={styles.npkLabel}>Phosphorus</Text>
                <Text style={styles.npkValue}>{result.P.toFixed(1)} kg</Text>
                <MaterialCommunityIcons name="flask" size={24} color={theme.colors.primary} />
              </View>
              
              <View style={[styles.npkBox, { backgroundColor: theme.colors.tertiary }]}>
                <Text style={styles.npkLabel}>Potassium</Text>
                <Text style={styles.npkValue}>{result.K.toFixed(1)} kg</Text>
                <MaterialCommunityIcons name="flask" size={24} color={theme.colors.primary} />
              </View>
            </View>

            <View style={styles.conversionBox}>
              <Feather name="info" size={16} color={theme.colors.primary} />
              <Text style={styles.conversionText}>
                {result.areaUnit === 'acre'
                  ? `${result.area} acres = ${result.areaInHectares.toFixed(2)} hectares`
                  : `${result.area} hectares = ${(result.areaInHectares / 0.404686).toFixed(2)} acres`}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.tertiary,
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.secondary,
    marginLeft: 10,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.tertiary,
    shadowColor: theme.colors.secondary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.secondary,
    marginBottom: 12,
  },
  areaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  areaInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: theme.colors.secondary,
    borderWidth: 1,
    borderColor: theme.colors.tertiary,
  },
  unitToggle: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.tertiary,
  },
  unitButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  unitButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  unitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.secondary,
  },
  unitButtonTextActive: {
    color: '#FFFFFF',
  },
  hint: {
    fontSize: 12,
    color: theme.colors.secondary,
    opacity: 0.7,
    marginTop: 10,
    fontStyle: 'italic',
  },
  calculateButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  calculateButtonDisabled: {
    backgroundColor: theme.colors.secondary,
    opacity: 0.5,
    shadowOpacity: 0,
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 50,
    borderWidth: 1,
    borderColor: theme.colors.tertiary,
    shadowColor: theme.colors.secondary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  resultTitleContainer: {
    flex: 1,
  },
  resultCropName: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.secondary,
    marginBottom: 4,
  },
  resultArea: {
    fontSize: 14,
    color: theme.colors.secondary,
    opacity: 0.7,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.primary,
    marginBottom: 15,
  },
  npkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.secondary,
    marginBottom: 15,
  },
  npkGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  npkBox: {
    width: (width - 80) / 3,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  npkValue: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.secondary,
    marginTop: 6,
    marginBottom: 2,
  },
  npkLabel: {
    fontSize: 11,
    color: theme.colors.secondary,
    textAlign: 'center',
  },
  conversionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.tertiary,
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
  },
  conversionText: {
    fontSize: 12,
    color: theme.colors.secondary,
    marginLeft: 8,
    flex: 1,
  },
});