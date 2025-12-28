import Header from '@/components/ui/header';
import PlantSection from '@/components/ui/HomeScreen/PlantSection';
import CropsDoctorSection from '@/components/ui/HomeScreen/ScanDisease';
import ToolsSection from '@/components/ui/HomeScreen/ToolsItem';
import VideoTutorialSection from '@/components/ui/HomeScreen/VideoTutorialSection';
import WeatherSection from '@/components/ui/HomeScreen/WeatherSection';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function FlorixApp() {
  return (
    <View style={styles.container}>
      {/* Header with safe area padding */}
      <Header/>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.mainScroll}>

        {/* Weather & Recommendations Row with bottom padding */}
        <WeatherSection/>

        {/* Disease Scanner Section */}
        <CropsDoctorSection/>

        {/* Tools Grid */}
        <ToolsSection/>

        {/* Plant Selection Section */}
        <PlantSection/>

        {/* Video Tutorials with bottom padding */}
        <VideoTutorialSection/>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  mainScroll: {
    flex: 1,
  },
});