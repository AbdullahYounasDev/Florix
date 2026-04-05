import { theme } from "@/utils/theme";
import { getAddress, updateAddress } from "@/utils/userdata";
import { getWeatherAdvice } from "@/utils/weatherAdvice";
import { getWeatherIcon } from "@/utils/weatherIcon";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import WeatherDetailsModal from "./weather/WeatherDetailsModal";

type ErrorType = "no_internet" | "no_permission" | "location_failed" | "api_failed" | "unknown";

export default function WeatherSection() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [fullWeatherData, setFullWeatherData] = useState<any>(null);

  // ─── Check Internet ───────────────────────────────────────────
  const checkInternet = async (): Promise<boolean> => {
    try {
      const res = await fetch("https://www.google.com", { method: "HEAD" });
      return res.ok;
    } catch {
      return false;
    }
  };

  // ─── Get Coords (from storage or device) ─────────────────────
  const getCoords = async (): Promise<{ latitude: number; longitude: number } | null> => {
    // 1. Try stored coords first
    const stored = await getAddress();
    if (stored?.latitude && stored?.longitude) {
      return { latitude: stored.latitude, longitude: stored.longitude };
    }

    // 2. Request location permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorType("no_permission");
      return null;
    }

    // 3. Get device location
    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const coords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      // Save for next time
      await updateAddress({ ...coords });
      return coords;
    } catch {
      setErrorType("location_failed");
      return null;
    }
  };

  // ─── Fetch Weather ────────────────────────────────────────────
  const fetchWeather = async () => {
    try {
      setLoading(true);
      setErrorType(null);

      // 1. Internet check
      const hasInternet = await checkInternet();
      if (!hasInternet) {
        setErrorType("no_internet");
        return;
      }

      // 2. Get coordinates
      const coords = await getCoords();
      if (!coords) return; // error already set inside getCoords

      // 3. Fetch weather API
      const response = await fetch("https://florix-backend.vercel.app/api/v1/weather/getweather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coords),
      });

      if (!response.ok) {
        setErrorType("api_failed");
        return;
      }

      const data = await response.json();
      const apiData = data.data;

      setWeatherData({
        city:      apiData.city,
        country:   apiData.country,
        temp:      apiData.today.temp,
        condition: apiData.today.condition,
        isDay:     apiData.today.isDay,
        timeOfDay: apiData.today.timeOfDay,
      });

      setRecommendations(getWeatherAdvice(apiData.today));
      setFullWeatherData(apiData);

      await updateAddress({ city: apiData.city, country: apiData.country, ...coords });
    } catch {
      setErrorType("unknown");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWeather(); }, [retryCount]);

  // ─── Loading ──────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#5D8A6F" />
        <Text style={styles.loadingText}>Getting weather...</Text>
      </View>
    );
  }

  // ─── Error States ─────────────────────────────────────────────
  if (errorType || !weatherData) {
    const errorConfig = {
      no_internet: {
        icon: "wifi-outline" as const,
        title: "No Internet",
        subtitle: "Check your connection and tap to retry",
        color: "#E53935",
      },
      no_permission: {
        icon: "location-outline" as const,
        title: "Location Access Denied",
        subtitle: "Allow location permission and tap to retry",
        color: "#F57C00",
      },
      location_failed: {
        icon: "navigate-outline" as const,
        title: "Location Unavailable",
        subtitle: "Couldn't get your location. Tap to retry",
        color: "#F57C00",
      },
      api_failed: {
        icon: "cloud-offline-outline" as const,
        title: "Weather Unavailable",
        subtitle: "Server error. Tap to try again",
        color: "#D84315",
      },
      unknown: {
        icon: "alert-circle-outline" as const,
        title: "Something Went Wrong",
        subtitle: "Tap to try again",
        color: "#D84315",
      },
    };

    const cfg = errorConfig[errorType ?? "unknown"];

    return (
      <TouchableOpacity
        style={styles.retryCard}
        onPress={() => setRetryCount(c => c + 1)}
        activeOpacity={0.85}
      >
        <View style={[styles.errorIconWrapper, { backgroundColor: `${cfg.color}15` }]}>
          <Ionicons name={cfg.icon} size={24} color={cfg.color} />
        </View>

        <View style={styles.retryTextWrapper}>
          <Text style={[styles.retryTitle, { color: cfg.color }]}>{cfg.title}</Text>
          <Text style={styles.retrySubtitle}>{cfg.subtitle}</Text>
        </View>

        <View style={styles.refreshBadge}>
          <Ionicons name="refresh-outline" size={16} color={theme.colors.secondary} />
        </View>
      </TouchableOpacity>
    );
  }

  // ─── Success ──────────────────────────────────────────────────
  const icon = getWeatherIcon(weatherData.condition, weatherData.isDay ? "01d" : "01n");

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.mainContainer}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        {/* Left Side */}
        <View style={styles.leftSection}>
          <Text style={styles.cityText}>{weatherData.city}</Text>
          <View style={styles.tempRow}>
            <Ionicons name={icon.name as any} size={24} color={icon.color} />
            <Text style={styles.tempText}>{weatherData.temp}°C</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Right Side */}
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
    // marginVertical: 8,
    marginTop:0,
    marginBottom: 2,
  },
  center: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    color: theme.colors.secondary,
    fontWeight: "500",
  },
  retryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginVertical: 10,
    marginHorizontal: 14,
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
      android: { elevation: 2 },
    }),
  },
  errorIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  retryTextWrapper: {
    flex: 1,
  },
  retryTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  retrySubtitle: {
    fontSize: 12,
    color: theme.colors.secondary,
    marginTop: 2,
  },
  refreshBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
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
});