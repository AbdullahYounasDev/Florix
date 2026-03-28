// components/DiseaseAlert.tsx
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { theme } from '@/utils/theme';
import { getAddress } from '@/utils/userdata';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  onClose?: () => void;
}

const ALERT_TYPES = [
  {
    id: 'disease',
    label: 'Disease Alerts',
    icon: 'virus',
    description: 'Fungal, bacterial & viral outbreaks',
  },
  {
    id: 'pest',
    label: 'Pest Alerts',
    icon: 'bug',
    description: 'Aphids, borers & locusts',
  },
  {
    id: 'weather',
    label: 'Weather Warnings',
    icon: 'weather-lightning-rainy',
    description: 'Frost, drought & flood risk',
  },
];

const FREQUENCY_OPTIONS = [
  { id: 'instant', label: 'Instant', desc: 'Real-time alerts' },
  { id: 'daily', label: 'Daily', desc: 'Morning digest' },
  { id: 'weekly', label: 'Weekly', desc: 'Weekly summary' },
];

export default function DiseaseAlert({ onClose }: Props) {
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>(['disease', 'pest']);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchCountry = async () => {
      const address = await getAddress();
      setCountry(address?.country || 'International');
      setCity(address?.city || 'International');
    };
    fetchCountry();
  }, []);

  const toggleAlert = (id: string) => {
    setSelectedAlerts(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
    setSaved(false);
  };

  const handleSave = async () => {
    if (selectedAlerts.length === 0) {
      Alert.alert('Select Alert Type', 'Please select at least one alert type.');
      return;
    }

    setSaving(true);
    await new Promise(res => setTimeout(res, 1200));
    setSaving(false);
    setSaved(true);
  };

  const handleClose = () => {
    setSaved(false);
    if (onClose) onClose();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Disease Alert</Text>
        </View>
        {onClose && (
          <TouchableOpacity onPress={handleClose} style={styles.closeButton} activeOpacity={0.85}>
            <Feather name="x" size={22} color={theme.colors.secondary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Master Toggle */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={styles.rowStart}>
              <View
                style={[
                  styles.iconCircle,
                  styles.iconSmall,
                  { backgroundColor: notifEnabled ? theme.colors.tertiary : '#F5F5F5' },
                ]}
              >
                <Ionicons
                  name={notifEnabled ? 'notifications' : 'notifications-off'}
                  size={20}
                  color={notifEnabled ? theme.colors.primary : theme.colors.secondary}
                />
              </View>
              <View>
                <Text style={styles.cardTitle}>Push Notifications</Text>
                <Text style={styles.cardSubtext}>
                  {notifEnabled ? 'Active' : 'Paused'}
                </Text>
              </View>
            </View>
            <Switch
              value={notifEnabled}
              onValueChange={v => {
                setNotifEnabled(v);
                setSaved(false);
              }}
              trackColor={{ false: '#E0E0E0', true: theme.colors.tertiary }}
              thumbColor={notifEnabled ? theme.colors.primary : theme.colors.secondary}
            />
          </View>
        </View>

        {/* Alert Types - Vertical Layout */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Alert Types</Text>
          <Text style={styles.cardSubtext}>Get notified about:</Text>

          <View style={styles.alertVerticalContainer}>
            {ALERT_TYPES.map(alert => {
              const isActive = selectedAlerts.includes(alert.id);

              return (
                <TouchableOpacity
                  key={alert.id}
                  style={[
                    styles.alertVerticalCard,
                    isActive && styles.alertVerticalCardActive,
                  ]}
                  onPress={() => toggleAlert(alert.id)}
                  activeOpacity={0.85}
                >
                  <View style={styles.alertVerticalLeft}>
                    <View style={[styles.alertVerticalIcon, isActive && styles.alertVerticalIconActive]}>
                      <MaterialCommunityIcons
                        name={alert.icon as any}
                        size={22}
                        color={isActive ? '#FFFFFF' : theme.colors.secondary}
                      />
                    </View>
                    <View style={styles.alertVerticalText}>
                      <Text style={[styles.alertVerticalLabel, isActive && styles.alertVerticalLabelActive]}>
                        {alert.label}
                      </Text>
                      <Text style={[styles.alertVerticalDesc, isActive && styles.alertVerticalDescActive]}>
                        {alert.description}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.checkCircle, isActive && styles.checkCircleActive]}>
                    {isActive && <Feather name="check" size={12} color={theme.colors.primary} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>


        {/* Info Note */}
        <View style={styles.infoCard}>
          <Feather name="info" size={16} color={theme.colors.primary} />
          <Text style={styles.infoText}>
            Alerts are based on your location ({country}, {city}) and real-time data
          </Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            selectedAlerts.length === 0 && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          activeOpacity={0.85}
          disabled={saving || selectedAlerts.length === 0}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : saved ? (
            <>
              <Feather name="check-circle" size={18} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Alerts Activated</Text>
            </>
          ) : (
            <>
              <Ionicons name="notifications" size={18} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Activate Alerts</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.tertiary,
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.tertiary,
    shadowColor: theme.colors.secondary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowStart: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconSmall: {
    width: 40,
    height: 40,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.secondary,
    marginBottom: 4,
  },
  cardSubtext: {
    fontSize: 12,
    color: theme.colors.secondary,
    opacity: 0.7,
  },
  // Vertical Alert Styles
  alertVerticalContainer: {
    marginTop: 12,
    gap: 8,
  },
  alertVerticalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.tertiary,
  },
  alertVerticalCardActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  alertVerticalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  alertVerticalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertVerticalIconActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  alertVerticalText: {
    flex: 1,
  },
  alertVerticalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.secondary,
    marginBottom: 2,
  },
  alertVerticalLabelActive: {
    color: '#FFFFFF',
  },
  alertVerticalDesc: {
    fontSize: 11,
    color: theme.colors.secondary,
    opacity: 0.7,
  },
  alertVerticalDescActive: {
    color: 'rgba(255,255,255,0.8)',
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.tertiary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.secondary,
    lineHeight: 18,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: theme.colors.secondary,
    opacity: 0.5,
    shadowOpacity: 0,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});