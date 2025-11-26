import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Plant {
  id: string;
  name: string;
}

export default function PlantSection() {
  const [plants, setPlants] = useState<Plant[]>([]);

  // Mock fetching plants from backend
  const fetchPlants = async () => {
    // Replace this with API call in future
    const data: Plant[] = [
      { id: '1', name: 'Tomato' },
      { id: '2', name: 'Wheat' },
      { id: '3', name: 'Rice' },
      { id: '4', name: 'Corn' },
      { id: '5', name: 'Potato' },
    ];
    setPlants(data);
  };

  useEffect(() => {
    fetchPlants();
  }, []);


  // Remove a plant
  const removePlant = (id: string) => {
    Alert.alert(
      'Remove Plant',
      'Are you sure you want to remove this plant?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => {
          setPlants(plants.filter((p) => p.id !== id));
        }},
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Your Plants</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.plantsContent}
      >
        {/* Add Plant Button */}
        <TouchableOpacity style={styles.addPlant} activeOpacity={0.7} >
          <Feather name="plus" size={24} color="#A1887F" />
        </TouchableOpacity>

        {/* Render Plants */}
        {plants.map((plant) => (
          <TouchableOpacity
            key={plant.id}
            style={styles.plantItem}
            activeOpacity={0.7}
            onPress={() => removePlant(plant.id)}
          >
            <View style={styles.plantIcon}>
              <Ionicons name="leaf" size={24} color="#5D8A6F" />
            </View>
            <Text style={styles.plantName}>{plant.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#37474F',
    marginBottom: 15,
  },
  plantsContent: {
    paddingRight: 10,
  },
  plantItem: {
    alignItems: 'center',
    marginRight: 5,
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
  },
});
