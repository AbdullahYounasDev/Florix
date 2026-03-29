// components/CultivationTips.tsx
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

interface GrowthStage {
  id: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  description: string;
}

interface Props {
  onClose?: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GROWTH_STAGES: GrowthStage[] = [
  // === CROP GROWTH STAGES ===
  {
    id: 'germination',
    label: 'Germination',
    icon: 'seed-outline',
    description: 'Seed sprouting & root emergence',
  },
  {
    id: 'seedling',
    label: 'Seedling',
    icon: 'sprout',
    description: 'Early leaf development',
  },
  {
    id: 'vegetative',
    label: 'Vegetative',
    icon: 'leaf',
    description: 'Leaf & stem development',
  },
  {
    id: 'flowering',
    label: 'Flowering',
    icon: 'flower-tulip',
    description: 'Bloom & pollination',
  },
  {
    id: 'fruiting',
    label: 'Fruiting',
    icon: 'food-apple',
    description: 'Fruit formation & growth',
  },
  {
    id: 'maturity',
    label: 'Maturity',
    icon: 'timer-sand',
    description: 'Final development before harvest',
  },

  // === SOIL & LAND PREPARATION ===
  {
    id: 'land-prep',
    label: 'Land Prep',
    icon: 'tractor',
    description: 'Plowing & soil preparation',
  },
  {
    id: 'bed-making',
    label: 'Bed Making',
    icon: 'terrain',
    description: 'Raising beds or ridges',
  },

  // === PLANTING & SOWING ===
  {
    id: 'sowing',
    label: 'Sowing',
    icon: 'sprout',
    description: 'Seed planting in soil',
  },
  {
    id: 'transplanting',
    label: 'Transplanting',
    icon: 'swap-horizontal',
    description: 'Moving seedlings to field',
  },

  // === WATER MANAGEMENT ===
  {
    id: 'irrigation',
    label: 'Irrigation',
    icon: 'water',
    description: 'Water supply to crops',
  },
  {
    id: 'drainage',
    label: 'Drainage',
    icon: 'water-pump',
    description: 'Removing excess water',
  },

  // === NUTRITION & FERTILIZATION ===
  {
    id: 'basal-dose',
    label: 'Basal Dose',
    icon: 'flask',
    description: 'Base fertilizer application',
  },
  {
    id: 'top-dressing',
    label: 'Top Dressing',
    icon: 'spray',
    description: 'Additional fertilizer application',
  },
  {
    id: 'foliar-spray',
    label: 'Foliar Spray',
    icon: 'spray-bottle',
    description: 'Liquid nutrients on leaves',
  },

  // === PEST & DISEASE MANAGEMENT ===
  {
    id: 'pest-control',
    label: 'Pest Control',
    icon: 'bug',
    description: 'Insect & pest management',
  },
  {
    id: 'disease-control',
    label: 'Disease Control',
    icon: 'virus',
    description: 'Fungus & disease prevention',
  },
  {
    id: 'weed-control',
    label: 'Weed Control',
    icon: 'grass',
    description: 'Removing unwanted plants',
  },

  // === CROP MANAGEMENT ===
  {
    id: 'staking',
    label: 'Staking',
    icon: 'pine-tree',
    description: 'Support for climbing plants',
  },
  {
    id: 'pruning',
    label: 'Pruning',
    icon: 'content-cut',
    description: 'Trimming excess branches',
  },
  {
    id: 'mulching',
    label: 'Mulching',
    icon: 'leaf-circle',
    description: 'Covering soil with material',
  },
  {
    id: 'thinning',
    label: 'Thinning',
    icon: 'delete-outline',
    description: 'Removing excess seedlings',
  },

  // === HARVEST & POST-HARVEST ===
  {
    id: 'harvest',
    label: 'Harvest',
    icon: 'sickle',
    description: 'Ready for collection',
  },
  {
    id: 'post-harvest',
    label: 'Post-Harvest',
    icon: 'archive',
    description: 'Cleaning & sorting produce',
  },
  {
    id: 'storage',
    label: 'Storage',
    icon: 'warehouse',
    description: 'Proper preservation methods',
  },

  // === SOIL HEALTH ===
  {
    id: 'soil-test',
    label: 'Soil Test',
    icon: 'flask-empty',
    description: 'Nutrient & pH analysis',
  },
  {
    id: 'composting',
    label: 'Composting',
    icon: 'leaf',
    description: 'Organic matter application',
  },

  // === PROTECTION ===
  {
    id: 'netting',
    label: 'Netting',
    icon: 'shield',
    description: 'Bird & insect protection',
  },
  {
    id: 'greenhouse',
    label: 'Greenhouse',
    icon: 'home-modern',
    description: 'Controlled environment growing',
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CultivationTips({ onClose }: Props) {
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
  const [selectedStage, setSelectedStage] = useState<GrowthStage | null>(null);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchCountry = async () => {
      const address = await getAddress();
      setCountry(address?.country || "International");
      setCity(address?.city || "International");
    };
    fetchCountry();
  }, []);

  const handleClose = () => {
    setSelectedCrop(null);
    setSelectedStage(null);
    setShowConfirmModal(false);
    if (onClose) onClose();
  };

  const handleStageSelect = (stage: GrowthStage) => {
    if (!selectedCrop) {
      Alert.alert('Select Crop First', 'Please select a crop before choosing a growth stage.');
      return;
    }
    setSelectedStage(stage);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setSelectedStage(null);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Cultivation Tips</Text>
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

        {/* Growth Stage Selection */}
        <View style={[styles.cardtwo]}>
          <Text style={styles.label}>Crop Stages</Text>
          <Text style={styles.subLabel}>
            {selectedCrop 
              ? `Select a stage to get cultivation tips for ${selectedCrop.name}`
              : 'Please select a crop first'}
          </Text>
          
          <View style={styles.stageList}>
            {GROWTH_STAGES.map(stage => {
              const isDisabled = !selectedCrop;
              
              return (
                <TouchableOpacity
                  key={stage.id}
                  style={[
                    styles.stageCard,
                    isDisabled && styles.stageCardDisabled,
                  ]}
                  onPress={() => handleStageSelect(stage)}
                  disabled={isDisabled}
                  activeOpacity={0.85}
                >
                  <View style={styles.stageIcon}>
                    <MaterialCommunityIcons
                      name={stage.icon}
                      size={24}
                      color={theme.colors.secondary}
                    />
                  </View>
                  <View style={styles.stageHeadDesc}>
                    <Text style={styles.stageLabel}>
                      {stage.label}
                    </Text>
                    <Text style={styles.stageDescription}>
                      {stage.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Diagnosis Modal - Shows selected crop, growth stage, and country */}
      {selectedCrop && selectedStage && (
        <DiagnosisModal
          visible={showConfirmModal}
          onClose={closeConfirmModal}
          cropName={selectedCrop.name}
          diseaseType={selectedStage.label}
          country={country}
          city={city}
          ModalHeading="Cultivation Tips"
          ModalParent="CultivationTips"
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
    marginTop: 10,
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
  stageList: {
    flexDirection: 'column',
  },
  stageCard: {
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
  stageCardDisabled: {
    opacity: 0.5,
  },
  stageIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },
  stageHeadDesc: {
    alignItems: 'flex-start',
    marginLeft: 10,
    flex: 1,
  },
  stageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.secondary,
    marginBottom: 4,
  },
  stageDescription: {
    fontSize: 11,
    color: theme.colors.secondary,
    opacity: 0.7,
  },
});