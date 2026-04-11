// components/ui/ReviewButton.tsx
import { theme } from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

export const ReviewButton: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (feedback.trim() === '') {
      Alert.alert('Oops!', 'Please share your thoughts with us');
      return;
    }

    Keyboard.dismiss();
    console.log('Review submitted:', { rating, feedback });

    Alert.alert(
      'Thank You! 🌱',
      'Your feedback helps us grow and improve Florix for everyone.'
    );

    setRating(0);
    setFeedback('');
    setModalVisible(false);
  };

  const handleClose = () => {
    Keyboard.dismiss();
    setRating(0);
    setFeedback('');
    setModalVisible(false);
  };

  return (
    <>
      {/* Sticky Feedback Button - Bottom Right */}
      <View style={styles.stickyContainer}>
        <TouchableOpacity
          style={styles.reviewButton}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="star-outline" size={18} color={theme.colors.fourthly} />
          <Text style={styles.reviewButtonText}>Share Your Thoughts</Text>
        </TouchableOpacity>
      </View>

      {/* Review Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleClose}
        statusBarTranslucent={true}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.modalContainer}
            >
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  {/* Header */}
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Share Your Feedback</Text>
                    <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                      <Ionicons name="close" size={22} color={theme.colors.secondary} />
                    </TouchableOpacity>
                  </View>

                  {/* Rating Section */}
                  <View style={styles.ratingSection}>
                    <Text style={styles.ratingLabel}>How's your experience?</Text>
                    <View style={styles.starsContainer}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity
                          key={star}
                          onPress={() => setRating(star)}
                        >
                          <Ionicons
                            name={star <= rating ? "star" : "star-outline"}
                            size={36}
                            color={star <= rating ? "#FFB800" : `${theme.colors.secondary}60`}
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Feedback Input */}
                  <View style={styles.feedbackSection}>
                    <Text style={styles.feedbackLabel}>Tell us what you think</Text>
                    <TextInput
                      style={styles.feedbackInput}
                      value={feedback}
                      onChangeText={setFeedback}
                      placeholder="Share your thoughts, suggestions, or report an issue..."
                      placeholderTextColor={`${theme.colors.secondary}80`}
                      multiline
                      numberOfLines={5}
                      textAlignVertical="top"
                      returnKeyType="done"
                      blurOnSubmit={true}
                    />
                  </View>

                  {/* Submit Button */}
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      feedback.trim() === '' && styles.submitButtonDisabled
                    ]}
                    onPress={handleSubmit}
                    disabled={feedback.trim() === ''}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.submitButtonText}>Submit Feedback</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  stickyContainer: {
    position: 'absolute',
    bottom: 10, // Adjust based on your tab bar height
    right: 16,
    zIndex: 999,
  },
  reviewButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: theme.colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  reviewButtonText: {
    color: theme.colors.fourthly,
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: theme.colors.fourthly,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.secondary,
  },
  closeButton: {
    padding: 4,
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.secondary,
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  feedbackSection: {
    marginBottom: 24,
  },
  feedbackLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.secondary,
    marginBottom: 10,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: `${theme.colors.primary}40`,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: theme.colors.secondary,
    minHeight: 120,
    backgroundColor: theme.colors.tertiary,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: `${theme.colors.secondary}40`,
  },
  submitButtonText: {
    color: theme.colors.fourthly,
    fontSize: 15,
    fontWeight: '600',
  },
});