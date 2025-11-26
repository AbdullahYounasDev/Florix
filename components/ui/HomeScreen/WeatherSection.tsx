import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";


interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
}

interface Recommendation {
  id: number;
  text: string;
  type: "good" | "bad";
}

export default function WeatherSection() {
// -------------------------------
// State with Types
// -------------------------------
const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

// -------------------------------
// Simulate API call structure (no real API used)
// -------------------------------
useEffect(() => {
  const fetchMockWeather = async () => {
    // ⭐ In future, replace this with real API:
    // const response = await fetch("YOUR_API_URL");
    // const data = await response.json();

    const mockWeather: WeatherData = {
      city: "Lahore",
      temperature: 32,
      condition: "Sunny",
    };

    const mockRecommendations: Recommendation[] = [
      { id: 1, text: "Good for watering", type: "good" },
      { id: 2, text: "Not suitable for spray", type: "bad" },
    ];

    setWeatherData(mockWeather);
    setRecommendations(mockRecommendations);
  };

  fetchMockWeather();
}, []);

// Optional: handle loading state
if (!weatherData) return null;

  return (
    <View style={styles.weatherSection}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
      >
        {/* WEATHER CARD */}
        <View style={styles.weatherCard}>
          <View style={styles.weatherHeader}>
            <Text style={styles.weatherCity}>{weatherData.city}</Text>
            <Ionicons name={weatherData.temperature >= 30 ? 'sunny' : 'cloud'} size={28} color="#FFA500" />
          </View>

          <Text style={styles.temperature}>{weatherData.temperature}°C</Text>
          <Text style={styles.weatherCondition}>{weatherData.condition}</Text>
        </View>

        {/* RECOMMENDATION CARD */}
        <View style={styles.recommendationCard}>
          <Text style={styles.recommendationTitle}>Weather Advice</Text>

          {recommendations.map((item) => (
            <View key={item.id} style={styles.recommendationItem}>
              <Ionicons
                name={
                  item.type === "good"
                    ? "checkmark-circle"
                    : "close-circle"
                }
                size={20}
                color={item.type === "good" ? "#5D8A6F" : "#A1887F"}
              />
              <Text style={styles.recommendationText}>{item.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  weatherSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  horizontalScroll: {
    flexDirection: "row",
  },

  weatherCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginRight: 15,
    marginLeft: 1,
    marginBottom: 15,
    width: 150,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  weatherHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  weatherCity: {
    fontSize: 16,
    fontWeight: "600",
    color: "#37474F",
  },

  temperature: {
    fontSize: 32,
    fontWeight: "300",
    color: "#37474F",
    marginBottom: 4,
  },

  weatherCondition: {
    fontSize: 14,
    color: "#A1887F",
  },

  // Recommendation Styles
  recommendationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginRight: 20,
    marginBottom: 15,
    width: 200,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  recommendationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#37474F",
    marginBottom: 15,
  },

  recommendationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  recommendationText: {
    fontSize: 14,
    color: "#37474F",
    marginLeft: 10,
  },
});
