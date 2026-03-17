import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function LanguageSelectionScreen() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const languages = [
    {
      code: 'en',
      name: 'English',
      country: 'Global',
      flag: '🇺🇸',
    },
    {
      code: 'zh',
      name: '中文',
      nativeName: 'Chinese',
      country: 'China',
      flag: '🇨🇳',
    },
    {
      code: 'hi',
      name: 'हिंदी',
      nativeName: 'Hindi',
      country: 'India',
      flag: '🇮🇳',
    },
    {
      code: 'es',
      name: 'Español',
      nativeName: 'Spanish',
      country: 'USA/Mexico',
      flag: '🇪🇸',
    },
    {
      code: 'pt',
      name: 'Português',
      nativeName: 'Portuguese',
      country: 'Brazil',
      flag: '🇧🇷',
    },
    {
      code: 'id',
      name: 'Bahasa Indonesia',
      nativeName: 'Indonesian',
      country: 'Indonesia',
      flag: '🇮🇩',
    },
    {
      code: 'ru',
      name: 'Русский',
      nativeName: 'Russian',
      country: 'Russia/Ukraine',
      flag: '🇷🇺',
    },
    {
      code: 'fr',
      name: 'Français',
      nativeName: 'French',
      country: 'France/Africa',
      flag: '🇫🇷',
    },
    {
      code: 'ur',
      name: 'اردو',
      nativeName: 'Urdu',
      country: 'Pakistan',
      flag: '🇵🇰',
    },
  ];

  const handleContinue = () => {
    router.push('/onboarding/plants-selection');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='dark'/>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Select Language</Text>
          <Text style={styles.subtitle}>
            Choose your preferred language for farming assistance
          </Text>
        </View>

        {/* Language List */}
        <ScrollView 
          style={styles.languageList}
          showsVerticalScrollIndicator={false}
        >
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageCard,
                selectedLanguage === lang.code && styles.selectedLanguageCard
              ]}
              onPress={() => setSelectedLanguage(lang.code)}
            >
              <View style={styles.languageInfo}>
                <Text style={styles.flag}>{lang.flag}</Text>
                <View style={styles.languageDetails}>
                  <Text style={styles.languageName}>{lang.name}</Text>
                  <Text style={styles.languageNative}>{lang.nativeName || lang.name}</Text>
                  <Text style={styles.languageCountry}>{lang.country}</Text>
                </View>
              </View>

              <View style={styles.selectionIndicator}>
                {selectedLanguage === lang.code ? (
                  <Ionicons name="checkmark-circle" size={28} color="#5D8A6F" />
                ) : (
                  <View style={styles.unselectedCircle} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Navigation Buttons Row */}
        <View style={styles.navigationRow}>
          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
          >
            <Ionicons name="arrow-back" size={20} color="#8B4513" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          {/* Continue Button */}
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <View style={styles.buttonContent}>
              <Text style={styles.continueButtonText}>Continue</Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#37474F',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#A1887F',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  languageList: {
    flex: 1,
    marginBottom: 20,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8F5E8',
  },
  selectedLanguageCard: {
    backgroundColor: '#E8F5E8',
    borderColor: '#5D8A6F',
    borderWidth: 2,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 32,
    marginRight: 16,
  },
  languageDetails: {
    flex: 1,
  },
  languageName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#37474F',
    marginBottom: 2,
  },
  languageNative: {
    fontSize: 14,
    color: '#5D8A6F',
    fontWeight: '500',
    marginBottom: 2,
  },
  languageCountry: {
    fontSize: 12,
    color: '#A1887F',
  },
  selectionIndicator: {
    marginLeft: 10,
  },
  unselectedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8F5E8',
  },
  navigationRow: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5E8D9',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D7CCC8',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
    marginLeft: 8,
  },
  continueButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#5D8A6F',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderRadius: 16,
  },
  buttonContent: {
    flex: 1,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
});