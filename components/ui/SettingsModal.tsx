import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
    Alert,
    Linking,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

type SettingsModalProps = {
  visible: boolean;
  onClose: () => void;
};

type SettingItem = {
  id: string;
  title: string;
  icon: string;
  iconType: 'ionicons' | 'material';
  onPress: () => void;
  showChevron?: boolean;
};

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const settingsItems: SettingItem[] = [
    {
      id: 'language',
      title: 'Language',
      icon: 'language',
      iconType: 'material',
      onPress: () => {
        onClose();
        // Navigate to language selection
        // router.push('/settings/language');
      },
      showChevron: true
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: 'shield-checkmark',
      iconType: 'ionicons',
      onPress: () => {
        Linking.openURL('https://yourwebsite.com/privacy').catch(() => {
          Alert.alert('Error', 'Could not open privacy policy');
        });
      }
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      icon: 'document-text',
      iconType: 'ionicons',
      onPress: () => {
        Linking.openURL('https://yourwebsite.com/terms').catch(() => {
          Alert.alert('Error', 'Could not open terms & conditions');
        });
      }
    },
    {
      id: 'permissions',
      title: 'Permissions',
      icon: 'key',
      iconType: 'ionicons',
      onPress: () => {
        onClose();
        // Navigate to permissions explanation
        // router.push('/settings/permissions');
      },
      showChevron: true
    },
    {
      id: 'support',
      title: 'Support / Contact',
      icon: 'headset',
      iconType: 'material',
      onPress: () => {
        onClose();
        // Navigate to contact page
        // router.push('/settings/contact');
      },
      showChevron: true
    },
    {
      id: 'about',
      title: 'About Florix',
      icon: 'information-circle',
      iconType: 'ionicons',
      onPress: () => {
        onClose();
        // Navigate to about page
        // router.push('/settings/about');
      },
      showChevron: true
    },
  ];

  const handleBackdropPress = () => {
    onClose();
  };

  const renderIcon = (item: SettingItem) => {
    const iconColor = '#5D8A6F';
    const iconSize = 22;

    if (item.iconType === 'ionicons') {
      return <Ionicons name={item.icon as any} size={iconSize} color={iconColor} />;
    } else {
      return <MaterialIcons name={item.icon as any} size={iconSize} color={iconColor} />;
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <TouchableOpacity 
        style={styles.backdrop} 
        activeOpacity={1}
        onPress={handleBackdropPress}
      >
        <View style={styles.modalContainer}>
          {/* Modal Content */}
          <TouchableOpacity 
            activeOpacity={1}
            style={styles.content}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Settings</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#37474F" />
              </TouchableOpacity>
            </View>

            {/* Settings List */}
            <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
              {settingsItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.item}
                  onPress={item.onPress}
                >
                  <View style={styles.itemLeft}>
                    <View style={styles.iconContainer}>
                      {renderIcon(item)}
                    </View>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                  </View>
                  {item.showChevron && (
                    <Ionicons name="chevron-forward" size={20} color="#A1887F" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.version}>Florix v1.0.0</Text>
              <Text style={styles.copyright}>© 2024 All rights reserved</Text>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#37474F',
  },
  closeButton: {
    padding: 4,
  },
  listContainer: {
    maxHeight: 400,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  itemTitle: {
    fontSize: 16,
    color: '#37474F',
    fontWeight: '500',
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  version: {
    fontSize: 12,
    color: '#5D8A6F',
    fontWeight: '600',
    marginBottom: 4,
  },
  copyright: {
    fontSize: 11,
    color: '#A1887F',
  },
});