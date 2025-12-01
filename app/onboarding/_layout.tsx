import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="lang-selection" />
      <Stack.Screen name="plants-selection" />
      <Stack.Screen name="address" />
    </Stack>
  );
}