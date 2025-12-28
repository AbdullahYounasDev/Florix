import PlantsSelector, { PlantCategory } from '@/components/ui/PlantsSelector';
import { plantCategories } from '@/utils/plantCategories';
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// ✅ AsyncStorage utilities
import {
  getSelectedPlants,
  updateSelectedPlants,
} from '@/utils/userdata';

interface Plant {
  id: string;
  name: string;
  icon: string;
}

export default function PlantSection() {
  const [selectedPlants, setSelectedPlants] = useState<Plant[]>([]);
  const [modalSelectedPlants, setModalSelectedPlants] = useState<Plant[]>([]);
  const [showSelectorModal, setShowSelectorModal] = useState(false);

  // ==============================
  // Load saved plants from AsyncStorage
  // ==============================
  useEffect(() => {
    const loadPlants = async () => {
      const savedIds = await getSelectedPlants();
      const allPlants = plantCategories.flatMap(cat => cat.crops);
      const fullPlants = savedIds
        .map(id => allPlants.find(p => p.id === id))
        .filter(Boolean) as Plant[];
      setSelectedPlants(fullPlants);
    };
    loadPlants();
  }, []);

  // ==============================
  // Memoized all plants list
  // ==============================
  const allPlants = useMemo(() => plantCategories.flatMap(cat => cat.crops), []);

  // ==============================
  // Open modal → copy main state
  // ==============================
  const openModal = () => {
    setModalSelectedPlants([...selectedPlants]);
    setShowSelectorModal(true);
  };

  // ==============================
  // Toggle plant inside modal only
  // ==============================
  const togglePlantInModal = (plantId: string) => {
    const plant = allPlants.find(p => p.id === plantId);
    if (!plant) return;

    setModalSelectedPlants(prev => {
      if (prev.some(p => p.id === plantId)) {
        return prev.filter(p => p.id !== plantId);
      }
      if (prev.length >= 9) {
        Alert.alert("Limit reached", "You can select up to 9 plants only.");
        return prev;
      }
      return [...prev, plant];
    });
  };

  // ==============================
  // Deselect All inside modal only
  // ==============================
  const deselectAllInModal = () => {
    setModalSelectedPlants([]);
  };

  // ==============================
  // Done → save to AsyncStorage + update main state
  // ==============================
  const handleDone = async () => {
    try {
      const ids = modalSelectedPlants.map(p => p.id);
      await updateSelectedPlants(ids);
      setSelectedPlants([...modalSelectedPlants]);
      setShowSelectorModal(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save selected plants.");
    }
  };

  return (
    <>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Plants</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.plantsContent}
        >
          {/* Add Plant Button */}
          <TouchableOpacity 
            style={styles.addPlant} 
            activeOpacity={0.7}
            onPress={openModal}
          >
            <Feather name="plus" size={24} color="#A1887F" />
          </TouchableOpacity>

          {/* Render Saved Plants */}
          {selectedPlants.map(plant => (
            <TouchableOpacity
              key={plant.id}
              style={styles.plantItem}
              activeOpacity={0.7}
            >
              <View style={styles.plantIcon}>
                <Text style={styles.plantIconText}>{plant.icon}</Text>
              </View>
              <Text style={styles.plantName}>{plant.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Plant Selector Modal */}
      <Modal
        visible={showSelectorModal}
        animationType="slide"
        onRequestClose={() => setShowSelectorModal(false)}
      >
        <PlantsSelector
          selectedPlants={modalSelectedPlants.map(p => p.id)}
          onPlantToggle={togglePlantInModal}
          onDeselectAll={deselectAllInModal}
          categories={plantCategories as PlantCategory[]}
          onContinue={handleDone}
          onBack={() => setShowSelectorModal(false)}
          showHeader
          showSelectionSummary
          showActions
          continueButtonText="Done"
          backButtonText="Cancel"
          title="Manage Plants"
          subtitle="Add or remove plants from your collection"
          page="home"
        />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#37474F',
  },
  plantsContent: {
    paddingRight: 20,
    alignItems: 'center',
  },
  plantItem: {
    alignItems: 'center',
    marginRight: 7,
    width: 70,
  },
  plantIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  plantIconText: {
    fontSize: 28,
  },
  plantName: {
    fontSize: 12,
    color: '#37474F',
    fontWeight: '500',
    textAlign: 'center',
  },
  addPlant: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#A1887F',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 15,
  },
});