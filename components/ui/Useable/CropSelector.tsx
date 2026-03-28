// components/CropSelector.tsx
import { theme } from '@/utils/theme';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Crop {
  id: string;
  name: string;
  icon: string;
  category: string;
}

interface CropSelectorProps {
  crops: Crop[];
  selectedCrop?: Crop | null;
  onSelectCrop: (crop: Crop) => void;
  placeholder?: string;
  label?: string;
}

export default function CropSelector({ 
  crops, 
  selectedCrop, 
  onSelectCrop, 
  placeholder = "Choose a crop",
  label = "Select Crop"
}: CropSelectorProps) {
  const [showModal, setShowModal] = useState(false);

  const handleSelectCrop = (crop: Crop) => {
    onSelectCrop(crop);
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity 
        style={styles.cropSelector}
        onPress={() => setShowModal(true)}
        activeOpacity={0.85}
      >
        {selectedCrop ? (
          <View style={styles.selectedCrop}>
            <View style={styles.cropIconContainer}>
              <Text style={styles.cropIcon}>{selectedCrop.icon}</Text>
            </View>
            <View style={styles.cropInfo}>
              <Text style={styles.cropName}>{selectedCrop.name}</Text>
              <Text style={styles.cropCategory}>{selectedCrop.category}</Text>
            </View>
            <Feather name="chevron-down" size={20} color={theme.colors.secondary} />
          </View>
        ) : (
          <View style={styles.placeholderCrop}>
            <Text style={styles.placeholderText}>{placeholder}</Text>
            <Feather name="chevron-down" size={20} color={theme.colors.secondary} />
          </View>
        )}
      </TouchableOpacity>

      {/* Crop Selection Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
        statusBarTranslucent
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setShowModal(false)}
          activeOpacity={0.85}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setShowModal(false)} activeOpacity={0.85}>
                <Feather name="x" size={22} color={theme.colors.secondary} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={crops}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.cropList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.cropListItem}
                  onPress={() => handleSelectCrop(item)}
                  activeOpacity={0.85}
                >
                  <View style={styles.cropListItemIcon}>
                    <Text style={styles.cropListItemIconText}>{item.icon}</Text>
                  </View>
                  <View style={styles.cropListItemInfo}>
                    <Text style={styles.cropListItemName}>{item.name}</Text>
                    <Text style={styles.cropListItemCategory}>{item.category}</Text>
                  </View>
                  {selectedCrop?.id === item.id && (
                    <Feather name="check" size={20} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.secondary,
    marginBottom: 12,
  },
  cropSelector: {
    borderWidth: 1,
    borderColor: theme.colors.tertiary,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  selectedCrop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  cropIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cropIcon: {
    fontSize: 22,
  },
  cropInfo: {
    flex: 1,
  },
  cropName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.secondary,
    marginBottom: 2,
  },
  cropCategory: {
    fontSize: 12,
    color: theme.colors.secondary,
    opacity: 0.7,
  },
  placeholderCrop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  placeholderText: {
    fontSize: 16,
    color: theme.colors.secondary,
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.tertiary,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  cropList: {
    paddingBottom: 10,
  },
  cropListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.tertiary,
  },
  cropListItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cropListItemIconText: {
    fontSize: 20,
  },
  cropListItemInfo: {
    flex: 1,
  },
  cropListItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.secondary,
    marginBottom: 2,
  },
  cropListItemCategory: {
    fontSize: 12,
    color: theme.colors.secondary,
    opacity: 0.7,
  },
});