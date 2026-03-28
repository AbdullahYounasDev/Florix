// components/Reusable/DiagnosisModal.tsx
import { theme } from '@/utils/theme';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    Modal,
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
  ModalHeading: string
}

export default function DiagnosisModal({
  visible,
  onClose,
  cropName,
  diseaseType,
  country,
  ModalHeading
}: DiagnosisModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
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
          {/* Crop Info */}
          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <MaterialCommunityIcons name="leaf" size={28} color={theme.colors.primary} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Selected Crop</Text>
              <Text style={styles.infoValue}>{cropName}</Text>
            </View>
          </View>

          {/* Disease Category Info */}
          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <MaterialCommunityIcons name="bug" size={28} color={theme.colors.primary} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Pest/Disease Category</Text>
              <Text style={styles.infoValue}>{diseaseType}</Text>
            </View>
          </View>

          {/* Country Info */}
          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <MaterialCommunityIcons name="map-marker" size={28} color={theme.colors.primary} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{country || 'International'}</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
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
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.tertiary,
    backgroundColor: '#FFFFFF',
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
  infoCard: {
    flexDirection: 'row',
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
  infoIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: theme.colors.secondary,
    opacity: 0.7,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.secondary,
  },
});