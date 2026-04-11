import AppHeader from '@/components/ui/header';
import { theme } from '@/utils/theme';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';


export default function ProfileScreen() {
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);

  const shareApp = async () => {
    try {
      const shareMessage = `🌱 Discover Florix - Your Smart Farming Assistant! 🚜\n\nJoin me in using Florix to get:\n• Plant disease detection\n• AI farming advice\n• Weather updates\n• Market prices\n\nDownload now: https://play.google.com/store/apps/details?id=com.florix.app`;

      const shareOptions = {
        message: shareMessage,
        title: 'Share Florix App',
        url: 'https://play.google.com/store/apps/details?id=com.florix.app',
      };

      const result = await Share.share(shareOptions);

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with', result.activityType);
        } else {
          console.log('Shared');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share app');
    }
  };

  const shareToWhatsApp = async () => {
    try {
      const message = `🌱 Discover Florix - Your Smart Farming Assistant! 🚜\n\nJoin me in using Florix to get:\n• Plant disease detection\n• AI farming advice\n• Weather updates\n• Market prices\n\nDownload now: https://play.google.com/store/apps/details?id=com.florix.app`;

      const url = `whatsapp://send?text=${encodeURIComponent(message)}`;

      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        await Share.share({
          message: message,
          title: 'Share Florix on WhatsApp',
        });
      }
    } catch (error) {
      Alert.alert('Error', 'WhatsApp is not installed or failed to open');
    }
  };


  const submitFeedback = () => {
    if (feedback.trim() === '') {
      Alert.alert('Error', 'Please enter your feedback');
      return;
    }

    console.log('Feedback submitted:', { feedback, rating });
    Alert.alert('Thank You!', 'Your feedback has been submitted successfully.');
    setFeedback('');
    setRating(0);
    setFeedbackModalVisible(false);
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.starButton}
          >
            <Ionicons
              name={star <= rating ? "star" : "star-outline"}
              size={28}
              color={star <= rating ? "#FFA500" : theme.colors.secondary}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title='Profile' page='profile' />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Under Construction Section */}
        <View style={styles.section}>
          <View style={styles.constructionContainer}>
            <View style={styles.constructionIconContainer}>
              <Ionicons name="construct-outline" size={48} color={theme.colors.primary} />
            </View>
            <Text style={styles.constructionTitle}>Profile Tab Under Construction</Text>
            <Text style={styles.constructionDescription}>
              We're working hard to bring you a personalized profile experience. 
              Stay tuned for exciting features coming soon!
            </Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
              <Text style={styles.progressText}>Coming Soon</Text>
            </View>
          </View>
        </View>

        {/* Share App Section */}
        <View style={styles.section}>
          <View style={styles.shareContainer}>
            <View style={styles.shareIconContainer}>
              <Ionicons name="share-social" size={32} color={theme.colors.fourthly} />
            </View>
            <View style={styles.shareContent}>
              <Text style={styles.shareTitle}>Share the Green Revolution!</Text>
              <Text style={styles.shareDescription}>
                Help other farmers discover Florix and transform their farming experience
              </Text>
            </View>
            <View style={styles.quickShareContainer}>
              <Text style={styles.quickShareTitle}>Share via</Text>
              <View style={styles.quickShareButtons}>
                <TouchableOpacity style={styles.quickShareButton} onPress={shareToWhatsApp}>
                  <FontAwesome name="whatsapp" size={24} color="#25D366" />
                  <Text style={styles.quickShareText}>WhatsApp</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickShareButton} onPress={shareApp}>
                  <Ionicons name="share-outline" size={24} color={theme.colors.primary} />
                  <Text style={styles.quickShareText}>More</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Feedback Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>We Value Your Feedback</Text>
          <Text style={styles.feedbackDescription}>
            Your suggestions help us improve Florix and serve you better
          </Text>

          <TouchableOpacity
            style={styles.feedbackButton}
            onPress={() => setFeedbackModalVisible(true)}
          >
            <View style={styles.feedbackButtonContent}>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color={theme.colors.primary} />
              <View style={styles.feedbackButtonText}>
                <Text style={styles.feedbackButtonTitle}>Share Your Thoughts</Text>
                <Text style={styles.feedbackButtonSubtitle}>Help us improve your experience</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.secondary} />
          </TouchableOpacity>
        </View>

        {/* Feedback Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={feedbackModalVisible}
          onRequestClose={() => setFeedbackModalVisible(false)}
          statusBarTranslucent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Share Feedback</Text>
                <TouchableOpacity
                  onPress={() => setFeedbackModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color={theme.colors.secondary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.ratingLabel}>How would you rate your experience?</Text>
              {renderStars()}

              <Text style={styles.feedbackLabel}>Your Feedback</Text>
              <TextInput
                style={styles.feedbackInput}
                value={feedback}
                onChangeText={setFeedback}
                placeholder="Tell us what you think about Florix..."
                placeholderTextColor={theme.colors.secondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setFeedbackModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    feedback.trim() === '' && styles.submitButtonDisabled
                  ]}
                  onPress={submitFeedback}
                  disabled={feedback.trim() === ''}
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.tertiary,
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    backgroundColor: theme.colors.fourthly,
    paddingHorizontal: 20,
    paddingVertical: 24,
    // marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.secondary,
    marginBottom: 15,
  },
  // Construction Section Styles
  constructionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  constructionIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${theme.colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  constructionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.secondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  constructionDescription: {
    fontSize: 14,
    color: theme.colors.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 20,
    opacity: 0.8,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '80%',
    height: 6,
    backgroundColor: `${theme.colors.primary}20`,
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    width: '60%',
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  // Share Section Styles
  shareContainer: {
    backgroundColor: `${theme.colors.primary}10`,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  shareIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  shareContent: {
    alignItems: 'center',
    marginBottom: 24,
  },
  shareTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.secondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  shareDescription: {
    fontSize: 14,
    color: theme.colors.secondary,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.8,
  },
  quickShareContainer: {
    width: '100%',
  },
  quickShareTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.secondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  quickShareButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
  },
  quickShareButton: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: theme.colors.fourthly,
    flex: 1,
    shadowColor: theme.colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickShareText: {
    fontSize: 13,
    color: theme.colors.secondary,
    marginTop: 8,
    fontWeight: '500',
  },
  // Feedback Section Styles
  feedbackDescription: {
    fontSize: 14,
    color: theme.colors.secondary,
    marginBottom: 20,
    lineHeight: 20,
    opacity: 0.8,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.tertiary,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}20`,
  },
  feedbackButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  feedbackButtonText: {
    marginLeft: 12,
    flex: 1,
  },
  feedbackButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.secondary,
    marginBottom: 4,
  },
  feedbackButtonSubtitle: {
    fontSize: 13,
    color: theme.colors.secondary,
    opacity: 0.7,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: theme.colors.fourthly,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  closeButton: {
    padding: 4,
  },
  ratingLabel: {
    fontSize: 16,
    color: theme.colors.secondary,
    marginBottom: 16,
    fontWeight: '500',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
  feedbackLabel: {
    fontSize: 16,
    color: theme.colors.secondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: `${theme.colors.primary}30`,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: theme.colors.secondary,
    minHeight: 120,
    marginBottom: 24,
    backgroundColor: theme.colors.tertiary,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: theme.colors.tertiary,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: theme.colors.secondary,
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: theme.colors.secondary,
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    fontSize: 16,
    color: theme.colors.fourthly,
    fontWeight: '600',
  },
});