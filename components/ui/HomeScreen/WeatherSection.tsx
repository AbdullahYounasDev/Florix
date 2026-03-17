import { theme } from "@/utils/theme";
import { getAddress, updateAddress } from "@/utils/userdata";
import { getWeatherAdvice } from "@/utils/weatherAdvice";
import { getWeatherIcon } from "@/utils/weatherIcon";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import WeatherDetailsModal from "./weather/WeatherDetailsModal";

// ======================
// Component
// ======================
export default function WeatherSection() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
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
      if (!address?.latitude || !address?.longitude) throw new Error("Location not available");

      const response = await fetch("https://florix-backend.vercel.app/api/v1/weather/getweather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: address.latitude, longitude: address.longitude }),
      });

      if (!response.ok) throw new Error("Weather API failed");
      const data = await response.json();
      const apiData = data.data;
      const current = apiData.list[0];

      setWeatherData({
        city: apiData.city.name,
        temp: Math.round(current.main.temp),
        condition: current.weather[0].main,
        iconCode: current.weather[0].icon,
      });

      setRecommendations(getWeatherAdvice(current));
      setFullWeatherData(apiData);

      await updateAddress({ city: apiData.city.name, country: apiData.city.country, ...address });
    } catch (err: any) {
      setError(err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWeather(); }, [retryCount]);

  if (loading) return <View style={styles.center}><ActivityIndicator color="#5D8A6F" /></View>;

  if (error || !weatherData) {
    return (
      <TouchableOpacity
        style={styles.retryCard}
        onPress={() => setRetryCount(c => c + 1)}
        activeOpacity={0.85}
      >
        <Ionicons name="cloud-offline-outline" size={26} color="#D84315" />

        <View style={styles.retryTextWrapper}>
          <Text style={styles.retryTitle}>Weather unavailable</Text>
          <Text style={styles.retrySubtitle}>
            Tap to refresh and try again
          </Text>
        </View>

        <Ionicons name="refresh-outline" size={20} color={theme.colors.secondary} />
      </TouchableOpacity>
    );
  }


  const icon = getWeatherIcon(weatherData.condition, weatherData.iconCode);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.mainContainer}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        {/* Left Side: Weather Brief */}
        <View style={styles.leftSection}>
          <Text style={styles.cityText}>{weatherData.city}</Text>
          <View style={styles.tempRow}>
            <Ionicons name={icon.name as any} size={24} color={icon.color} />
            <Text style={styles.tempText}>{weatherData.temp}°C</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Right Side: Farming Advice */}
        <View style={styles.rightSection}>
          <Text style={styles.adviceLabel}>Farmer's Guide</Text>
          {recommendations.slice(0, 1).map((item) => (
            <View key={item.id} style={styles.adviceRow}>
              <Ionicons
                name={item.type === "good" ? "checkmark-circle" : "alert-circle"}
                size={16}
                color={item.type === "good" ? "#5D8A6F" : "#D84315"}
              />
              <Text numberOfLines={1} style={styles.adviceText}>{item.text}</Text>
            </View>
          ))}
        </View>

        <Ionicons name="chevron-forward" size={18} color="#2C3E50" />
      </TouchableOpacity>

      <WeatherDetailsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        weather={fullWeatherData!}
        recommendations={recommendations}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 8,
    marginBottom: 2,
  },
  retryCard: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#FFFFFF",
  borderRadius: 18,
  marginVertical:10,
  marginHorizontal:14,
  paddingVertical: 14,
  paddingHorizontal: 16,
  gap: 12,

  ...Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
    },
    android: {
      elevation: 2,
    },
  }),
},

retryTextWrapper: {
  flex: 1,
},

retryTitle: {
  fontSize: 15,
  fontWeight: "600",
  color: theme.colors.secondary,
},

retrySubtitle: {
  fontSize: 12,
  color: theme.colors.secondary,
  marginTop: 2,
},

  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20, // Rounded corners
    padding: 16,
    // Soft Shadow
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 1 },
    }),
    marginBottom: 14,
  },
  leftSection: {
    flex: 1,
  },
  cityText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2C3E50",
    textTransform: "uppercase",
  },
  tempRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 8,
  },
  tempText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  divider: {
    width: 1,
    height: "100%",
    backgroundColor: "#F0F0F0",
    marginHorizontal: 12,
  },
  rightSection: {
    flex: 2,
    justifyContent: "center",
  },
  adviceLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#5D8A6F",
    marginBottom: 4,
  },
  adviceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  adviceText: {
    fontSize: 14,
    color: "#2C3E50",
    flex: 1,
  },
  center: {
    height: 80,
    justifyContent: "center",
  },
  errorText: {
    color: "#D84315",
    textAlign: "center",
    width: "100%",
    fontWeight: "500",
  },
});