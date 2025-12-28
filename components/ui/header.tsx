import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SettingsModal from './SettingsModal';

type AppHeaderProps = {
  title?: string;
  page?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  showSettings?: boolean;
};

export default function AppHeader({ 
  title = 'Florix',
  page = 'home', 
  showBackButton = false,
  onBackPress,
  showSettings = true 
}: AppHeaderProps) {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const renderIcon = () => {
  if (page === 'home') {
    return <Ionicons name="leaf" size={22} color="#5D8A6F" />;
  } else if(page === 'florix-bot') {
    return <MaterialCommunityIcons name="robot-angry" size={22} color="#5D8A6F" />;
  } else if(page === 'profile') {
    return <Ionicons name="person" size={22} color="#5D8A6F" />;
  }
};
  return (
    <>
      <View style={styles.header}>
        {/* Left Side - Back Button or Empty */}
        <View style={styles.leftSection}>
          {showBackButton ? (
            <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#37474F" />
            </TouchableOpacity>
          ) : (
            <View style={styles.logo}>
              {renderIcon()}
            </View>
          )}
        </View>

        {/* Center - Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Right Side - Settings */}
        <View style={styles.rightSection}>
          {showSettings && (
            <TouchableOpacity 
              onPress={() => setSettingsVisible(true)} 
              style={styles.settingsButton}
            >
              <Ionicons name="settings-outline" size={24} color="#37474F" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Settings Modal */}
      <SettingsModal 
        visible={settingsVisible} 
        onClose={() => setSettingsVisible(false)} 
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E8',
  },
  leftSection: {
    width: 40,
  },
  backButton: {
    padding: 8,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#37474F',
    textAlign: 'center',
    flex: 1,
  },
  rightSection: {
    width: 40,
    alignItems: 'flex-end',
  },
  settingsButton: {
    padding: 8,
  },
});