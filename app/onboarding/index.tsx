import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Your Personal\nCrop Doctor',
    description: 'AI-powered disease detection with instant diagnosis',
    subDescription: 'Scan plant leaves & get treatment recommendations',
    image: require('@/assets/images/welcomefirst.png'),
    gradient: ['#5D8A6F', '#4A7C59'],
    icon: '🩺',
  },
  {
    id: '2',
    title: 'AI Farming\nAssistant',
    description: '24/7 intelligent chatbot for farming guidance',
    subDescription: 'Ask questions about crops, weather, and techniques',
    image: require('@/assets/images/welcomesecond.png'),
    gradient: ['#4A7C59', '#3A6B4A'],
    icon: '⚙',
  },
  {
    id: '3',
    title: 'Smart Weather\nInsights',
    description: 'Precise forecasts tailored to your crops',
    subDescription: 'Get planting & harvesting recommendations',
    image: require('@/assets/images/welcomethird.png'),
    gradient: ['#6B8E23', '#5A7D1C'],
    icon: '🌤️',
  },
  {
    id: '4',
    title: 'Complete Farming\nToolkit',
    description: 'Everything you need for successful farming',
    subDescription: 'Pest alerts, cultivation tips, market prices & more',
    image: require('@/assets/images/welcomefourth.png'),
    gradient: ['#c98351fb', '#c47c4cff'],
    icon: '🧰',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        scrollViewRef.current?.scrollTo({
          x: nextIndex * width,
          animated: true,
        });
        setCurrentIndex(nextIndex);
        
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } else {
      router.push('/onboarding/lang-selection');
    }
  };

  const handleSkip = () => {
    router.push('/onboarding/lang-selection');
  };

  const onScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* App Logo/Title */}
      <View style={styles.logoContainer}>
        <View style={styles.logoIconContainer}>
          <Ionicons name="leaf" size={22} color="#49c47aff" />
        </View>
        <Text style={styles.logoText}>Florix</Text>
      </View>

      {/* Image Slider */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={styles.slider}
      >
        {slides.map((slide, index) => (
          <View key={slide.id} style={{ width }}>
            <ImageBackground
              source={slide.image}
              style={styles.imageBackground}
              resizeMode="cover"
            >
              {/* Dark Overlay */}
              <View style={styles.darkOverlay} />
              
              {/* Gradient Overlay */}
              <View style={[styles.gradientOverlay, {
                backgroundColor: `rgba(${parseInt(slide.gradient[0].substring(1, 3), 16)}, ${parseInt(slide.gradient[0].substring(3, 5), 16)}, ${parseInt(slide.gradient[0].substring(5, 7), 16)}, 0.2)`
              }]} />
              
              {/* Content */}
              <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                
                {/* Icon Badge
                <View style={styles.iconBadge}>
                  <Text style={styles.iconText}>{slide.icon}</Text>
                </View> */}
                
                {/* Title Section */}
                <View style={styles.titleSection}>
                  <Text style={styles.title}>{slide.title}</Text>
                  <View style={[styles.titleLine, { backgroundColor: slide.gradient[0] }]} />
                </View>
                
                {/* Description Cards */}
                <View style={styles.descriptionCard}>
                  <View style={styles.descriptionRow}>
                    <Ionicons name="checkmark-circle" size={20} color={slide.gradient[0]} />
                    <Text style={styles.descriptionMain}>{slide.description}</Text>
                  </View>
                  <View style={styles.descriptionRow}>
                    <Ionicons name="checkmark-circle" size={16} color={slide.gradient[0]} />
                    <Text style={styles.descriptionSub}>{slide.subDescription}</Text>
                  </View>
                </View>
                
                {/* Progress Indicator */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressDots}>
                    {slides.map((_, dotIndex) => (
                      <View
                        key={dotIndex}
                        style={[
                          styles.progressDot,
                          dotIndex === index && styles.progressDotActive,
                          dotIndex === index && { backgroundColor: slide.gradient[0] }
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={styles.progressText}>
                    {index + 1} / {slides.length}
                  </Text>
                </View>
              </Animated.View>
            </ImageBackground>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Section - Light Theme */}
      <View style={styles.bottomSection}>
        {/* Next Button */}
        <TouchableOpacity 
          style={[
            styles.nextButton,
            { backgroundColor: slides[currentIndex].gradient[0] }
          ]} 
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Continue'}
          </Text>
          <Ionicons 
            name={currentIndex === slides.length - 1 ? "checkmark-circle" : "arrow-forward"} 
            size={24} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>

        {/* Swipe Hint */}
        <View style={styles.swipeHintContainer}>
          <Ionicons name="swap-horizontal" size={16} color="#5D8A6F" />
          <Text style={styles.swipeHint}>
            Swipe to explore more features
          </Text>
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
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 25,
    zIndex: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  skipText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  logoContainer: {
    position: 'absolute',
    top: 50,
    left: 25,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
    marginRight: 10,
  },
  logoIcon: {
    fontSize: 24,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  slider: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 100,
  },
  iconBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  iconText: {
    fontSize: 40,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 42,
    letterSpacing: 0.5,
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  titleLine: {
    width: 100,
    height: 4,
    borderRadius: 2,
  },
  descriptionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 350,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    marginBottom: 40,
  },
  descriptionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  descriptionMain: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
    lineHeight: 24,
  },
  descriptionSub: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '400',
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
    opacity: 0.9,
  },
  progressContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
  progressDots: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  progressDotActive: {
    width: 24,
  },
  progressText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    opacity: 0.8,
  },
  bottomSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 25,
    paddingVertical: 25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginRight: 12,
    letterSpacing: 0.5,
  },
  swipeHintContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeHint: {
    fontSize: 14,
    color: '#5D8A6F',
    marginLeft: 8,
    fontWeight: '500',
  },
});