// components/PestsAndDisease.tsx
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { cropFertilizerData } from '@/utils/cropFertilizerData';
import { plantCategories } from '@/utils/plantCategories';
import { theme } from '@/utils/theme';
import { getAddress } from '@/utils/userdata';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import CropSelector from '../../Useable/CropSelector';
import DiagnosisModal from '../../Useable/DiagnosisModal';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PestCategory {
  id: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  description: string;
}

interface Props {
  onClose?: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PEST_CATEGORIES: PestCategory[] = [
  {
    id: 'fungal',
    label: 'Fungal Diseases',
    icon: 'mushroom',
    description: 'Blight, mildew, rust & root rot',
  },
  {
    id: 'bacterial',
    label: 'Bacterial Diseases',
    icon: 'bacteria',
    description: 'Wilt, blight, canker & rot',
  },
  {
    id: 'viral',
    label: 'Viral Diseases',
    icon: 'virus',
    description: 'Mosaic, leaf curl & yellowing',
  },
  {
    id: 'insects',
    label: 'Insect Pests',
    icon: 'bug',
    description: 'Aphids, borers, caterpillars',
  },
  {
    id: 'nematodes',
    label: 'Nematodes',
    icon: 'dna',
    description: 'Root-knot & cyst nematodes',
  },
  {
    id: 'weeds',
    label: 'Weed Problems',
    icon: 'grass',
    description: 'Competitive weed species',
  },
  {
    id: 'nutrient',
    label: 'Nutrient Deficiency',
    icon: 'leaf',
    description: 'Yellowing, poor growth & low yield',
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PestsAndDisease({ onClose }: Props) {
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

  const [selectedCrop, setSelectedCrop] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<PestCategory | null>(null);
  const [country, setCountry] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchCountry = async () => {
      const address = await getAddress();
      setCountry(address?.country || "International");
    };
    fetchCountry();
  }, []);

  const handleClose = () => {
    setSelectedCrop(null);
    setSelectedCategory(null);
    setShowConfirmModal(false);
    if (onClose) onClose();
  };

  const handleCategorySelect = (category: PestCategory) => {
    if (!selectedCrop) {
      Alert.alert('Select Crop First', 'Please select a crop before choosing a pest/disease category.');
      return;
    }
    setSelectedCategory(category);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setSelectedCategory(null);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Pests & Disease</Text>
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

        {/* Disease/Pest Category Selection */}
        <View style={[styles.cardtwo]}>
          <Text style={styles.label}>Pest & Disease Categories</Text>
          <Text style={styles.subLabel}>
            {selectedCrop 
              ? `Select a category to diagnose issues in ${selectedCrop.name}`
              : 'Please select a crop first'}
          </Text>
          
          <View style={styles.categoryGrid}>
            {PEST_CATEGORIES.map(cat => {
              const isDisabled = !selectedCrop;
              
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryCard,
                    isDisabled && styles.categoryCardDisabled,
                  ]}
                  onPress={() => handleCategorySelect(cat)}
                  disabled={isDisabled}
                  activeOpacity={0.85}
                >
                  <View style={styles.categoryIcon}>
                    <MaterialCommunityIcons
                      name={cat.icon}
                      size={24}
                      color={theme.colors.secondary}
                    />
                  </View>
                  <View style={styles.diesaseHeadDesc}>
                    <Text style={styles.categoryLabel}>
                      {cat.label}
                    </Text>
                    <Text style={styles.categoryDescription}>
                      {cat.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Diagnosis Modal - Only shows selected crop, category, and country */}
      {selectedCrop && selectedCategory && (
        <DiagnosisModal
          visible={showConfirmModal}
          onClose={closeConfirmModal}
          cropName={selectedCrop.name}
          diseaseType={selectedCategory.label}
          country={country}
          ModalHeading="Disease Details"
        />
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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
  cardtwo: {
    marginBottom: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop:10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.secondary,
    marginBottom: 4,
  },
  subLabel: {
    fontSize: 12,
    color: theme.colors.secondary,
    opacity: 0.7,
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: "100%",
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.tertiary,
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  categoryCardDisabled: {
    opacity: 0.5,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },
  diesaseHeadDesc: {
    alignItems: 'flex-start',
    marginLeft: 10,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.secondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 11,
    color: theme.colors.secondary,
    opacity: 0.7,
    textAlign: 'center',
  },
});