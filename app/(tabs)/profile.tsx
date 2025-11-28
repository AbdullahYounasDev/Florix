import PlantSection from '@/components/ui/HomeScreen/PlantSection';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState({
    diseaseAlerts: true,
    weatherUpdates: true,
    cropNews: false,
    marketPrices: true,
  });

  // Mock user data
  const userData = {
    name: 'Ali Farmer',
    address: '123 Farm Street, Agricultural Zone, Lahore, Pakistan',
    email: 'ali.farmer@example.com',
    joinDate: 'January 2024',
  };

  // Mock recent activities
  const recentActivities = [
    {
      id: '1',
      type: 'chat',
      title: 'AI Chat about Tomato Blight',
      description: 'Asked about treatment options',
      timestamp: '2 hours ago',
      icon: 'chatbubble-outline',
    },
    {
      id: '2',
      type: 'scan',
      title: 'Plant Disease Scan',
      description: 'Uploaded tomato leaf for analysis',
      timestamp: '1 day ago',
      icon: 'camera-outline',
    },
    {
      id: '3',
      type: 'crop',
      title: 'Added New Crop',
      description: 'Added Wheat to your plants',
      timestamp: '2 days ago',
      icon: 'leaf-outline',
    },
    {
      id: '4',
      type: 'weather',
      title: 'Weather Check',
      description: 'Checked weather recommendations',
      timestamp: '3 days ago',
      icon: 'partly-sunny-outline',
    },
  ];

  // Mock selected plants
  const selectedPlants = ['Tomato', 'Wheat', 'Rice', 'Corn'];

  const toggleNotification = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const getActivityIcon = (iconName: any) => {
    return <Ionicons name={iconName} size={20} color="#5D8A6F" />;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Profile Info */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userData.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="camera-outline" size={16} color="#5D8A6F" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.userName}>{userData.name}</Text>
        <Text style={styles.userEmail}>{userData.email}</Text>
        
        <View style={styles.addressContainer}>
          <Text style={styles.userAddress}>{userData.address}</Text>
        </View>
        
        <Text style={styles.joinDate}>Member since {userData.joinDate}</Text>
      </View>

      {/* Selected Plants Section */}
        
        <PlantSection />

      {/* Recent Activity Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.activitiesList}>
          {recentActivities.map(activity => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                {getActivityIcon(activity.icon)}
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDescription}>{activity.description}</Text>
                <Text style={styles.activityTime}>{activity.timestamp}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#A1887F" />
            </View>
          ))}
        </View>
      </View>

      {/* Notifications Settings */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <Text style={styles.sectionSubtitle}>Stay updated with your crops</Text>
        </View>
        
        <View style={styles.notificationsList}>
          <View style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <View style={[styles.notificationIcon, { backgroundColor: '#E8F5E8' }]}>
                <MaterialIcons name="warning" size={20} color="#5D8A6F" />
              </View>
              <View style={styles.notificationText}>
                <Text style={styles.notificationTitle}>Disease Alerts</Text>
                <Text style={styles.notificationDescription}>
                  Get alerts for plant diseases in your area
                </Text>
              </View>
            </View>
            <Switch
              value={notifications.diseaseAlerts}
              onValueChange={() => toggleNotification('diseaseAlerts')}
              trackColor={{ false: '#F5F5F5', true: '#5D8A6F' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <View style={[styles.notificationIcon, { backgroundColor: '#E8F5E8' }]}>
                <Ionicons name="partly-sunny-outline" size={20} color="#5D8A6F" />
              </View>
              <View style={styles.notificationText}>
                <Text style={styles.notificationTitle}>Weather Updates</Text>
                <Text style={styles.notificationDescription}>
                  Daily weather forecasts and alerts
                </Text>
              </View>
            </View>
            <Switch
              value={notifications.weatherUpdates}
              onValueChange={() => toggleNotification('weatherUpdates')}
              trackColor={{ false: '#F5F5F5', true: '#5D8A6F' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <View style={[styles.notificationIcon, { backgroundColor: '#E8F5E8' }]}>
                <Ionicons name="newspaper-outline" size={20} color="#5D8A6F" />
              </View>
              <View style={styles.notificationText}>
                <Text style={styles.notificationTitle}>Crop News</Text>
                <Text style={styles.notificationDescription}>
                  Latest farming techniques and news
                </Text>
              </View>
            </View>
            <Switch
              value={notifications.cropNews}
              onValueChange={() => toggleNotification('cropNews')}
              trackColor={{ false: '#F5F5F5', true: '#5D8A6F' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <View style={[styles.notificationIcon, { backgroundColor: '#E8F5E8' }]}>
                <FontAwesome name="line-chart" size={18} color="#5D8A6F" />
              </View>
              <View style={styles.notificationText}>
                <Text style={styles.notificationTitle}>Market Prices</Text>
                <Text style={styles.notificationDescription}>
                  Daily price updates for your crops
                </Text>
              </View>
            </View>
            <Switch
              value={notifications.marketPrices}
              onValueChange={() => toggleNotification('marketPrices')}
              trackColor={{ false: '#F5F5F5', true: '#5D8A6F' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Disease Scans</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>47</Text>
          <Text style={styles.statLabel}>AI Chats</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>4</Text>
          <Text style={styles.statLabel}>Plants</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  profileHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 25,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E8',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#5D8A6F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FAFAFA',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#37474F',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#A1887F',
    marginBottom: 12,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userAddress: {
    fontSize: 14,
    color: '#37474F',
    marginLeft: 6,
    textAlign: 'center',
  },
  joinDate: {
    fontSize: 12,
    color: '#A1887F',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 12,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#37474F',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#A1887F',
  },
  seeAllText: {
    fontSize: 14,
    color: '#5D8A6F',
    fontWeight: '500',
  },
  plantsScroll: {
    flexDirection: 'row',
  },
  plantChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 10,
  },
  plantText: {
    fontSize: 14,
    color: '#5D8A6F',
    fontWeight: '500',
    marginLeft: 6,
  },
  addPlantChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A1887F',
    borderStyle: 'dashed',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 10,
  },
  addPlantText: {
    fontSize: 14,
    color: '#A1887F',
    fontWeight: '500',
    marginLeft: 6,
  },
  activitiesList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#37474F',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 14,
    color: '#A1887F',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#A1887F',
  },
  notificationsList: {
    gap: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#37474F',
    marginBottom: 2,
  },
  notificationDescription: {
    fontSize: 14,
    color: '#A1887F',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    marginBottom: 30,
    paddingVertical: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '600',
    color: '#5D8A6F',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#A1887F',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: '#E8F5E8',
    alignSelf: 'center',
  },
});