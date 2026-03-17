// components/FertilizerCalculator.tsx
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
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
    // cropIcon: crop.icon || '🌱',
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
  const [cropIdInput, setCropIdInput] = useState('');
  const [area, setArea] = useState('');
  const [areaUnit, setAreaUnit] = useState<'acre' | 'hectare'>('acre');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showCropModal, setShowCropModal] = useState(false);

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
    setCropIdInput('');
    setArea('');
    setResult(null);
    setSuggestions([]);
    setShowSuggestions(false);
    if (onClose) onClose();
  };

  const handleCropInputChange = (text: string) => {
    setCropIdInput(text);
    setResult(null);
    if (text.length > 0) {
      const search = text.toLowerCase();
      const filtered = allCrops
        .filter(
          crop =>
            crop.id.toLowerCase().startsWith(search) ||
            crop.name.toLowerCase().includes(search)
        )
        .slice(0, 6);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectCrop = (cropId: string) => {
    setCropIdInput(cropId.toLowerCase());
    setShowSuggestions(false);
    setShowCropModal(false);
  };

  const handleCalculate = () => {
    const cropId = cropIdInput.trim().toLowerCase();

    if (!fertilizerCropIds.includes(cropId)) {
      return Alert.alert('Invalid Crop', 'Please select a supported crop');
    }

    const numericArea = parseFloat(area);
    if (isNaN(numericArea) || numericArea <= 0) {
      return Alert.alert(
        'Invalid Area',
        'Please enter a valid numeric area greater than 0'
      );
    }

    const res = calculateFertilizerPro(cropId, numericArea, areaUnit);
    if (!res) return Alert.alert('Error', 'Calculation failed');

    setResult(res);
  };

  const getSelectedCropDetails = () => {
    if (!cropIdInput) return null;
    return allCrops.find(c => c.id === cropIdInput.toLowerCase());
  };

  const selectedCrop = getSelectedCropDetails();

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
          <Text style={styles.label}>
            {' '}Select Crop
          </Text>
          
          <TouchableOpacity 
            style={styles.cropSelector}
            onPress={() => setShowCropModal(true)}
            activeOpacity={0.85}
          >
            {selectedCrop ? (
              <View style={styles.selectedCrop}>
                <View style={styles.cropIconContainer}>
                  <Text style={styles.cropIcon}>{selectedCrop.icon}</Text>
                </View>
                <View style={styles.cropInfo}>
                  <Text style={styles.cropName}>{selectedCrop.name}</Text>
                  <Text style={styles.cropCategory}>{selectedCrop.category}</Text>
                </View>
                <Feather name="chevron-down" size={20} color={theme.colors.secondary} />
              </View>
            ) : (
              <View style={styles.placeholderCrop}>
                <Text style={styles.placeholderText}>Choose a crop</Text>
                <Feather name="chevron-down" size={20} color="#999" />
              </View>
            )}
          </TouchableOpacity>

          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <View style={styles.suggestionsContainer}>
              <FlatList
                data={suggestions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => selectCrop(item.id)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.suggestionIcon}>{item.icon}</Text>
                    <View style={styles.suggestionTextContainer}>
                      <Text style={styles.suggestionName}>{item.name}</Text>
                      <Text style={styles.suggestionId}>{item.id}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>

        {/* Area Input Card */}
        <View style={styles.card}>
          <Text style={styles.label}>
            {' '}Land Area
          </Text>
          
          <View style={styles.areaRow}>
            <TextInput
              placeholder="0.00"
              keyboardType="numeric"
              value={area}
              onChangeText={setArea}
              style={styles.areaInput}
              placeholderTextColor="#BDBDBD"
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
            (!cropIdInput || !area) && styles.calculateButtonDisabled
          ]}
          onPress={handleCalculate}
          disabled={!cropIdInput || !area}
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
              <View style={[styles.npkBox, { backgroundColor: '#E3F2FD' }]}>
                <Text style={styles.npkLabel}>Nitrogen</Text>
                <Text style={styles.npkValue}>{result.N.toFixed(1)} kg</Text>
                <MaterialCommunityIcons name="flask" size={24} color="#1976D2" />
              </View>
              
              <View style={[styles.npkBox, { backgroundColor: '#FFF3E0' }]}>
                <Text style={styles.npkLabel}>Phosphorus</Text>
                <Text style={styles.npkValue}>{result.P.toFixed(1)} kg</Text>
                <MaterialCommunityIcons name="flask" size={24} color="#F57C00" />
              </View>
              
              <View style={[styles.npkBox, { backgroundColor: '#E8F5E8' }]}>
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

      {/* Crop Selection Modal */}
      <Modal
        visible={showCropModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCropModal(false)}
          statusBarTranslucent
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setShowCropModal(false)}
          activeOpacity={0.85}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select a Crop</Text>
              <TouchableOpacity onPress={() => setShowCropModal(false)} activeOpacity={0.85}>
                <Feather name="x" size={22} color={theme.colors.secondary} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={allCrops}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.cropList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.cropListItem}
                  onPress={() => selectCrop(item.id)}
                  activeOpacity={0.85}
                >
                  <View style={styles.cropListItemIcon}>
                    <Text style={styles.cropListItemIconText}>{item.icon}</Text>
                  </View>
                  <View style={styles.cropListItemInfo}>
                    <Text style={styles.cropListItemName}>{item.name}</Text>
                    <Text style={styles.cropListItemCategory}>{item.category}</Text>
                  </View>
                  {item.id === cropIdInput && (
                    <Feather name="check" size={20} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
    borderBottomColor: '#E8F5E8',
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
    borderWidth: 0.1,
    borderColor: '#2e2e2e05',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.secondary,
    marginBottom: 12,
  },
  cropSelector: {
    borderWidth: 1,
    borderColor: '#2e2e2e05',
    borderRadius: 12,
    backgroundColor: '#F9F9F9',
  },
  selectedCrop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  cropIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cropIcon: {
    fontSize: 22,
  },
  cropInfo: {
    flex: 1,
  },
  cropName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.secondary,
    marginBottom: 2,
  },
  cropCategory: {
    fontSize: 12,
    color: '#999',
  },
  placeholderCrop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  suggestionsContainer: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8F5E8',
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  suggestionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.secondary,
  },
  suggestionId: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  areaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  areaInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: theme.colors.secondary,
  },
  unitToggle: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2e2e2e05',
  },
  unitButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
  },
  unitButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  unitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  unitButtonTextActive: {
    color: '#FFFFFF',
  },
  hint: {
    fontSize: 12,
    color: '#999',
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
    backgroundColor: '#B0BEC5',
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
    borderWidth: 0.5,
    borderColor: '#2e2e2e05',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
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
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.secondary,
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
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
  },
  conversionText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  cropList: {
    paddingBottom: 10,
  },
  cropListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cropListItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cropListItemIconText: {
    fontSize: 20,
  },
  cropListItemInfo: {
    flex: 1,
  },
  cropListItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.secondary,
    marginBottom: 2,
  },
  cropListItemCategory: {
    fontSize: 12,
    color: '#999',
  },
});