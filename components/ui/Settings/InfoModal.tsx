// components/ui/Settings/InfoModal.tsx
import { theme } from '@/utils/theme';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    Linking,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
  type: 'permissions' | 'support' | 'about';
}

export default function InfoModal({ visible, onClose, type }: InfoModalProps) {
  
  const handleEmailPress = () => {
    Linking.openURL('mailto:contact.abdullahyounas@gmail.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+923405216542');
  };

  const renderContent = () => {
    switch (type) {
      case 'permissions':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.subHeading}>
              We only request permissions essential for app functionality
            </Text>

            {/* Location Permission */}
            <View style={styles.permissionCard}>
              <View style={styles.permissionIconBox}>
                <Ionicons name="location" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.permissionInfo}>
                <Text style={styles.permissionTitle}>Location</Text>
                <Text style={styles.permissionDesc}>
                  Used to provide local weather forecasts, farming recommendations, and accurate crop timeline data based on your region.
                </Text>
              </View>
            </View>

            {/* Image Permission */}
            <View style={styles.permissionCard}>
              <View style={styles.permissionIconBox}>
                <Ionicons name="images" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.permissionInfo}>
                <Text style={styles.permissionTitle}>Photo Library & Camera</Text>
                <Text style={styles.permissionDesc}>
                  Used for AI-powered plant disease analysis. Upload or capture images of your crops to identify pests, diseases, and get treatment recommendations.
                </Text>
              </View>
            </View>

            {/* Privacy Note */}
            <View style={styles.privacyNote}>
              <Ionicons name="shield-checkmark" size={20} color={theme.colors.primary} />
              <Text style={styles.privacyNoteText}>
                Your data stays on your device. We only use permissions when you actively use the feature.
              </Text>
            </View>
          </View>
        );

      case 'support':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.subHeading}>
              We're here to help! Reach out to us anytime
            </Text>

            {/* Email Contact */}
            <TouchableOpacity style={styles.contactCard} onPress={handleEmailPress} activeOpacity={0.8}>
              <View style={styles.contactIconBox}>
                <MaterialCommunityIcons name="email-outline" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email Us</Text>
                <Text style={styles.contactValue}>contact.abdullahyounas@gmail.com</Text>
                <Text style={styles.contactHint}>Tap to open email client</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.secondary} />
            </TouchableOpacity>

            {/* Phone Contact */}
            <TouchableOpacity style={styles.contactCard} onPress={handlePhonePress} activeOpacity={0.8}>
              <View style={styles.contactIconBox}>
                <Ionicons name="call-outline" size={28} color={theme.colors.primary} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Call Us</Text>
                <Text style={styles.contactValue}>+92 340 5216542</Text>
                <Text style={styles.contactHint}>Tap to call directly</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.secondary} />
            </TouchableOpacity>

            {/* Response Time */}
            <View style={styles.responseCard}>
              <Ionicons name="time-outline" size={20} color={theme.colors.secondary} />
              <Text style={styles.responseText}>
                We typically respond within 24 hours during business days.
              </Text>
            </View>
          </View>
        );

      case 'about':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.subHeading}>
              Your smart farming companion powered by AI
            </Text>

            {/* App Description */}
            <View style={styles.aboutCard}>
              <Text style={styles.aboutDescription}>
                Florix helps farmers make data-driven decisions with AI-powered tools. From weather forecasts to crop disease detection, we provide everything you need for successful farming.
              </Text>
            </View>

            {/* Features List */}
            <Text style={styles.sectionTitle}>What Florix Offers</Text>
            
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <View style={styles.featureIconBox}>
                  <Ionicons name="partly-sunny" size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>Weather Intelligence</Text>
                  <Text style={styles.featureDesc}>Real-time weather data and farming-specific forecasts for your exact location</Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIconBox}>
                  <Ionicons name="scan-circle" size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>AI Image Analysis</Text>
                  <Text style={styles.featureDesc}>Detect crop diseases and pests instantly by uploading plant photos</Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIconBox}>
                  <Ionicons name="timer" size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>Crop Timeline</Text>
                  <Text style={styles.featureDesc}>Day-by-day growing schedule with stage-specific tasks and reminders</Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIconBox}>
                  <MaterialCommunityIcons name="calculator" size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>Fertilizer Calculator</Text>
                  <Text style={styles.featureDesc}>Calculate exact fertilizer amounts based on crop type and field size</Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIconBox}>
                  <Ionicons name="leaf" size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>Cultivation Tips</Text>
                  <Text style={styles.featureDesc}>Expert guidance for every growth stage from planting to harvest</Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIconBox}>
                  <Ionicons name="bug" size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>Pests & Disease Info</Text>
                  <Text style={styles.featureDesc}>Comprehensive database of crop diseases and pest management solutions</Text>
                </View>
              </View>
            </View>
          </View>
        );
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'permissions': return 'Permissions';
      case 'support': return 'Support / Contact';
      case 'about': return 'About Florix';
    }
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
          <Text style={styles.headerTitle}>{getTitle()}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.85}>
            <Feather name="x" size={24} color={theme.colors.secondary} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {renderContent()}
          <View style={{ height: 40 }} />
        </ScrollView>
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
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
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
  scrollContent: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    gap: 20,
    marginBottom:40,
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.secondary,
    lineHeight: 32,
  },
  subHeading: {
    fontSize: 14,
    color: theme.colors.secondary,
    opacity: 0.6,
    lineHeight: 21,
    marginTop: -12,
  },

  // Permissions Styles
  permissionCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.tertiary,
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  permissionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.fourthly,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionInfo: {
    flex: 1,
    gap: 6,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.secondary,
  },
  permissionDesc: {
    fontSize: 13,
    color: theme.colors.secondary,
    opacity: 0.7,
    lineHeight: 19,
  },
  permissionBadge: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  permissionBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  privacyNote: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 14,
    gap: 10,
    alignItems: 'center',
  },
  privacyNoteText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.secondary,
    lineHeight: 19,
    fontWeight: '500',
  },

  // Contact Styles
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.tertiary,
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  contactIconBox: {
    width: 48,
    height: 48,
    borderRadius: 26,
    backgroundColor: theme.colors.fourthly,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
    gap: 3,
  },
  contactLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.secondary,
    opacity: 0.5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contactValue: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.secondary,
  },
  contactHint: {
    fontSize: 11,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  responseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.tertiary,
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  responseText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.secondary,
    opacity: 0.7,
    lineHeight: 19,
  },

  // About Styles
  aboutCard: {
    backgroundColor: theme.colors.tertiary,
    borderRadius: 16,
    padding: 18,
  },
  aboutDescription: {
    fontSize: 14,
    color: theme.colors.secondary,
    lineHeight: 22,
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.secondary,
    marginTop: 4,
  },
  featuresList: {
    gap: 14,
  },
  featureItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.tertiary,
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  featureIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.fourthly,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureInfo: {
    flex: 1,
    gap: 4,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.secondary,
  },
  featureDesc: {
    fontSize: 13,
    color: theme.colors.secondary,
    opacity: 0.6,
    lineHeight: 19,
  },
});