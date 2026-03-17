import { theme } from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export type Plant = {
  id: string;
  name: string;
  icon: string;
};

export type PlantCategory = {
  region: string;
  crops: Plant[];
};

type PlantsSelectorProps = {
  selectedPlants: string[];
  onPlantToggle: (plantId: string) => void;
  onDeselectAll?: () => void;
  showHeader?: boolean;
  showSelectionSummary?: boolean;
  showActions?: boolean;
  onContinue?: () => void;
  onBack?: () => void;
  continueButtonText?: string;
  backButtonText?: string;
  categories: PlantCategory[];
  title?: string;
  subtitle?: string;
  page?: string
};

export default function PlantsSelector({
  selectedPlants,
  onPlantToggle,
  onDeselectAll,
  showHeader = true,
  showSelectionSummary = true,
  showActions = true,
  onContinue,
  onBack,
  continueButtonText = 'Continue',
  backButtonText = 'Back',
  categories,
  title = 'Select Your Crops',
  subtitle = 'Choose the plants you cultivate for personalized advice',
  page = 'onboarding'
}: PlantsSelectorProps) {
  const handleDeselectAll = () => {
    if (onDeselectAll) {
      onDeselectAll();
    }
  };

  const isSelected = selectedPlants.length > 0;

  return (
    <View style={styles.container}>
      {showHeader && (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
          </View>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </>
      )}

      {showSelectionSummary && (
        <View style={styles.selectionSummary}>
          <Text
            style={[
              styles.selectionCount
            ]}
          >{selectedPlants.length}/9 selected
          </Text>

          {isSelected && (
            <TouchableOpacity
              onPress={handleDeselectAll}
              style={styles.selectAllButton}
              activeOpacity={0.85}
            >
              <Text style={styles.selectAllText}>
                Deselect All
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <ScrollView
        style={styles.cropsContainer}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((category) => (
          <View key={category.region} style={styles.regionSection}>
            <Text style={styles.regionTitle}>{category.region}</Text>
            <View style={styles.cropsGrid}>
              {category.crops.map((crop) => {
                const isSelected = selectedPlants.includes(crop.id);
                return (
                  <TouchableOpacity
                   activeOpacity={0.85}
                    key={crop.id}
                    style={[
                      styles.cropButton,
                      isSelected && styles.selectedCropButton
                    ]}
                    onPress={() => onPlantToggle(crop.id)}
                  >
                    <View style={styles.cropIconContainer}>
                      <Text style={styles.cropIcon}>{crop.icon}</Text>
                      {isSelected && (
                        <View style={styles.checkmarkOverlay}>
                          <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                        </View>
                      )}
                    </View>
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

      {showActions && (onContinue || onBack) && (
        <View style={styles.navigationRow}>
          {onBack && (page === 'onboarding') && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBack}
            >
              <Ionicons name="arrow-back" size={20} color="#8B4513" />
              <Text style={styles.backButtonText}>{backButtonText}</Text>
            </TouchableOpacity>
          )}

          {onContinue && (
            <TouchableOpacity
              style={[
                styles.continueButton,
                selectedPlants.length === 0 && styles.continueButtonDisabled
              ]}
              onPress={onContinue}
              disabled={selectedPlants.length === 0}
              activeOpacity={0.85}
            >
              <Text style={styles.continueButtonText}>
                {continueButtonText}
              </Text>
              {selectedPlants.length > 0 && (
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingTop: 35,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.secondary,
    flex: 1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    marginHorizontal: 15,
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
    borderColor: theme.colors.primary,
    marginBottom: 25,
    marginHorizontal: 15,
  },
  selectionCount: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  selectAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  selectAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  cropsContainer: {
    flex: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  regionSection: {
    marginBottom: 25,
  },
  regionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.secondary,
    marginBottom: 15,
    paddingLeft: 8,
  },
  cropsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 3,
  },
  cropButton: {
    width: '23%',
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
    borderColor: theme.colors.primary,
    borderWidth: 1,
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
    color: theme.colors.secondary,
    textAlign: 'center',
  },
  selectedCropName: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  navigationRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 15,
    paddingTop: 0,
    paddingBottom: 15
  },
  backButton: {
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
  continueButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
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
    backgroundColor: theme.colors.secondary,
    opacity: 0.6,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
});