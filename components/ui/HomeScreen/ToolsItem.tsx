import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const toolsData = [
  {
    id: 'fertilizer',
    title: 'Fertilizer Calculator',
    icon: <MaterialCommunityIcons name="calculator" size={24} color="#5D8A6F" />,
  },
  {
    id: 'pests',
    title: 'Pests & Disease',
    icon: <MaterialIcons name="bug-report" size={24} color="#5D8A6F" />,
  },
  {
    id: 'tips',
    title: 'Cultivation Tips',
    icon: <Ionicons name="bulb-outline" size={24} color="#5D8A6F" />,
  },
  {
    id: 'alert',
    title: 'Disease Alert',
    icon: <Ionicons name="notifications-outline" size={24} color="#5D8A6F" />,
  },
];

export default function ToolsSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Tools</Text>
      <View style={styles.grid}>
        {toolsData.map((tool) => (
          <TouchableOpacity key={tool.id} style={styles.toolCard} activeOpacity={0.8}>
            <View style={styles.toolHeader}>
              <View style={styles.iconContainer}>{tool.icon}</View>
              <Feather name="arrow-right" size={18} color="#A1887F" />
            </View>
            <Text style={styles.toolTitle}>{tool.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  toolCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  toolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#37474F',
  },
});
