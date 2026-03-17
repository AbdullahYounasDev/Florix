// components/DiseaseAlert.tsx
import React, { useState } from 'react';
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

import { cropFertilizerData } from '@/utils/cropFertilizerData';
import { plantCategories } from '@/utils/plantCategories';
import { theme } from '@/utils/theme';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { FlatList, Modal } from 'react-native';

interface Props {
    onClose?: () => void;
}

const ALERT_TYPES = [
    {
        id: 'fungal',
        label: 'Fungal Diseases',
        icon: 'mushroom-outline',
        color: '#8D6E63',
        bg: '#EFEBE9',
        desc: 'Blight, rust, mildew & rot',
    },
    {
        id: 'pest',
        label: 'Pest Outbreaks',
        icon: 'bug-outline',
        color: '#E53935',
        bg: '#FFEBEE',
        desc: 'Aphids, borers & locusts',
    },
    {
        id: 'weather',
        label: 'Weather Warnings',
        icon: 'weather-lightning-rainy',
        color: '#1976D2',
        bg: '#E3F2FD',
        desc: 'Frost, drought & flood risk',
    },
    {
        id: 'soil',
        label: 'Soil Health',
        icon: 'layers-outline',
        color: '#F57C00',
        bg: '#FFF3E0',
        desc: 'Nutrient & pH anomalies',
    },
];

const FREQUENCY_OPTIONS = [
    { id: 'instant', label: 'Instant', icon: 'flash', desc: 'As it happens' },
    { id: 'daily', label: 'Daily', icon: 'calendar-today', desc: 'Morning digest' },
    { id: 'weekly', label: 'Weekly', icon: 'calendar-week', desc: 'Weekly summary' },
];

