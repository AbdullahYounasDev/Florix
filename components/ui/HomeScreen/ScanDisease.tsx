import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import PlantHealthModal from './Ai/PlantHealthModal';

export default function CropsDoctorSection() {
  const [imageData, setImageData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Permissions
  const requestPermissions = async () => {
    const cam = await ImagePicker.requestCameraPermissionsAsync();
    const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return cam.status === 'granted' && lib.status === 'granted';
  };

  const handlePickImage = async (useCamera: boolean) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Camera and gallery access is needed.');
      return;
    }


    try {
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Restricts UI to images
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6,
        base64: true,
        exif: false,
      };

      const result = useCamera
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled) {
        const asset = result.assets[0];

        // Strict Validation: Ensure the file picked is actually an image
        if (asset.type !== 'image') {
          Alert.alert('Invalid File', 'Please select a valid image file (JPG, PNG).');
          setImageData(null); // Explicitly clear state
          return;
        }
        // Estimate base64 size (bytes)
        if (!asset.base64) {
          Alert.alert('Error', 'Failed to read image data. Please try again.');
          return;
        }

        const base64Size =
          (asset.base64.length * 3) / 4 -
          (asset.base64.endsWith('==') ? 2 : 1);


        const MAX_BASE64_SIZE = 2_500_000; // 2.5 MB

        if (base64Size > MAX_BASE64_SIZE) {
          Alert.alert(
            'Image Too Large',
            'Please select a smaller image. Max size is ~2.5MB.'
          );
          return;
        }


        const newImageData: any = {
          uri: asset.uri,
          mimetype: asset.mimeType,
          base64: asset.base64,
        };

        setImageData(newImageData);
        console.log("Image successfully captured:", newImageData.uri);
        setModalVisible(true)
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred while picking the image.');
      console.error(error);
    }
  };

  const showSourcePicker = () => {
    Alert.alert(
      'Scan Plant Health',
      'Select a crop image (2.5 MB or less)',
      [
        { text: 'Take Photo', onPress: () => handlePickImage(true) },
        { text: 'Gallery', onPress: () => handlePickImage(false) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Plant Health Scanner</Text>
      </View>

      {/* Process Flow (STATIC) */}
      <View style={styles.processFlow}>
        <View style={styles.stepWrapper}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="photo-camera" size={24} color="#2C3E50" />
          </View>
          <Text style={styles.stepLabel}>Upload</Text>
        </View>

        <View style={styles.connector} />

        <View style={styles.stepWrapper}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="biotech" size={24} color="#2C3E50" />
          </View>
          <Text style={styles.stepLabel}>Analyze</Text>
        </View>

        <View style={styles.connector} />

        <View style={styles.stepWrapper}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="pill" size={24} color="#2C3E50" />
          </View>
          <Text style={styles.stepLabel}>Solution</Text>
        </View>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={styles.mainActionBtn}
        onPress={showSourcePicker}
        activeOpacity={0.85}
      >
        <MaterialIcons name="qr-code-scanner" size={22} color="white" />
        <Text style={styles.mainActionText}>
          Start Diagnosis
        </Text>

      </TouchableOpacity>
      <PlantHealthModal
        visible={modalVisible}
        imageData={imageData as any}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 20,
    backgroundColor: '#5d8a6f20',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#5d8a6f30',
    marginTop: 0,
  },
  headerRow: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
  },
  processFlow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  stepWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#444',
  },
  connector: {
    width: 20,
    height: 1,
    backgroundColor: '#BDBDBD',
    marginTop: -20,
  },
  mainActionBtn: {
    backgroundColor: '#5D8A6F',
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  mainActionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
});
