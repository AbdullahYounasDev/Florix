import CultivationTips from '@/components/ui/FlorixTools/CultivationTips/CultivationTips';
import FertilizerCalculator from '@/components/ui/FlorixTools/FertilizerCalc/FertilizerCalculator';
import PestsAndDisease from '@/components/ui/FlorixTools/PestsandDisease/PestsandDisease';
import { theme } from '@/utils/theme';
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView, StatusBar, StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const toolsData = [
  {
    id: 'fertilizer',
    title: 'Fertilizer Calculator',
    icon: <MaterialCommunityIcons name="calculator" size={24} color={theme.colors.secondary} />,
  },
  {
    id: 'pests',
    title: 'Pests & Disease',
    icon: <MaterialIcons name="bug-report" size={24} color={theme.colors.secondary} />,
  },
  {
    id: 'tips',
    title: 'Cultivation Tips',
    icon: <Ionicons name="bulb-outline" size={24} color={theme.colors.secondary} />,
  },
  // {
  //   id: 'alert',
  //   title: 'Disease Alert',
  //   icon: <Ionicons name="notifications-outline" size={24} color={theme.colors.secondary} />,
  // },
];

export default function ToolsSection() {
  const [fertilizerModalVisible, setFertilizerModalVisible] = useState(false);
  const [pestsModalVisible, setPestsModalVisible] = useState(false);
  const [tipsModalVisible, setTipsModalVisible] = useState(false);
  const [alertModalVisible, setAlertModalVisible] = useState(false);

  const handlePress = (id: string) => {
    if (id === 'fertilizer') {
      setFertilizerModalVisible(true);
    } else if (id === 'pests') {
      setPestsModalVisible(true);
    } else if (id === 'tips') {
      setTipsModalVisible(true);
    } else if (id === 'alert') {
      setAlertModalVisible(true);
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.section}>
        <Text style={styles.sectionTitle}>Tools</Text>
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
                <Feather name="arrow-right" size={18} color={theme.colors.secondary} />
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

      {/* Disease Alert Modal */}
      {/* <Modal
        visible={alertModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setAlertModalVisible(false)}
        statusBarTranslucent
      >
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <DiseaseAlert onClose={() => setAlertModalVisible(false)} />
        </SafeAreaView>
      </Modal> */}
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.secondary,
    marginBottom: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  toolCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  toolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.secondary,
  },
});