export default function DiseaseAlert({ onClose }: Props) {
    const fertilizerCropIds = cropFertilizerData.map(c => c.id);
    const allCrops = plantCategories
        .flatMap((cat: any) =>
            cat.crops.map((crop: any) => ({
                id: crop.id,
                name: crop.name,
                icon: crop.icon,
                category: cat.region,
            }))
        )
        .filter(crop => fertilizerCropIds.includes(crop.id));

    const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
    const [selectedAlerts, setSelectedAlerts] = useState<string[]>(['fungal', 'pest']);
    const [frequency, setFrequency] = useState('instant');
    const [notifEnabled, setNotifEnabled] = useState(true);
    const [showCropModal, setShowCropModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const toggleCrop = (id: string) => {
        setSelectedCrops(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
        setSaved(false);
    };

    const toggleAlert = (id: string) => {
        setSelectedAlerts(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
        setSaved(false);
    };

    const handleSave = async () => {
        if (selectedCrops.length === 0) {
            Alert.alert('No Crops Selected', 'Please select at least one crop to monitor.');
            return;
        }
        if (selectedAlerts.length === 0) {
            Alert.alert('No Alert Types', 'Please select at least one alert type.');
            return;
        }
        setSaving(true);
        await new Promise(res => setTimeout(res, 1200)); // simulate API call
        setSaving(false);
        setSaved(true);
    };

    const handleClose = () => {
        setSaved(false);
        if (onClose) onClose();
    };

    const selectedCropObjects = allCrops.filter(c => selectedCrops.includes(c.id));

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.title}>Disease Alert</Text>
                </View>
                {onClose && (
                    <TouchableOpacity onPress={handleClose} style={styles.closeBtn} activeOpacity={0.8}>
                        <Feather name="x" size={22} color={theme.colors.secondary} />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll} contentContainerStyle={{ paddingBottom: 40 }}>

                {/* ── Master Toggle ── */}
                <View style={styles.masterToggleCard}>
                    <View style={styles.masterToggleLeft}>
                        <View style={[styles.masterIcon, { backgroundColor: notifEnabled ? '#E8F5E9' : '#F5F5F5' }]}>
                            <Ionicons
                                name={notifEnabled ? 'notifications' : 'notifications-off'}
                                size={22}
                                color={notifEnabled ? theme.colors.primary : '#BDBDBD'}
                            />
                        </View>
                        <View>
                            <Text style={styles.masterToggleTitle}>Push Notifications</Text>
                            <Text style={styles.masterToggleSub}>
                                {notifEnabled ? 'Alerts are active' : 'All alerts paused'}
                            </Text>
                        </View>
                    </View>
                    <Switch
                        value={notifEnabled}
                        onValueChange={v => { setNotifEnabled(v); setSaved(false); }}
                        trackColor={{ false: '#E0E0E0', true: '#A5D6A7' }}
                        thumbColor={notifEnabled ? theme.colors.primary : '#BDBDBD'}
                    />
                </View>

                {/* ── Monitor Crops ── */}
                <View style={styles.sectionBlock}>
                    <View style={styles.sectionRow}>
                        <Text style={styles.sectionLabel}>Crops to Monitor</Text>
                        <TouchableOpacity
                            style={styles.addCropBtn}
                            onPress={() => setShowCropModal(true)}
                            activeOpacity={0.85}
                        >
                            <Feather name="plus" size={14} color={theme.colors.primary} />
                            <Text style={styles.addCropBtnText}>Add Crop</Text>
                        </TouchableOpacity>
                    </View>

                    {selectedCropObjects.length === 0 ? (
                        <TouchableOpacity
                            style={styles.emptyCropBox}
                            onPress={() => setShowCropModal(true)}
                            activeOpacity={0.85}
                        >
                            <MaterialCommunityIcons name="leaf-circle-outline" size={32} color="#C8E6C9" />
                            <Text style={styles.emptyCropText}>Tap to select crops you want alerts for</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.cropChipsWrap}>
                            {selectedCropObjects.map(crop => (
                                <TouchableOpacity
                                    key={crop.id}
                                    style={styles.cropChip}
                                    onPress={() => toggleCrop(crop.id)}
                                    activeOpacity={0.85}
                                >
                                    <Text style={{ fontSize: 14 }}>{crop.icon}</Text>
                                    <Text style={styles.cropChipText}>{crop.name}</Text>
                                    <Feather name="x" size={12} color="#888" />
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity
                                style={styles.cropChipAdd}
                                onPress={() => setShowCropModal(true)}
                                activeOpacity={0.85}
                            >
                                <Feather name="plus" size={14} color={theme.colors.primary} />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* ── Alert Types ── */}
                <View style={styles.sectionBlock}>
                    <Text style={styles.sectionLabel}>Alert Types</Text>
                    <View style={styles.alertGrid}>
                        {ALERT_TYPES.map(alert => {
                            const active = selectedAlerts.includes(alert.id);
                            return (
                                <TouchableOpacity
                                    key={alert.id}
                                    style={[
                                        styles.alertCard,
                                        active && { borderColor: alert.color, borderWidth: 2, backgroundColor: alert.bg },
                                    ]}
                                    onPress={() => toggleAlert(alert.id)}
                                    activeOpacity={0.85}
                                >
                                    <View style={[styles.alertIconWrap, { backgroundColor: active ? alert.color : alert.bg }]}>
                                        <MaterialCommunityIcons
                                            name={alert.icon as any}
                                            size={20}
                                            color={active ? '#fff' : alert.color}
                                        />
                                    </View>
                                    <Text style={[styles.alertCardLabel, active && { color: alert.color }]}>
                                        {alert.label}
                                    </Text>
                                    <Text style={styles.alertCardDesc}>{alert.desc}</Text>
                                    {active && (
                                        <View style={[styles.checkDot, { backgroundColor: alert.color }]}>
                                            <Feather name="check" size={10} color="#fff" />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* ── Notification Frequency ── */}
                <View style={styles.sectionBlock}>
                    <Text style={styles.sectionLabel}>Notification Frequency</Text>
                    <View style={styles.freqRow}>
                        {FREQUENCY_OPTIONS.map(opt => {
                            const active = frequency === opt.id;
                            return (
                                <TouchableOpacity
                                    key={opt.id}
                                    style={[styles.freqCard, active && styles.freqCardActive]}
                                    onPress={() => { setFrequency(opt.id); setSaved(false); }}
                                    activeOpacity={0.85}
                                >
                                    <MaterialCommunityIcons
                                        name={opt.icon as any}
                                        size={20}
                                        color={active ? '#fff' : '#888'}
                                    />
                                    <Text style={[styles.freqLabel, active && { color: '#fff' }]}>{opt.label}</Text>
                                    <Text style={[styles.freqDesc, active && { color: 'rgba(255,255,255,0.75)' }]}>
                                        {opt.desc}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* ── Info Banner ── */}
                <View style={styles.infoBanner}>
                    <Feather name="info" size={15} color={theme.colors.primary} style={{ marginTop: 1 }} />
                    <Text style={styles.infoText}>
                        Alerts are based on your region's crop disease database and real-time weather data. Make sure location permission is enabled for accurate alerts.
                    </Text>
                </View>

                {/* ── Save Button ── */}
                <TouchableOpacity
                    style={[
                        styles.saveBtn,
                        saved && styles.saveBtnSaved,
                        saving && { opacity: 0.8 },
                    ]}
                    onPress={handleSave}
                    activeOpacity={0.85}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : saved ? (
                        <>
                            <Feather name="check-circle" size={18} color="#fff" />
                            <Text style={styles.saveBtnText}>Alerts Saved!</Text>
                        </>
                    ) : (
                        <>
                            <Ionicons name="notifications" size={18} color="#fff" />
                            <Text style={styles.saveBtnText}>Activate Alerts</Text>
                        </>
                    )}
                </TouchableOpacity>

            </ScrollView>

            {/* Crop Selection Modal */}
            <Modal
                visible={showCropModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowCropModal(false)}
                statusBarTranslucent
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    onPress={() => setShowCropModal(false)}
                    activeOpacity={1}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Crops</Text>
                            <TouchableOpacity onPress={() => setShowCropModal(false)} activeOpacity={0.8}>
                                <Feather name="x" size={22} color={theme.colors.secondary} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={allCrops}
                            keyExtractor={item => item.id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 12 }}
                            renderItem={({ item }) => {
                                const selected = selectedCrops.includes(item.id);
                                return (
                                    <TouchableOpacity
                                        style={[styles.cropListItem, selected && styles.cropListItemSelected]}
                                        onPress={() => toggleCrop(item.id)}
                                        activeOpacity={0.85}
                                    >
                                        <View style={styles.cropListIcon}>
                                            <Text style={{ fontSize: 20 }}>{item.icon}</Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.cropListName}>{item.name}</Text>
                                            <Text style={styles.cropListCat}>{item.category}</Text>
                                        </View>
                                        <View style={[styles.cropCheckBox, selected && styles.cropCheckBoxActive]}>
                                            {selected && <Feather name="check" size={13} color="#fff" />}
                                        </View>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                        <TouchableOpacity
                            style={styles.modalDoneBtn}
                            onPress={() => setShowCropModal(false)}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.modalDoneBtnText}>
                                Done {selectedCrops.length > 0 ? `(${selectedCrops.length} selected)` : ''}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7F9F7' },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E8F5E8',
        backgroundColor: '#FFFFFF',
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    title: { fontSize: 20, fontWeight: '700', color: theme.colors.secondary },
    closeBtn: { padding: 8, borderRadius: 20 },

    scroll: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },

    // Master toggle
    masterToggleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E8F5E8',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
    },
    masterToggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    masterIcon: {
        width: 42, height: 42, borderRadius: 12,
        justifyContent: 'center', alignItems: 'center',
    },
    masterToggleTitle: { fontSize: 15, fontWeight: '700', color: theme.colors.secondary },
    masterToggleSub: { fontSize: 12, color: '#999', marginTop: 2 },

    // Section block
    sectionBlock: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#F0F4F0',
    },
    sectionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: theme.colors.secondary,
        marginBottom: 12,
    },
    addCropBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    addCropBtnText: { fontSize: 12, fontWeight: '600', color: theme.colors.primary },

    emptyCropBox: {
        borderWidth: 1.5,
        borderColor: '#E8F5E8',
        borderStyle: 'dashed',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        gap: 8,
    },
    emptyCropText: { fontSize: 13, color: '#AAAAAA', textAlign: 'center' },

    cropChipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    cropChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 20,
    },
    cropChipText: { fontSize: 13, fontWeight: '600', color: theme.colors.secondary },
    cropChipAdd: {
        width: 34, height: 34, borderRadius: 17,
        backgroundColor: '#F0F4F0',
        justifyContent: 'center', alignItems: 'center',
    },

    // Alert grid
    alertGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    alertCard: {
        width: '47%',
        backgroundColor: '#FAFAFA',
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: '#EEF2EE',
        position: 'relative',
    },
    alertIconWrap: {
        width: 38, height: 38, borderRadius: 10,
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 8,
    },
    alertCardLabel: { fontSize: 13, fontWeight: '700', color: theme.colors.secondary, marginBottom: 2 },
    alertCardDesc: { fontSize: 11, color: '#999' },
    checkDot: {
        position: 'absolute', top: 8, right: 8,
        width: 18, height: 18, borderRadius: 9,
        justifyContent: 'center', alignItems: 'center',
    },

    // Frequency
    freqRow: { flexDirection: 'row', gap: 8 },
    freqCard: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        gap: 4,
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    freqCardActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    freqLabel: { fontSize: 13, fontWeight: '700', color: '#555' },
    freqDesc: { fontSize: 10, color: '#999', textAlign: 'center' },

    // Info
    infoBanner: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        backgroundColor: '#E8F5E9',
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
    },
    infoText: { flex: 1, fontSize: 12, color: '#555', lineHeight: 18 },

    // Save button
    saveBtn: {
        backgroundColor: theme.colors.primary,
        borderRadius: 14,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        elevation: 3,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    saveBtnSaved: { backgroundColor: '#43A047' },
    saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

    // Modal
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
        paddingBottom: 14,
        marginBottom: 4,
    },
    modalTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.secondary },
    cropListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        gap: 12,
    },
    cropListItemSelected: { backgroundColor: '#F1F8F1' },
    cropListIcon: {
        width: 42, height: 42, borderRadius: 21,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center', alignItems: 'center',
    },
    cropListName: { fontSize: 15, fontWeight: '600', color: theme.colors.secondary },
    cropListCat: { fontSize: 12, color: '#999', marginTop: 1 },
    cropCheckBox: {
        width: 22, height: 22, borderRadius: 11,
        borderWidth: 2, borderColor: '#BDBDBD',
        justifyContent: 'center', alignItems: 'center',
    },
    cropCheckBoxActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    modalDoneBtn: {
        backgroundColor: theme.colors.primary,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 12,
    },
    modalDoneBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});