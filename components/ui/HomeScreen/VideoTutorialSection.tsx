import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface VideoTutorial {
  id: string;
  title: string;
  duration: string;
}

export default function VideoTutorialSection() {
  const [videos, setVideos] = useState<VideoTutorial[]>([]);

  // Mock fetching videos from backend
  const fetchVideos = async () => {
    const data: VideoTutorial[] = [
      { id: '1', title: 'Getting Started', duration: '5:30 min' },
      { id: '2', title: 'Disease Scanning', duration: '3:15 min' },
      { id: '3', title: 'Weather Tips', duration: '4:20 min' },
    ];
    setVideos(data);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Handle video press (mock)
  const handleVideoPress = (video: VideoTutorial) => {
    Alert.alert('Video Selected', `You selected "${video.title}" (${video.duration})`);
    // Future: Navigate to video player screen or play video
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>How to Use</Text>
        <TouchableOpacity onPress={() => Alert.alert('See All', 'Show all videos')}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.videoScroll}>
        {videos.map((video) => (
          <TouchableOpacity
            key={video.id}
            style={styles.videoCard}
            activeOpacity={0.8}
            onPress={() => handleVideoPress(video)}
          >
            <View style={styles.videoPlaceholder}>
              <Ionicons name="play-circle" size={48} color="#5D8A6F" />
            </View>
            <Text style={styles.videoTitle}>{video.title}</Text>
            <Text style={styles.videoDuration}>{video.duration}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#37474F',
  },
  seeAll: {
    fontSize: 14,
    color: '#5D8A6F',
    fontWeight: '600',
  },
  videoScroll: {
    flexDirection: 'row',
  },
  videoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginRight: 15,
    marginLeft: 5,
    marginBottom: 15,
    width: 180,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  videoPlaceholder: {
    height: 100,
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#37474F',
    marginBottom: 4,
  },
  videoDuration: {
    fontSize: 12,
    color: '#A1887F',
  },
});
