import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useRef } from 'react';
import {
  Animated,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='light'/>
      {/* Premium Header with Gradient */}
      <LinearGradient
        colors={['rgba(93, 138, 111, 0.95)', 'transparent']}
        style={styles.headerGradient}
      />

      {/* App Logo/Title - Premium */}
      <View style={styles.logoContainer}>
        <BlurView intensity={30} tint="light" style={styles.logoBlur}>
          <View style={styles.logoIconContainer}>
            <Ionicons name="leaf" size={24} color="#5D8A6F" />
          </View>
        </BlurView>
        <Text style={styles.logoText}>Florix</Text>
        <View style={styles.logoBadge}>
          <Text style={styles.badgeText}>AI</Text>
        </View>
      </View>

      {/* Premium Image Background with Overlays */}
      <ImageBackground
        source={require('@/assets/images/welcomefirst.png')}
        style={styles.imageBackground}
        resizeMode="cover"
        blurRadius={1}
      >
        {/* Premium Gradient Overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />

        {/* Accent Gradient */}
        <LinearGradient
          colors={['rgba(93, 138, 111, 0.15)', 'rgba(73, 196, 122, 0.05)', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Animated Content */}
        <Animated.View style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]}>

          {/* Premium Feature Cards - Animated List */}
          <View style={styles.featuresContainer}>
            {[
              { icon: 'scan-outline', text: 'Scan plants for instant diagnosis' },
              { icon: 'chatbubble-ellipses-outline', text: 'AI chat for farming guidance' },
              { icon: 'calendar-outline', text: 'Smart planting & harvest schedules' },
              { icon: 'alert-circle-outline', text: 'Live pest alerts & market insights' }
            ].map((feature, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.featureCard,
                  {
                    opacity: fadeAnim,
                    transform: [{
                      translateY: Animated.multiply(
                        slideAnim,
                        new Animated.Value(1 + index * 0.1)
                      )
                    }]
                  }
                ]}
              >
                <BlurView intensity={25} tint="light" style={styles.featureBlur}>
                  <View style={styles.featureIconContainer}>
                    <Ionicons name={feature.icon as any} size={20} color="#5D8A6F" />
                  </View>
                  <Text style={styles.featureText}>{feature.text}</Text>
                </BlurView>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </ImageBackground>

      {/* Premium Bottom Section */}
      <LinearGradient
        colors={['rgba(255,255,255,0.95)', '#FFFFFF']}
        style={styles.bottomGradient}
      >
        {/* Premium CTA Button */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push('/onboarding/lang-selection')}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#5D8A6F', '#49C47A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.ctaText}>Begin Journey</Text>
              <View style={styles.ctaIcon}>
                <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Premium Note */}
        <Text style={styles.premiumNote}>
          Trusted by farmers worldwide
        </Text>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F0C',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    zIndex: 1,
  },
  logoContainer: {
    position: 'absolute',
    top: 60,
    left: 30,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBlur: {
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
  },
  logoIconContainer: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  logoBadge: {
    backgroundColor: '#5D8A6F',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 100,
  },
  featuresContainer: {
    width: '100%',
    maxWidth: 380,
  },
  featureCard: {
    marginBottom: 14,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  featureBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  featureIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 10,
    padding: 10,
    marginRight: 16,
  },
  featureText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
    flex: 1,
    letterSpacing: 0.3,
    opacity: 0.95,
  },
  bottomGradient: {
    paddingHorizontal: 30,
    paddingTop: 25,
    paddingBottom: 40,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  ctaButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#5D8A6F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginRight: 12,
  },
  ctaIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 6,
  },
  premiumNote: {
    textAlign: 'center',
    color: '#5D8A6F',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
    opacity: 0.9,
  },
});