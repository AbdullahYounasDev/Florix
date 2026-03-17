import AppHeader from '@/components/ui/header';
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

  // Mock user data - will come from backend
  const userData = {
    name: 'Ali Farmer',
    email: 'ali.farmer@example.com',
    mobile: '+92 300 1234567',
    address: '123 Farm Street, Agricultural Zone, Lahore, Pakistan',
    joinDate: 'January 2024',
  };

  const shareApp = async () => {
    try {
      const shareMessage = `🌱 Discover Florix - Your Smart Farming Assistant! 🚜\n\nJoin me in using Florix to get:\n• Plant disease detection\n• AI farming advice\n• Weather updates\n• Market prices\n\nDownload now: https://play.google.com/store/apps/details?id=com.florix.app`;

      const shareOptions = {
        message: shareMessage,
        title: 'Share Florix App',
        url: 'https://play.google.com/store/apps/details?id=com.florix.app', // For iOS
      };

      const result = await Share.share(shareOptions);
      
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with specific activity type (WhatsApp, etc.)
          console.log('Shared with', result.activityType);
        } else {
          // Shared generally
          console.log('Shared');
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
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
        // If WhatsApp is not installed, open regular share
        await Share.share({
          message: message,
          title: 'Share Florix on WhatsApp',
        });
      }
    } catch (error) {
      Alert.alert('Error', 'WhatsApp is not installed or failed to open');
    }
  };

  const shareToMessenger = async () => {
    try {
      const message = `🌱 Discover Florix - Your Smart Farming Assistant! 🚜\n\nJoin me in using Florix to get:\n• Plant disease detection\n• AI farming advice\n• Weather updates\n• Market prices\n\nDownload now: https://play.google.com/store/apps/details?id=com.florix.app`;
      
      // For Facebook Messenger
      const url = `fb-messenger://share?link=${encodeURIComponent('https://play.google.com/store/apps/details?id=com.florix.app')}&app_id=123456789`; // Replace with actual app ID if available
      
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        await Share.share({
          message: message,
          title: 'Share Florix on Messenger',
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Messenger is not installed or failed to open');
    }
  };

  const openShareOptions = () => {
    Alert.alert(
      'Share Florix',
      'Choose how you want to share the app:',
      [
        {
          text: 'WhatsApp',
          onPress: shareToWhatsApp
        },
        {
          text: 'Messenger',
          onPress: shareToMessenger
        },
        {
          text: 'Other Apps',
          onPress: shareApp
        },
        {
          text: 'Cancel',
          style: 'cancel'
        },
      ],
      { cancelable: true }
    );
  };

  const submitFeedback = () => {
    if (feedback.trim() === '') {
      Alert.alert('Error', 'Please enter your feedback');
      return;
    }

    // Here you would send feedback to backend
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
              color={star <= rating ? "#FFA500" : "#A1887F"}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <AppHeader title='Profile' page='profile'/>

      {/* Section 1: User Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <View style={styles.detailItem}>
          <View style={styles.detailIcon}>
            <Ionicons name="person-outline" size={20} color="#5D8A6F" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Full Name</Text>
            <Text style={styles.detailValue}>{userData.name}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailItem}>
          <View style={styles.detailIcon}>
            <Ionicons name="mail-outline" size={20} color="#5D8A6F" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Email Address</Text>
            <Text style={styles.detailValue}>{userData.email}</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <View style={styles.detailIcon}>
            <Ionicons name="call-outline" size={20} color="#5D8A6F" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Mobile Number</Text>
            <Text style={styles.detailValue}>{userData.mobile}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailItem}>
          <View style={styles.detailIcon}>
            <Ionicons name="location-outline" size={20} color="#5D8A6F" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Farm Address</Text>
            <Text style={styles.detailValue}>{userData.address}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailItem}>
          <View style={styles.detailIcon}>
            <Ionicons name="calendar-outline" size={20} color="#5D8A6F" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Member Since</Text>
            <Text style={styles.detailValue}>{userData.joinDate}</Text>
          </View>
        </View>
      </View>

      {/* Section 2: Share App */}
      <View style={styles.section}>
        <View style={styles.shareContainer}>
          <View style={styles.shareIconContainer}>
            <Ionicons name="share-social" size={32} color="#FFFFFF" />
          </View>
          <View style={styles.shareContent}>
            <Text style={styles.shareTitle}>Share the Green Revolution!</Text>
            <Text style={styles.shareDescription}>
              Help other farmers discover Florix and transform their farming experience
            </Text>
          </View>
          {/* Quick Share */}
          <View style={styles.quickShareContainer}>
          <Text style={styles.quickShareTitle}>Share via</Text>
          <View style={styles.quickShareButtons}>
            <TouchableOpacity style={styles.quickShareButton} onPress={shareToWhatsApp}>
              <FontAwesome name="whatsapp" size={24} color="#25D366" />
              <Text style={styles.quickShareText}>WhatsApp</Text>
            </TouchableOpacity>            
            <TouchableOpacity style={styles.quickShareButton} onPress={shareApp}>
              <Ionicons name="share-outline" size={24} color="#5D8A6F" />
              <Text style={styles.quickShareText}>Other Apps</Text>
            </TouchableOpacity>
          </View>
        </View>
        </View>        
      </View>

      {/* Section 3: Feedback */}
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
            <Ionicons name="chatbubble-ellipses-outline" size={24} color="#5D8A6F" />
            <View style={styles.feedbackButtonText}>
              <Text style={styles.feedbackButtonTitle}>Share Your Thoughts</Text>
              <Text style={styles.feedbackButtonSubtitle}>Help us improve your experience</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#A1887F" />
        </TouchableOpacity>
      </View>

      {/* Feedback Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={feedbackModalVisible}
        onRequestClose={() => setFeedbackModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Share Feedback</Text>
              <TouchableOpacity 
                onPress={() => setFeedbackModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#37474F" />
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
              placeholderTextColor="#A1887F"
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  section: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#37474F',
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#A1887F',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#37474F',
    fontWeight: '500',
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  editText: {
    fontSize: 12,
    color: '#5D8A6F',
    fontWeight: '500',
  },
  shareContainer: {
    backgroundColor: '#E8F5E8',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  shareIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#5D8A6F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  shareContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  shareTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#37474F',
    marginBottom: 8,
    textAlign: 'center',
  },
  shareDescription: {
    fontSize: 14,
    color: '#5D8A6F',
    textAlign: 'center',
    lineHeight: 20,
  },
  quickShareContainer: {
    marginTop: 10,
  },
  quickShareTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#37474F',
    marginBottom: 12,
    textAlign: 'center',
  },
  quickShareButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickShareButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    minWidth: 80,
    marginRight: 10
  },
  quickShareText: {
    fontSize: 12,
    color: '#37474F',
    marginTop: 6,
    fontWeight: '500',
  },
  feedbackDescription: {
    fontSize: 14,
    color: '#A1887F',
    marginBottom: 20,
    lineHeight: 20,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFAFA',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8F5E8',
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
    color: '#37474F',
    marginBottom: 2,
  },
  feedbackButtonSubtitle: {
    fontSize: 14,
    color: '#A1887F',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#37474F',
  },
  closeButton: {
    padding: 4,
  },
  ratingLabel: {
    fontSize: 16,
    color: '#37474F',
    marginBottom: 15,
    fontWeight: '500',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  starButton: {
    padding: 4,
  },
  feedbackLabel: {
    fontSize: 16,
    color: '#37474F',
    marginBottom: 8,
    fontWeight: '500',
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: '#E8F5E8',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#37474F',
    minHeight: 120,
    marginBottom: 20,
    backgroundColor: '#FAFAFA',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#37474F',
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#5D8A6F',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#A1887F',
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});