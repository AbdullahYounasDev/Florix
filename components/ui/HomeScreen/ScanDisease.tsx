import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CropsDoctorSection() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState<boolean | null>(null);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if(cameraStatus.status === 'granted'){
      setHasCameraPermission(cameraStatus.status === 'granted');
    }else if(galleryStatus.status === 'granted'){
      setHasGalleryPermission(galleryStatus.status === 'granted');
    }
  };

  const pickFromGallery = async () => {
    if (hasGalleryPermission === false) {
      Alert.alert(
        'Permission Denied',
        'Gallery access is required to select a photo.',
        [{ text: 'Retry', onPress: requestPermissions }, { text: 'Cancel', style: 'cancel' }]
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        setPhotoUri(result.assets[0].uri);
        Alert.alert('Photo Selected', 'Photo is ready for disease diagnosis.');
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
      Alert.alert('Error', 'Could not access gallery.');
    }
  };

  const takePhoto = async () => {
    if (hasCameraPermission === false) {
      Alert.alert(
        'Permission Denied',
        'Camera access is required to take a photo.',
        [{ text: 'Retry', onPress: requestPermissions }, { text: 'Cancel', style: 'cancel' }]
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        setPhotoUri(result.assets[0].uri);
        Alert.alert('Photo Taken', 'Photo is ready for disease diagnosis.');
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
      Alert.alert('Error', 'Could not access camera.');
    }
  };

  const handleScanPlantDisease = () => {
    Alert.alert(
      'Select Image Source',
      'Where do you want to get the plant photo from?',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Gallery', onPress: pickFromGallery },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Plants Health Scanner</Text>

      {/* Process Flow Section */}
      <View style={styles.processFlow}>
        {/* Step 1: Take Photo */}
        <View style={styles.processStep}>
          <View style={[styles.stepIcon, styles.inactiveStep]}>
            <MaterialIcons name="photo-camera" size={22} color="#A1887F" />
          </View>
          <Text style={styles.stepText}>Take Photo</Text>
        </View>

        {/* Arrow */}
        <MaterialIcons name="arrow-forward" size={16} color="#A1887F" style={styles.arrow} />

        {/* Step 2: Diagnosis */}
        <View style={styles.processStep}>
          <View style={[styles.stepIcon, styles.inactiveStep]}>
            <MaterialIcons name="search" size={22} color="#A1887F" />
          </View>
          <Text style={styles.stepText}>Diagnosis</Text>
        </View>

        {/* Arrow */}
        <MaterialIcons name="arrow-forward" size={16} color="#A1887F" style={styles.arrow} />

        {/* Step 3: Get Medicine */}
        <View style={styles.processStep}>
          <View style={[styles.stepIcon, styles.inactiveStep]}>
            <MaterialCommunityIcons name="medical-bag" size={22} color="#A1887F" />
          </View>
          <Text style={styles.stepText}>Medicine</Text>
        </View>
      </View>

      {/* Main Scan Button */}
      <TouchableOpacity style={styles.scanButton} onPress={handleScanPlantDisease}>
        <MaterialIcons name="camera-alt" size={20} color="#FFFFFF" />
        <Text style={styles.scanButtonText}>Scan Plant Disease</Text>
      </TouchableOpacity>

      {/* Preview Selected Photo */}
      {photoUri && (
        <Image
          source={{ uri: photoUri }}
          style={styles.previewImage}
          resizeMode="cover"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor:'#5d8a6f52',
    borderRadius: 20, 
    marginHorizontal:10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#37474F',
    marginBottom: 20,
  },
  processFlow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 5,
  },
  processStep: {
    alignItems: 'center',
  },
  stepIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  inactiveStep: {
    backgroundColor: '#F5F5F5',
    opacity: 0.6,
  },
  stepText: {
    fontSize: 11,
    color: '#37474F',
    fontWeight: '500',
    textAlign: 'center',
  },
  arrow: {
    marginHorizontal: 2,
    opacity: 1,
  },
  scanButton: {
    backgroundColor: '#5D8A6F',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  previewImage: {
    marginTop: 15,
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
});