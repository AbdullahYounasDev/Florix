import { theme } from '@/utils/theme';
import { Feather } from '@expo/vector-icons';
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
  onDone: () => void;
  categories: PlantCategory[];
  onClose?: () => void;
};

export default function PlantsSelector({
  selectedPlants,
  onPlantToggle,
  onDone,
  categories,
  onClose
}: PlantsSelectorProps) {
  const handleDeselectAll = () => {
    selectedPlants.forEach(plantId => onPlantToggle(plantId));
  };

  const isSelected = selectedPlants.length > 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Select Your Crops</Text>
        </View>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.85}>
            <Feather name="x" size={22} color={theme.colors.secondary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Selection Summary Card - Enhanced Design */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
              <Feather name="check-circle" size={20} color={theme.colors.primary} />
            <Text style={styles.selectionCount}>
              {selectedPlants.length} of 9 crops selected
            </Text>
          </View>
          {isSelected && (
            <TouchableOpacity
              onPress={handleDeselectAll}
              style={styles.deselectButton}
              activeOpacity={0.85}
            >
              <Text style={styles.deselectText}>Deselect All</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Categories and Crops - 4 per row */}
        {categories.map((category) => (
          <View key={category.region} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category.region}</Text>
            <View style={styles.divider} />
            
            <View style={styles.cropsGrid}>
              {category.crops.map((crop) => {
                const isCropSelected = selectedPlants.includes(crop.id);
                return (
                  <TouchableOpacity
                    key={crop.id}
                    style={[
                      styles.cropCard,
                      isCropSelected && styles.cropCardSelected
                    ]}
                    onPress={() => onPlantToggle(crop.id)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.cropIconWrapper}>
                      <Text style={styles.cropIcon}>{crop.icon}</Text>
                    </View>
                    <Text style={[
                      styles.cropName,
                      isCropSelected && styles.cropNameSelected
                    ]}>
                      {crop.name}
                    </Text>
                    {isCropSelected && (
                      <View style={styles.selectedOverlay}>
                        <Feather name="check" size={16} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Footer with Done Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.doneButton,
            selectedPlants.length === 0 && styles.doneButtonDisabled
          ]}
          onPress={onDone}
          disabled={selectedPlants.length === 0}
          activeOpacity={0.85}
        >
          <Text style={styles.doneButtonText}>Done</Text>
          {selectedPlants.length > 0 && (
            <Feather name="check" size={18} color="#FFFFFF" style={styles.doneIcon} />
          )}
        </TouchableOpacity>
      </View>
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
    paddingTop:26,
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
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  // Enhanced Summary Card
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.tertiary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.colors.primary + '20', // 20% opacity
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  selectionCount: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.secondary,
  },
  deselectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  deselectText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  // Category Section
  categorySection: {
    marginBottom: 28,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.secondary,
    marginBottom: 8,
  },
  divider: {
    height: 2,
    width: 40,
    backgroundColor: theme.colors.primary,
    marginBottom: 16,
    borderRadius: 2,
  },
  // Crops Grid - 4 per row
  cropsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 12,
  },
  cropCard: {
    width: '22%', // 4 cards per row (22% + gap = ~25% each)
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: theme.colors.tertiary,
    position: 'relative',
  },
  cropCardSelected: {
    backgroundColor: theme.colors.tertiary,
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
  },
  cropIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cropIcon: {
    fontSize: 32,
  },
  cropName: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.colors.secondary,
    textAlign: 'center',
  },
  cropNameSelected: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  selectedOverlay: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // Footer
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.tertiary,
    backgroundColor: '#FFFFFF',
  },
  doneButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  doneButtonDisabled: {
    backgroundColor: theme.colors.secondary + '80', // 50% opacity
    shadowOpacity: 0,
    elevation: 0,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  doneIcon: {
    marginLeft: 4,
  },
});