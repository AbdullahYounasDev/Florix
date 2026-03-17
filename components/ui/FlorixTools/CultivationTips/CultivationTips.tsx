// components/CultivationTips.tsx
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { cropFertilizerData } from '@/utils/cropFertilizerData';
import { plantCategories } from '@/utils/plantCategories';
import { theme } from '@/utils/theme';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// ─── Types ────────────────────────────────────────────────────────────────────

interface Stage {
  id: string;
  label: string;
  icon: string;
  color: string;
  bg: string;
  description: string;
}

interface TipSection {
  title: string;
  icon: string;
  tips: string[];
}

interface StageResult {
  stage: string;
  crop: string;
  duration: string;
  summary: string;
  sections: TipSection[];
  warning?: string;
}

interface Props {
  onClose?: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STAGES: Stage[] = [
  {
    id: 'seed',
    label: 'Seed & Germination',
    icon: 'seed-outline',
    color: '#6D4C41',
    bg: '#EFEBE9',
    description: 'Soil prep & sowing',
  },
  {
    id: 'initial',
    label: 'Initial Stage',
    icon: 'sprout',
    color: '#388E3C',
    bg: '#E8F5E9',
    description: 'Seedling establishment',
  },
  {
    id: 'growing',
    label: 'Growing Stage',
    icon: 'flower',
    color: '#1976D2',
    bg: '#E3F2FD',
    description: 'Vegetative growth',
  },
  {
    id: 'flowering',
    label: 'Flowering',
    icon: 'flower-tulip',
    color: '#E91E8C',
    bg: '#FCE4EC',
    description: 'Bloom & pollination',
  },
  {
    id: 'harvest',
    label: 'Harvest',
    icon: 'sickle',
    color: '#F57C00',
    bg: '#FFF3E0',
    description: 'Maturity & collection',
  },
];

// ─── Dummy API ─────────────────────────────────────────────────────────────────

const fetchCultivationTips = async (
  cropName: string,
  stageId: string
): Promise<StageResult> => {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 1400));

  const stageLabel = STAGES.find(s => s.id === stageId)?.label ?? stageId;

  const dummyData: Record<string, StageResult> = {
    seed: {
      stage: stageLabel,
      crop: cropName,
      duration: '7–14 days',
      summary: `Proper seed preparation for ${cropName} is the foundation of a healthy crop. Focus on soil structure and moisture retention before sowing.`,
      sections: [
        {
          title: 'Soil Preparation',
          icon: 'shovel',
          tips: [
            'Plough the field 2–3 times to achieve a fine tilth.',
            'Maintain soil pH between 6.0–7.0 for optimal germination.',
            'Mix 2–3 tonnes of well-composted farmyard manure per acre.',
          ],
        },
        {
          title: 'Seed Treatment',
          icon: 'test-tube',
          tips: [
            `Treat ${cropName} seeds with Thiram (2g/kg) to prevent fungal damping-off.`,
            'Soak seeds in water for 8 hours before sowing to boost germination rate.',
            'Use only certified, disease-free seed varieties from reliable sources.',
          ],
        },
        {
          title: 'Sowing Tips',
          icon: 'sprout-outline',
          tips: [
            'Sow at recommended depth (2–4 cm) to ensure even emergence.',
            'Maintain appropriate row spacing for air circulation.',
            'Water lightly after sowing — avoid waterlogging.',
          ],
        },
      ],
      warning: 'Do not sow in water-logged or compacted soils. Check weather forecast before field operations.',
    },
    initial: {
      stage: stageLabel,
      crop: cropName,
      duration: '14–30 days',
      summary: `The initial stage is critical for ${cropName}. Young seedlings need careful water management and early pest monitoring to establish strong root systems.`,
      sections: [
        {
          title: 'Irrigation',
          icon: 'water',
          tips: [
            'Irrigate lightly every 3–4 days — avoid over-watering young roots.',
            'Early morning irrigation reduces evaporation and fungal risk.',
            'Check soil moisture at 5 cm depth before each watering session.',
          ],
        },
        {
          title: 'Weed Control',
          icon: 'leaf-off',
          tips: [
            'Perform first weeding 15–20 days after germination.',
            'Hand-weed carefully around seedlings to avoid root disturbance.',
            'Apply pre-emergence herbicide if weed pressure is high.',
          ],
        },
        {
          title: 'Nutrition Start',
          icon: 'flask-outline',
          tips: [
            'Apply starter dose of nitrogen (20 kg/acre) to boost early growth.',
            'Foliar spray of micronutrients (Zn, Fe) helps prevent yellowing.',
            'Avoid heavy fertilizer application — young roots are sensitive.',
          ],
        },
      ],
    },
    growing: {
      stage: stageLabel,
      crop: cropName,
      duration: '30–60 days',
      summary: `During the vegetative phase ${cropName} demands peak nutrition and consistent moisture. This stage determines yield potential, so do not miss fertilizer schedules.`,
      sections: [
        {
          title: 'Fertilizer Schedule',
          icon: 'flask',
          tips: [
            'Apply split dose of NPK — 40% at sowing, 30% at tillering/branching, 30% at booting.',
            'Top-dress with urea (30 kg/acre) for rapid canopy development.',
            'Potassium application strengthens stems and improves drought tolerance.',
          ],
        },
        {
          title: 'Pest & Disease Watch',
          icon: 'bug',
          tips: [
            'Scout fields weekly for signs of aphids, stem borers, and leaf spot.',
            `Apply neem oil spray (5 ml/L) as a bio-pesticide for ${cropName}.`,
            'Remove and destroy infected plant parts immediately.',
          ],
        },
        {
          title: 'Water Management',
          icon: 'water-pump',
          tips: [
            'Critical irrigation stages: tillering, jointing, and heading.',
            'Ensure soil moisture at 50–60% field capacity during peak growth.',
            'Avoid stagnant water — improve field drainage if necessary.',
          ],
        },
      ],
      warning: 'Watch for nutrient deficiency signs: yellowing leaves may indicate nitrogen shortage, purple tints indicate phosphorus deficiency.',
    },
    flowering: {
      stage: stageLabel,
      crop: cropName,
      duration: '10–20 days',
      summary: `Flowering is the most sensitive phase for ${cropName}. Stress from drought, extreme heat, or pest damage during this stage directly reduces grain/fruit set.`,
      sections: [
        {
          title: 'Pollination Support',
          icon: 'bee-flower',
          tips: [
            'Avoid applying pesticides during flowering hours (6–10 AM).',
            'Maintain bee populations nearby — they boost pollination by 30%.',
            'Gentle light irrigation during dry spells helps pollen viability.',
          ],
        },
        {
          title: 'Nutrition',
          icon: 'flask-round-bottom',
          tips: [
            'Apply boron spray (1g/L) to improve fruit/grain set significantly.',
            'Potassium top-dressing enhances sugar translocation to developing fruits.',
            'Avoid excess nitrogen — it promotes vegetative growth over fruiting.',
          ],
        },
        {
          title: 'Stress Management',
          icon: 'thermometer',
          tips: [
            'Irrigate in evening if daytime temperatures exceed 38°C.',
            'Mulching around the base retains moisture and reduces heat stress.',
            'Remove competing weed growth to direct all nutrients to flowering.',
          ],
        },
      ],
      warning: 'High humidity during flowering promotes fungal diseases like powdery mildew. Apply fungicide prophylactically if conditions are wet.',
    },
    harvest: {
      stage: stageLabel,
      crop: cropName,
      duration: '5–15 days',
      summary: `Timely and proper harvesting of ${cropName} prevents post-harvest losses. Monitor crop maturity indicators carefully to maximise quality and yield.`,
      sections: [
        {
          title: 'Maturity Indicators',
          icon: 'eye-check',
          tips: [
            'Check grain/fruit moisture content — ideal range is 14–20% for safe storage.',
            'Observe color change: golden yellow for cereals, deep color for fruits.',
            'Physiological maturity is confirmed when 85–90% of the crop is ready.',
          ],
        },
        {
          title: 'Harvesting Method',
          icon: 'sickle',
          tips: [
            'Harvest during morning hours to reduce moisture loss and shattering.',
            'Use sharp, clean tools or calibrated machinery to minimise crop damage.',
            'Avoid harvesting immediately after rain — let the crop dry naturally.',
          ],
        },
        {
          title: 'Post-Harvest Care',
          icon: 'warehouse',
          tips: [
            'Dry harvested produce to below 12% moisture before storage.',
            'Store in clean, airtight containers or gunny bags on raised platforms.',
            'Apply grain protectant dust (e.g. Malathion 5%) to prevent weevil damage.',
          ],
        },
      ],
      warning: 'Delayed harvesting causes field losses due to shattering, bird damage, and weather. Plan harvesting logistics in advance.',
    },
  };

  return dummyData[stageId] ?? dummyData['growing'];
};

