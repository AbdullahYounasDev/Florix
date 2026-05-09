// components/ui/FlorixTools/CropTimeline/CropTimeline.tsx
import { plantCategories } from '@/utils/plantCategories';
import { theme } from '@/utils/theme';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CropSelector from '../../Useable/CropSelector';

const taskColors: Record<string, string> = {
  action: theme.colors.primary,
  fertilizer: '#B8860B',
  water: theme.colors.primary,
  pest: '#C0392B',
  disease: '#8E44AD',
  warning: '#D35400',
  harvest: '#6D4C41',
};

const difficultyConfig: Record<string, { color: string; label: string }> = {
  easy: { color: theme.colors.primary, label: 'Beginner Friendly' },
  moderate: { color: '#B8860B', label: 'Intermediate' },
  hard: { color: '#C0392B', label: 'Advanced' },
};

interface TimelineData {
  cropName: string;
  totalDuration: string;
  climate: string;
  soilType: string;
  difficulty: string;
  stages: Array<{
    id: string;
    stage: string;
    days: string;
    phase: string;
    tasks: Array<{
      id: string;
      text: string;
      type: string;
    }>;
    tips: string;
  }>;
}

interface Props {
  onClose?: () => void;
}

export default function CropTimeline({ onClose }: Props) {
  const [selectedCrop, setSelectedCrop] = useState<any>(null);
  const [timelineData, setTimelineData] = useState<TimelineData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedStages, setExpandedStages] = useState<string[]>([]);

  const allCrops = plantCategories.flatMap((cat: any) =>
    cat.crops.map((crop: any) => ({
      id: crop.id,
      name: crop.name,
      icon: crop.icon,
      category: cat.region,
    }))
  );

  const handleClose = () => {
    setSelectedCrop(null);
    setTimelineData(null);
    setError(null);
    setExpandedStages([]);
    if (onClose) onClose();
  };

  const parseAIResponse = (rawData: string): TimelineData | null => {
    try {
      const cleanJson = rawData.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleanJson);
    } catch {
      return null;
    }
  };

  const fetchTimeline = async (cropName: string) => {
    setLoading(true);
    setError(null);
    setTimelineData(null);

    try {
      const response = await fetch('https://florix-backend.vercel.app/api/v1/ai/getCropsTimeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plant: cropName }),
      });

      const result = await response.json();

      if (!result.success || !result.data) {
        setError('Could not generate timeline. Please try again.');
        return;
      }

      const parsed = parseAIResponse(result.data);

      if (!parsed || !parsed.stages || parsed.stages.length === 0) {
        setError('Invalid timeline data. Please try another crop.');
        return;
      }

      setTimelineData(parsed);
      setExpandedStages([parsed.stages[0].id]);
    } catch {
      setError('Network error. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCropSelect = (crop: any) => {
    setSelectedCrop(crop);
    fetchTimeline(crop.name);
  };

  const toggleStage = (stageId: string) => {
    setExpandedStages(prev =>
      prev.includes(stageId) ? prev.filter(id => id !== stageId) : [...prev, stageId]
    );
  };

  const difficulty = timelineData ? difficultyConfig[timelineData.difficulty] || difficultyConfig.moderate : null;
  const showInitialState = !timelineData && !loading && !error;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Crop Timeline</Text>
        {onClose && (
          <TouchableOpacity onPress={handleClose} activeOpacity={0.85}>
            <Feather name="x" size={22} color={theme.colors.secondary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Crop Selector - Always visible at top */}
        <View style={styles.selectionCard}>
          <CropSelector
            crops={allCrops}
            selectedCrop={selectedCrop}
            onSelectCrop={handleCropSelect}
            placeholder="Choose a crop"
            label="Select Crop"
          />
        </View>

        {/* Initial State - Before Selection */}
        {showInitialState && (
          <View style={styles.initialContainer}>
            <View style={styles.initialIconCircle}>
              <MaterialCommunityIcons name="timeline-clock-outline" size={40} color={theme.colors.primary} />
            </View>
            <Text style={styles.initialTitle}>Plan Your Harvest</Text>
            <Text style={styles.initialSubtext}>
              Select a crop above to get a complete day-by-day growing timeline with actionable tasks for every stage
            </Text>

            <View style={styles.benefitsRow}>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIconBox}>
                  <Ionicons name="checkmark-circle" size={18} color={theme.colors.primary} />
                </View>
                <Text style={styles.benefitText}>Stage-by-stage guidance</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIconBox}>
                  <Ionicons name="checkmark-circle" size={18} color={theme.colors.primary} />
                </View>
                <Text style={styles.benefitText}>Fertilizer & water schedule</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIconBox}>
                  <Ionicons name="checkmark-circle" size={18} color={theme.colors.primary} />
                </View>
                <Text style={styles.benefitText}>Pest & disease alerts</Text>
              </View>
            </View>
          </View>
        )}

        {/* Loading */}
        {loading && (
          <View style={styles.stateCard}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.stateTitle}>Generating timeline...</Text>
            <Text style={styles.stateSubtext}>Crafting guidance for {selectedCrop?.name}</Text>
          </View>
        )}

        {/* Error */}
        {error && !loading && (
          <View style={styles.stateCard}>
            <Ionicons name="alert-circle-outline" size={44} color="#C0392B" />
            <Text style={styles.stateTitle}>Something went wrong</Text>
            <Text style={styles.stateSubtext}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => selectedCrop && fetchTimeline(selectedCrop.name)}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Timeline Content */}
        {timelineData && !loading && (
          <>
            <View style={styles.overviewCard}>
              <Text style={styles.overviewCropName}>{timelineData.cropName}</Text>
              <Text style={styles.overviewDuration}>{timelineData.totalDuration}</Text>

              {difficulty && (
                <View style={styles.difficultyRow}>
                  <View style={[styles.difficultyDot, { backgroundColor: difficulty.color }]} />
                  <Text style={[styles.difficultyText, { color: difficulty.color }]}>
                    {difficulty.label}
                  </Text>
                  <Text style={styles.stageCountText}>· {timelineData.stages.length} stages</Text>
                </View>
              )}

              <View style={styles.infoSection}>
                <View style={styles.infoBlock}>
                  <Text style={styles.infoLabel}>Climate</Text>
                  <Text style={styles.infoValue}>{timelineData.climate}</Text>
                </View>
                <View style={styles.infoBlock}>
                  <Text style={styles.infoLabel}>Soil</Text>
                  <Text style={styles.infoValue}>{timelineData.soilType}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Growth Stages</Text>

            <View style={styles.timelineContainer}>
              {timelineData.stages.map((stage, index) => {
                const isExpanded = expandedStages.includes(stage.id);
                const isLast = index === timelineData.stages.length - 1;
                const stageNumber = index + 1;

                return (
                  <View key={stage.id} style={styles.stageWrapper}>
                    <View style={styles.timelineNode}>
                      <View style={[styles.nodeCircle, isExpanded && styles.nodeCircleActive]}>
                        <Text style={[styles.nodeNumber, isExpanded && styles.nodeNumberActive]}>
                          {stageNumber}
                        </Text>
                      </View>
                      {!isLast && <View style={styles.nodeLine} />}
                    </View>

                    <View style={styles.stageContent}>
                      <TouchableOpacity
                        style={[styles.stageHeader, isExpanded && styles.stageHeaderActive]}
                        onPress={() => toggleStage(stage.id)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.stageHeaderLeft}>
                          <Text style={styles.stageName}>{stage.stage}</Text>
                          <View style={styles.daysBadge}>
                            <Text style={styles.daysText}>{stage.days}</Text>
                          </View>
                        </View>
                        <Ionicons
                          name={isExpanded ? 'chevron-up' : 'chevron-down'}
                          size={20}
                          color={theme.colors.secondary}
                        />
                      </TouchableOpacity>

                      {isExpanded && (
                        <View style={styles.tasksContainer}>
                          {stage.tasks.map((task) => {
                            const dotColor = taskColors[task.type] || theme.colors.primary;
                            return (
                              <View key={task.id} style={styles.taskItem}>
                                <View style={[styles.taskDot, { backgroundColor: dotColor }]} />
                                <View style={styles.taskTextContainer}>
                                  <Text style={styles.taskText}>{task.text}</Text>
                                </View>
                              </View>
                            );
                          })}

                          {stage.tips && (
                            <View style={styles.tipsBox}>
                              <Ionicons name="bulb-outline" size={15} color="#B8860B" />
                              <Text style={styles.tipsText}>{stage.tips}</Text>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={{ height: 40 }} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.fourthly,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.tertiary,
    backgroundColor: theme.colors.fourthly,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Initial State
  initialContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  initialIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  initialTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.secondary,
    marginBottom: 8,
  },
  initialSubtext: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.secondary,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  benefitsRow: {
    width: '100%',
    backgroundColor: theme.colors.tertiary,
    borderRadius: 16,
    padding: 18,
    gap: 12,
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.fourthly,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.secondary,
  },

  // Selection Card
  selectionCard: {
    backgroundColor: theme.colors.fourthly,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.tertiary,
    width: '100%',
  },

  // State Cards
  stateCard: {
    backgroundColor: theme.colors.fourthly,
    borderRadius: 16,
    padding: 40,
    marginTop: 16,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: theme.colors.tertiary,
  },
  stateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.secondary,
  },
  stateSubtext: {
    fontSize: 13,
    color: theme.colors.secondary,
    opacity: 0.7,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 4,
  },
  retryButtonText: {
    color: theme.colors.fourthly,
    fontSize: 14,
    fontWeight: '600',
  },

  // Overview Card
  overviewCard: {
    marginTop: 20,
    backgroundColor: theme.colors.tertiary,
    borderRadius: 20,
    padding: 24,
  },
  overviewCropName: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.secondary,
    marginBottom: 4,
  },
  overviewDuration: {
    fontSize: 14,
    color: theme.colors.secondary,
    opacity: 0.7,
    marginBottom: 14,
  },
  difficultyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 13,
    fontWeight: '600',
  },
  stageCountText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.secondary,
    opacity: 0.6,
  },
  infoSection: {
    gap: 14,
  },
  infoBlock: {
    gap: 4,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    opacity: 0.5,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.secondary,
    lineHeight: 21,
  },

  // Section Title
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.secondary,
    marginTop: 28,
    marginBottom: 16,
  },

  // Timeline
  timelineContainer: {
    paddingLeft: 2,
  },
  stageWrapper: {
    flexDirection: 'row',
    minHeight: 50,
  },
  timelineNode: {
    width: 34,
    alignItems: 'center',
    marginRight: 10,
  },
  nodeCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  nodeCircleActive: {
    backgroundColor: theme.colors.primary,
  },
  nodeNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  nodeNumberActive: {
    color: theme.colors.fourthly,
  },
  nodeLine: {
    width: 2,
    flex: 1,
    backgroundColor: theme.colors.tertiary,
    marginTop: -2,
    marginBottom: -2,
  },

  // Stage Content
  stageContent: {
    flex: 1,
    paddingBottom: 24,
  },
  stageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.tertiary,
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },
  stageHeaderActive: {
    backgroundColor: theme.colors.tertiary,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  stageHeaderLeft: {
    flex: 1,
    gap: 8,
  },
  stageName: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.secondary,
  },
  daysBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: theme.colors.fourthly,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  daysText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
  },

  // Tasks
  tasksContainer: {
    backgroundColor: theme.colors.tertiary,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    paddingHorizontal: 16,
    paddingBottom: 18,
    gap: 14,
  },
  taskItem: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 14,
  },
  taskDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  taskTextContainer: {
    flex: 1,
  },
  taskText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.secondary,
    lineHeight: 21,
  },
  tipsBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: theme.colors.fourthly,
    padding: 14,
    borderRadius: 12,
    marginTop: 2,
  },
  tipsText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#B8860B',
    lineHeight: 19,
    fontStyle: 'italic',
  },
});