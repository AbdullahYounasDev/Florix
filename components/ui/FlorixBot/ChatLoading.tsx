import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

const TypingDot = ({ delay, styles }: { delay: number; styles: any }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: -6,
          duration: 400,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue, delay]);

  return (
    <Animated.View
      style={[
        styles.typingDot,
        { transform: [{ translateY: animatedValue }] }
      ]}
    />
  );
};

const ChatLoading = ({ styles }: { styles: any }) => (
  <View style={[styles.messageBubble, styles.aiBubble, styles.loadingBubble]}>
    <View style={styles.typingIndicator}>
      <TypingDot delay={0} styles={styles} />
      <TypingDot delay={150} styles={styles} />
      <TypingDot delay={300} styles={styles} />
    </View>
  </View>
);

export default ChatLoading;