// ─── Component ─────────────────────────────────────────────────────────────────

export default function CultivationTips({ onClose }: Props) {
  const fertilizerCropIds = cropFertilizerData.map(c => c.id);

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

  const [selectedCropId, setSelectedCropId] = useState<string>('');
  const [showCropModal, setShowCropModal] = useState(false);
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StageResult | null>(null);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  // Animated values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const selectedCrop = allCrops.find(c => c.id === selectedCropId);

  const handleSelectCrop = (cropId: string) => {
    setSelectedCropId(cropId);
    setShowCropModal(false);
    setActiveStage(null);
    setResult(null);
  };

  const handleStagePress = async (stage: Stage) => {
    if (!selectedCropId) return;
    if (activeStage === stage.id && result) return; // already loaded

    setActiveStage(stage.id);
    setResult(null);
    setExpandedSection(null);
    setLoading(true);

    fadeAnim.setValue(0);
    slideAnim.setValue(20);

    try {
      const data = await fetchCultivationTips(selectedCrop?.name ?? selectedCropId, stage.id);
      setResult(data);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start();
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedCropId('');
    setActiveStage(null);
    setResult(null);
    if (onClose) onClose();
  };

  const activeStageObj = STAGES.find(s => s.id === activeStage);

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Cultivation Tips</Text>
        </View>
        {onClose && (
          <TouchableOpacity onPress={handleClose} style={styles.closeButton} activeOpacity={0.8}>
            <Feather name="x" size={22} color={theme.colors.secondary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>

        {/* ── Compact Crop Selector ── */}
        <TouchableOpacity
          style={styles.compactCropSelector}
          onPress={() => setShowCropModal(true)}
          activeOpacity={0.85}
        >
          {selectedCrop ? (
            <>
              <View style={styles.compactCropIcon}>
                <Text style={{ fontSize: 20 }}>{selectedCrop.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.compactCropName}>{selectedCrop.name}</Text>
                <Text style={styles.compactCropSub}>{selectedCrop.category}</Text>
              </View>
              <View style={styles.changeBadge}>
                <Text style={styles.changeBadgeText}>Change</Text>
              </View>
            </>
          ) : (
            <>
              <View style={[styles.compactCropIcon, { backgroundColor: '#F0F0F0' }]}>
                <MaterialCommunityIcons name="leaf" size={20} color={theme.colors.secondary} />
              </View>
              <Text style={[styles.compactCropName, { color: theme.colors.secondary, fontWeight: '500' }]}>
                Select a crop to begin
              </Text>
              <Feather name="chevron-down" size={18} color={theme.colors.secondary} />
            </>
          )}
        </TouchableOpacity>

        {/* ── Section Title ── */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Growth Stages</Text>
          {selectedCrop && (
            <Text style={styles.sectionSubtitle}>Tap a stage for detailed tips</Text>
          )}
        </View>

        {/* ── Stage Cards ── */}
        <View style={styles.stageGrid}>
          {STAGES.map(stage => {
            const isActive = activeStage === stage.id;
            const disabled = !selectedCropId;
            return (
              <TouchableOpacity
                key={stage.id}
                style={[
                  styles.stageCard,
                  isActive && { borderColor: stage.color, borderWidth: 2, backgroundColor: stage.bg },
                  disabled && styles.stageCardDisabled,
                ]}
                onPress={() => handleStagePress(stage)}
                activeOpacity={0.8}
                disabled={disabled}
              >
                <View style={[styles.stageIconWrap, { backgroundColor: isActive ? stage.color : stage.bg }]}>
                  <MaterialCommunityIcons
                    name={stage.icon as any}
                    size={22}
                    color={isActive ? '#fff' : stage.color}
                  />
                </View>
                <Text style={[styles.stageCardLabel, disabled && { color: '#BDBDBD' }]}>
                  {stage.label}
                </Text>
                <Text style={[styles.stageCardDesc, disabled && { color: '#E0E0E0' }]}>
                  {stage.description}
                </Text>
                {isActive && (
                  <View style={[styles.stageActiveDot, { backgroundColor: stage.color }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Loading ── */}
        {loading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Fetching tips for {activeStageObj?.label}…</Text>
          </View>
        )}

        {/* ── Result ── */}
        {result && !loading && activeStageObj && (
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

            {/* Result Header */}
            <View style={[styles.resultHeader, { borderLeftColor: activeStageObj.color }]}>
              <View style={styles.resultHeaderTop}>
                <View style={[styles.resultStageBadge, { backgroundColor: activeStageObj.bg }]}>
                  <MaterialCommunityIcons name={activeStageObj.icon as any} size={14} color={activeStageObj.color} />
                  <Text style={[styles.resultStageBadgeText, { color: activeStageObj.color }]}>
                    {result.stage}
                  </Text>
                </View>
                <Text style={styles.resultDuration}>⏱ {result.duration}</Text>
              </View>
              <Text style={styles.resultCropName}>{result.crop}</Text>
              <Text style={styles.resultSummary}>{result.summary}</Text>
            </View>

            {/* Tip Sections */}
            {result.sections.map((section, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.tipSection}
                onPress={() => setExpandedSection(expandedSection === idx ? null : idx)}
                activeOpacity={0.85}
              >
                <View style={styles.tipSectionHeader}>
                  <View style={styles.tipSectionLeft}>
                    <View style={[styles.tipSectionIconWrap, { backgroundColor: activeStageObj.bg }]}>
                      <MaterialCommunityIcons
                        name={section.icon as any}
                        size={18}
                        color={activeStageObj.color}
                      />
                    </View>
                    <Text style={styles.tipSectionTitle}>{section.title}</Text>
                  </View>
                  <Feather
                    name={expandedSection === idx ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={theme.colors.secondary}
                  />
                </View>

                {expandedSection === idx && (
                  <View style={styles.tipList}>
                    {section.tips.map((tip, tIdx) => (
                      <View key={tIdx} style={styles.tipItem}>
                        <View style={[styles.tipBullet, { backgroundColor: activeStageObj.color }]} />
                        <Text style={styles.tipText}>{tip}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            ))}

            {/* Warning Box */}
            {result.warning && (
              <View style={styles.warningBox}>
                <Feather name="alert-triangle" size={16} color="#F57C00" style={{ marginTop: 2 }} />
                <Text style={styles.warningText}>{result.warning}</Text>
              </View>
            )}

            <View style={{ height: 40 }} />
          </Animated.View>
        )}

        {/* Empty State */}
        {!selectedCropId && !loading && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="leaf-circle-outline" size={64} color="#C8E6C9" />
            <Text style={styles.emptyTitle}>Select a Crop</Text>
            <Text style={styles.emptySubtitle}>
              Choose your crop above, then tap any growth stage to get tailored farming tips.
            </Text>
          </View>
        )}

        {selectedCropId && !activeStage && !loading && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="gesture-tap" size={52} color="#C8E6C9" />
            <Text style={styles.emptyTitle}>Pick a Stage</Text>
            <Text style={styles.emptySubtitle}>
              Tap on a growth stage above to see expert cultivation tips for {selectedCrop?.name}.
            </Text>
          </View>
        )}

      </ScrollView>

      {/* ── Crop Selection Modal ── */}
      <Modal
        visible={showCropModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCropModal(false)}
        statusBarTranslucent
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowCropModal(false)}
          activeOpacity={1}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select a Crop</Text>
              <TouchableOpacity onPress={() => setShowCropModal(false)} activeOpacity={0.8}>
                <Feather name="x" size={22} color={theme.colors.secondary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={allCrops}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 12 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.cropListItem}
                  onPress={() => handleSelectCrop(item.id)}
                  activeOpacity={0.85}
                >
                  <View style={styles.cropListIcon}>
                    <Text style={{ fontSize: 20 }}>{item.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cropListName}>{item.name}</Text>
                    <Text style={styles.cropListCat}>{item.category}</Text>
                  </View>
                  {item.id === selectedCropId && (
                    <Feather name="check-circle" size={20} color={theme.colors.primary} />
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

// ─── Styles ───────────────────────────────────────────────────────────────────

const CARD_W = (width - 56) / 2; // 2 columns, 20px padding each side + 16px gap

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9F7',
  },

  // Header
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
    gap: 10,
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

  scroll: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  // Compact Crop Selector
  compactCropSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E8F5E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  compactCropIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactCropName: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  compactCropSub: {
    fontSize: 11,
    color: theme.colors.secondary,
    marginTop: 1,
  },
  changeBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  changeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
  },

  // Section title
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: theme.colors.secondary,
  },

  // Stage Grid
  stageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  stageCard: {
    width: CARD_W,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEF2EE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  stageCardDisabled: {
    opacity: 0.4,
  },
  stageIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  stageCardLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.secondary,
    marginBottom: 3,
  },
  stageCardDesc: {
    fontSize: 11,
    color: theme.colors.secondary,
  },
  stageActiveDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Loading
  loadingBox: {
    alignItems: 'center',
    paddingVertical: 36,
    gap: 14,
  },
  loadingText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },

  // Result Header
  resultHeader: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  resultHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultStageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  resultStageBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  resultDuration: {
    fontSize: 12,
    color: '#888',
  },
  resultCropName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.secondary,
    marginBottom: 6,
  },
  resultSummary: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },

  // Tip Section (accordion)
  tipSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F4F0',
    elevation: 1,
  },
  tipSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  tipSectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tipSectionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  tipList: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 10,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    flexShrink: 0,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#444',
    lineHeight: 20,
  },

  // Warning
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
    marginBottom: 12,
    gap: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#F57C00',
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#795548',
    lineHeight: 20,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.secondary,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: theme.colors.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Modal
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
    paddingBottom: 14,
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  cropListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 14,
  },
  cropListIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cropListName: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.secondary,
  },
  cropListCat: {
    fontSize: 12,
    color: theme.colors.secondary,
    marginTop: 1,
  },
});