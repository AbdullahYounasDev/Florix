// app/crop-timeline.tsx
import CropTimeline from '@/components/ui/FlorixTools/CropTimeline/CropTimeline';
import AppHeader from '@/components/ui/header';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CropTimelineScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader title='Crops Timeline' page='crop-timeline' showSettings={true} />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.mainScroll}>
      <CropTimeline HeaderState={false}/>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainScroll: {
    flex: 1,
  },
});