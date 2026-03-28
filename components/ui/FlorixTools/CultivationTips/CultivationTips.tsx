// components/CultivationTips.tsx
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
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

const { width } = Dimensions.get('window');

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
    label: 'Vegetative Growth',
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
    label: 'Maturity / Ripening',
    icon: 'timer-sand',
    description: 'Final development before harvest',
  },
  {
    id: 'harvest',
    label: 'Harvest',
    icon: 'sickle',
    description: 'Ready for collection',
  },
];

// Calculate card width for 2 columns with proper spacing
// Total padding: 20 (scrollView padding) * 2 = 40, gap between cards: 12
const CARD_WIDTH = (width - 40 - 12) / 2; // width - (horizontal padding) - (gap)

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

  // Split stages into rows of 2 for better layout control
  const renderStageRows = () => {
    const rows = [];
    for (let i = 0; i < GROWTH_STAGES.length; i += 2) {
      const rowStages = GROWTH_STAGES.slice(i, i + 2);
      rows.push(
        <View key={i} style={styles.stageRow}>
          {rowStages.map(stage => {
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
                    size={32}
                    color={theme.colors.secondary}
                  />
                </View>
                <Text style={styles.stageLabel}>
                  {stage.label}
                </Text>
                <Text style={styles.stageDescription}>
                  {stage.description}
                </Text>
              </TouchableOpacity>
            );
          })}
          {/* Add empty placeholder if only one item in row to maintain layout */}
          {rowStages.length === 1 && <View style={[styles.stageCard, styles.stageCardPlaceholder]} />}
        </View>
      );
    }
    return rows;
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
          <Text style={styles.label}>Growth Stages</Text>
          <Text style={styles.subLabel}>
            {selectedCrop 
              ? `Select a stage to get cultivation tips for ${selectedCrop.name}`
              : 'Please select a crop first'}
          </Text>
          
          <View style={styles.stageGrid}>
            {renderStageRows()}
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
          ModalHeading="Cultivation Tips"
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
  stageGrid: {
    flexDirection: 'column',
  },
  stageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  stageCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    minHeight: 140,
  },
  stageCardPlaceholder: {
    opacity: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  stageCardDisabled: {
    opacity: 0.5,
  },
  stageIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  stageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.secondary,
    textAlign: 'center',
    marginBottom: 6,
  },
  stageDescription: {
    fontSize: 11,
    color: theme.colors.secondary,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 14,
  },
});