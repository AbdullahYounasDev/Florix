import { getAddress } from "@/utils/userdata";
import { getWeatherAdvice } from "@/utils/weatherAdvice";
import { getWeatherIcon } from "@/utils/weatherIcon";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import WeatherDetailsModal from "./weather/WeatherDetailsModal";

// ======================
// Types
// ======================
interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  icon: string;
}

interface Recommendation {
  id: number;
  text: string;
  type: "good" | "bad";
}

// ======================
// Component
// ======================
export default function WeatherSection() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [fullWeatherData, setFullWeatherData] = useState<any>(null);

  const fetchWeather = async () => {
  try {
    setLoading(true);
    setError(null);

    const address = await getAddress();
    if (!address?.latitude || !address?.longitude) {
      throw new Error("Location not available");
    }

    const response = await fetch(
      "https://florix-backend.vercel.app/api/v1/weather/getweather",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: address.latitude,
          longitude: address.longitude,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.log("🌩 Backend Error:", err);
      throw new Error("Weather API failed");
    }

    const data = await response.json();
    console.log("Data from API:", data);

    const apiData = data.data; // <--- Correct path to the weather data

    // Check if list exists
    if (!apiData.list || apiData.list.length === 0) {
      throw new Error("No weather data available");
    }

    // Take the first entry as "current"
    const current = apiData.list[0];

    const formattedWeather: WeatherData = {
      city: apiData.city.name,
      temperature: Math.round(current.main.temp),
      condition: current.weather[0].main,
      icon: current.weather[0].icon,
    };

    const advice = getWeatherAdvice(current);

    setWeatherData(formattedWeather);
    setRecommendations(advice);
    setFullWeatherData(apiData); // keep full response for modal
  } catch (err: any) {
    console.error("❌ Weather error:", err);
    setError(err.message || "Unable to load weather data");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchWeather();
  }, [retryCount]);

  const handleRetry = () => setRetryCount((prev) => prev + 1);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5D8A6F" />
      </View>
    );
  }

  if (error || !weatherData) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="cloud-offline-outline" size={40} color="#A1887F" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={handleRetry}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh-outline" size={20} color="#5D8A6F" />
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.weatherSection}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          activeOpacity={0.9}
        >
          <View style={styles.weatherCard}>
            <View style={styles.weatherHeader}>
              <Text style={styles.weatherCity}>{weatherData.city}</Text>
              {(() => {
                const icon = getWeatherIcon(
                  weatherData.condition,
                  weatherData.icon
                );
                return (
                  <Ionicons
                    name={icon.name as any}
                    size={28}
                    color={icon.color}
                  />
                );
              })()}
            </View>
            <Text style={styles.temperature}>{weatherData.temperature}°</Text>
            <Text style={styles.weatherCondition}>{weatherData.condition}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          activeOpacity={0.9}
        >
          <View style={styles.recommendationCard}>
            <Text style={styles.recommendationTitle}>Weather Advice</Text>
            {recommendations.map((item) => (
              <View key={item.id} style={styles.recommendationItem}>
                <Ionicons
                  name={
                    item.type === "good" ? "checkmark-circle" : "close-circle"
                  }
                  size={20}
                  color={item.type === "good" ? "#5D8A6F" : "#A1887F"}
                />
                <Text style={styles.recommendationText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </ScrollView>

      <WeatherDetailsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        weather={fullWeatherData!}
        recommendations={recommendations}
      />
    </View>
  );
}

// ======================
// Styles
// ======================
const styles = StyleSheet.create({
  weatherSection: { paddingHorizontal: 10, paddingVertical: 10 },
  weatherCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 15,
    marginRight: 15,
    marginLeft: 3,
    marginBottom: 15,
    width: 150,
    elevation: 2,
  },
  weatherHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  weatherCity: { fontSize: 16, fontWeight: "600", color: "#37474F" },
  temperature: { fontSize: 32, fontWeight: "300", color: "#37474F" },
  weatherCondition: { fontSize: 14, color: "#A1887F" },
  recommendationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    width: 170,
    elevation: 2,
  },
  recommendationTitle: { fontSize: 16, fontWeight: "600", marginBottom: 15, color: "#37474F" },
  recommendationItem: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  recommendationText: { marginLeft: 10, fontSize: 14, color: "#37474F" },
  center: { paddingVertical: 40, alignItems: "center" },
  errorContainer: { paddingVertical: 30, alignItems: "center", justifyContent: "center" },
  errorText: { color: "#A1887F", fontSize: 16, marginTop: 10, marginBottom: 20, textAlign: "center", paddingHorizontal: 20 },
  retryButton: { flexDirection: "row", alignItems: "center", backgroundColor: "transparent", borderWidth: 1, borderColor: "#5D8A6F", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8, gap: 6 },
  retryButtonText: { color: "#5D8A6F", fontSize: 14, fontWeight: "500" },
});


// ======================
// Styles
// ======================
// const styles = StyleSheet.create({
//   weatherSection: {
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//   },

//   weatherCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     padding: 15,
//     marginRight: 15,
//     marginLeft: 3,
//     marginBottom: 15,
//     width: 150,
//     elevation: 2,
//   },

//   weatherHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 10,
//   },

//   weatherCity: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#37474F",
//   },

//   temperature: {
//     fontSize: 32,
//     fontWeight: "300",
//     color: "#37474F",
//   },

//   weatherCondition: {
//     fontSize: 14,
//     color: "#A1887F",
//   },

//   recommendationCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     padding: 15,
//     marginBottom: 15,
//     width: 170,
//     elevation: 2,
//   },

//   recommendationTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 15,
//     color: "#37474F",
//   },

//   recommendationItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//   },

//   recommendationText: {
//     marginLeft: 10,
//     fontSize: 14,
//     color: "#37474F",
//   },

//   center: {
//     paddingVertical: 40,
//     alignItems: "center",
//   },

//   errorContainer: {
//     paddingVertical: 30,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   errorText: {
//     color: "#A1887F",
//     fontSize: 16,
//     marginTop: 10,
//     marginBottom: 20,
//     textAlign: "center",
//     paddingHorizontal: 20,
//   },

//   retryButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "transparent",
//     borderWidth: 1,
//     borderColor: "#5D8A6F",
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     gap: 6,
//   },

//   retryButtonText: {
//     color: "#5D8A6F",
//     fontSize: 14,
//     fontWeight: "500",
//   },
// });
