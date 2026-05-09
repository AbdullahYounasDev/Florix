import CropTimeline from '@/components/ui/FlorixTools/CropTimeline/CropTimeline';
import CultivationTips from '@/components/ui/FlorixTools/CultivationTips/CultivationTips';
import FertilizerCalculator from '@/components/ui/FlorixTools/FertilizerCalc/FertilizerCalculator';
import PestsAndDisease from '@/components/ui/FlorixTools/PestsandDisease/PestsandDisease';
import { theme } from '@/utils/theme';
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const toolsData = [
  {
    id: 'fertilizer',
    title: 'Fertilizer Calculator',
    icon: <MaterialCommunityIcons name="calculator" size={22} color={theme.colors.secondary} />,
  },
  {
    id: 'pests',
    title: 'Pests & Disease',
    icon: <MaterialIcons name="bug-report" size={22} color={theme.colors.secondary} />,
  },
  {
    id: 'tips',
    title: 'Cultivation Tips',
    icon: <Ionicons name="bulb-outline" size={22} color={theme.colors.secondary} />,
  },
];

export default function ToolsSection() {
  const [fertilizerModalVisible, setFertilizerModalVisible] = useState(false);
  const [pestsModalVisible, setPestsModalVisible] = useState(false);
  const [tipsModalVisible, setTipsModalVisible] = useState(false);
  const [timelineModalVisible, setTimelineModalVisible] = useState(false);

  const handlePress = (id: string) => {
    if (id === 'fertilizer') {
      setFertilizerModalVisible(true);
    } else if (id === 'pests') {
      setPestsModalVisible(true);
    } else if (id === 'tips') {
      setTipsModalVisible(true);
    } else if (id === 'timeline') {
      setTimelineModalVisible(true);
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.section}>
        <Text style={styles.sectionTitle}>Tools</Text>

        {/* Featured Crop Timeline */}
        <TouchableOpacity
          style={styles.featuredCard}
          activeOpacity={0.9}
          onPress={() => handlePress('timeline')}
        >
          <View style={styles.featuredBadge}>
            <Ionicons name="star" size={12} color={theme.colors.fourthly} />
            <Text style={styles.featuredBadgeText}>Featured</Text>
          </View>
          <View style={styles.featuredContent}>
            <View style={styles.featuredLeft}>
              <View style={styles.featuredIconContainer}>
                <MaterialCommunityIcons name="timeline-clock-outline" size={28} color={theme.colors.fourthly} />
              </View>
              <View style={styles.featuredTextBlock}>
                <Text style={styles.featuredTitle}>Crop Timeline</Text>
                <Text style={styles.featuredSubtitle}>Complete growing guide from seed to harvest</Text>
              </View>
            </View>
            <Feather name="arrow-right" size={20} color={theme.colors.fourthly} />
          </View>
        </TouchableOpacity>

        {/* Regular Tools Grid */}
        <View style={styles.grid}>
          {toolsData.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              style={styles.toolCard}
              activeOpacity={0.85}
              onPress={() => handlePress(tool.id)}
            >
              <View style={styles.toolHeader}>
                <View style={styles.iconContainer}>{tool.icon}</View>
                <Feather name="arrow-right" size={16} color={theme.colors.secondary} />
              </View>
              <Text style={styles.toolTitle}>{tool.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Fertilizer Calculator Modal */}
      <Modal
        visible={fertilizerModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setFertilizerModalVisible(false)}
        statusBarTranslucent
      >
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <FertilizerCalculator onClose={() => setFertilizerModalVisible(false)} />
        </SafeAreaView>
      </Modal>

      {/* Pests & Disease Modal */}
      <Modal
        visible={pestsModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setPestsModalVisible(false)}
        statusBarTranslucent
      >
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <PestsAndDisease onClose={() => setPestsModalVisible(false)} />
        </SafeAreaView>
      </Modal>

      {/* Cultivation Tips Modal */}
      <Modal
        visible={tipsModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setTipsModalVisible(false)}
        statusBarTranslucent
      >
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <CultivationTips onClose={() => setTipsModalVisible(false)} />
        </SafeAreaView>
      </Modal>

      {/* Crop Timeline Modal */}
      <Modal
        visible={timelineModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setTimelineModalVisible(false)}
        statusBarTranslucent
      >
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <CropTimeline onClose={() => setTimelineModalVisible(false)} />
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 10
    
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.secondary,
    marginBottom: 15,
  },

  // Featured Card
  featuredCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 14,
  },
  featuredBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.fourthly,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  featuredContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featuredLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  featuredIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredTextBlock: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.fourthly,
    marginBottom: 3,
  },
  featuredSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.fourthly,
  },

  // Regular Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  toolCard: {
    width: '48%',
    backgroundColor: theme.colors.fourthly,
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: theme.colors.tertiary,
  },
  toolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.secondary,
  },
});