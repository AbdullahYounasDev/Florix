// components/Reusable/DiagnosisModal.tsx
import { formatAnalysisResponse } from '@/utils/formattedAiResonse';
import { theme } from '@/utils/theme';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface DiagnosisModalProps {
  visible: boolean;
  onClose: () => void;
  cropName: string;
  diseaseType: string;
  country: string;
  city: string;
  ModalHeading: string;
  ModalParent: string;
}

interface TipsData {
  success: boolean;
  data: string;
  cached?: boolean;
}

export default function DiagnosisModal({
  visible,
  onClose,
  cropName,
  diseaseType,
  country,
  city,
  ModalHeading,
  ModalParent
}: DiagnosisModalProps) {
  const [loading, setLoading] = useState(false);
  const [tipsData, setTipsData] = useState<TipsData | null>(null);

  useEffect(() => {
    if (visible) {
      if (ModalParent === 'CultivationTips') {
        fetchCultivationTips();
      } else if (ModalParent === 'PestsAndDisease') {
        fetchPestsAndDisease();
      }
    }
  }, [visible, ModalParent]);

  const fetchCultivationTips = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://florix-backend.vercel.app/api/v1/tools/getCultivationTips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country: country || 'International',
          city: city || 'International',
          plant: cropName,
          UserSelectedTip: diseaseType
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setTipsData(data);
      } else {
        Alert.alert('Error', 'Failed to fetch cultivation tips');
      }
    } catch (error) {
      console.error('Error fetching tips:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPestsAndDisease = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://florix-backend.vercel.app/api/v1/tools/getPestsAndDiseases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country: country || 'International',
          plant: cropName,
          city: city || 'International',
          UserSelectedDisease: diseaseType
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setTipsData(data);
      } else {
        Alert.alert('Error', 'Failed to fetch pests and disease information');
      }
    } catch (error) {
      console.error('Error fetching pests and disease:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>
            {ModalParent === 'CultivationTips' ? 'Fetching cultivation tips...' : 'Fetching pest and disease information...'}
          </Text>
        </View>
      );
    }

    if (!tipsData?.data) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="leaf-off" size={64} color={theme.colors.tertiary} />
          <Text style={styles.emptyText}>
            {ModalParent === 'CultivationTips' ? 'No tips available' : 'No information available'}
          </Text>
        </View>
      );
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {formatAnalysisResponse(tipsData.data)}
      </ScrollView>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.fourthly} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{ModalHeading}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.85}>
            <Feather name="x" size={24} color={theme.colors.secondary} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Main Heading */}
          <Text style={styles.mainHeading}>
            {ModalParent === 'CultivationTips' 
              ? `${diseaseType} stage of ${cropName}`
              : `${diseaseType} in ${cropName}`}
          </Text>
          
          {/* Subtitle */}
          <Text style={styles.subHeading}>
            {`${city}, ${country}`}
          </Text>

          {/* Tips Content */}
          {renderContent()}
        </View>
      </View>
    </Modal>
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
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.tertiary,
    backgroundColor: theme.colors.fourthly,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.secondary,
    marginBottom: 8,
    lineHeight: 32,
  },
  subHeading: {
    fontSize: 16,
    color: theme.colors.primary,
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.tertiary,
  },
  sectionCard: {
    backgroundColor: theme.colors.fourthly,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.tertiary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.secondary,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    color: theme.colors.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 8,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginTop: 6,
    marginRight: 12,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.secondary,
    lineHeight: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: theme.colors.secondary,
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: theme.colors.secondary,
    opacity: 0.5,
  },
});