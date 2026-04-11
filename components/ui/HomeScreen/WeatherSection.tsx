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
  const [loadingStage, setLoadingStage] = useState<'connecting' | 'locating' | 'fetching'>('connecting');

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

    setLoadingStage('locating');
    
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
      setLoadingStage('connecting');

      // 1. Internet check
      const hasInternet = await checkInternet();
      if (!hasInternet) {
        setErrorType("no_internet");
        return;
      }

      // 2. Get coordinates
      const coords = await getCoords();
      if (!coords) return; // error already set inside getCoords

      setLoadingStage('fetching');

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

  // ─── Loading State ─────────────────────────────────────────────
  if (loading) {
    const loadingMessages = {
      connecting: {
        title: "Connecting...",
        subtitle: "Establishing connection to weather service",
      },
      locating: {
        title: "Locating...",
        subtitle: "Finding your current location",
      },
      fetching: {
        title: "Fetching...",
        subtitle: "Getting latest weather data",
      },
    };

    const currentStage = loadingMessages[loadingStage];

    return (
      <View style={styles.loadingCard}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
        <View style={styles.loadingContent}>
          <Text style={styles.loadingTitle}>{currentStage.title}</Text>
          <Text style={styles.loadingSubtitle}>{currentStage.subtitle}</Text>
        </View>
      </View>
    );
  }

  // ─── Error States ─────────────────────────────────────────────
  if (errorType || !weatherData) {
    const errorConfig = {
      no_internet: {
        title: "No connection",
        subtitle: "Check internet to fetch forecast",
        color: "#E74C3C",
      },
      no_permission: {
        title: "Location off",
        subtitle: "Enable location for local weather",
        color: "#E74C3C",
      },
      location_failed: {
        title: "Can't find you",
        subtitle: "Unable to get current location",
        color: "#E74C3C",
      },
      api_failed: {
        title: "Forecast unavailable",
        subtitle: "Weather service is down",
        color: "#E74C3C",
      },
      unknown: {
        title: "Weather error",
        subtitle: "Couldn't load forecast",
        color: "#E74C3C",
      },
    };

    const cfg = errorConfig[errorType ?? "unknown"];

    return (
      <TouchableOpacity
        style={styles.errorCard}
        onPress={() => setRetryCount(c => c + 1)}
        activeOpacity={0.7}
      >
        <View style={styles.errorContent}>
          <View style={styles.errorHeader}>
            <Ionicons 
              name="cloud-offline-outline"
              size={20} 
              color={cfg.color} 
            />
            <Text style={[styles.errorTitle, { color: theme.colors.secondary }]}>
              {cfg.title}
            </Text>
          </View>
          <Text style={styles.errorSubtitle}>{cfg.subtitle}</Text>
          <View style={styles.retryButton}>
            <Text style={[styles.retryButtonText, { color: theme.colors.primary }]}>
              Refresh
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
    marginTop: 0,
    marginBottom: 2,
  },
  
  // Loading Styles
  loadingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.fourthly,
    borderRadius: 20,
    marginVertical: 10,
    marginHorizontal: 14,
    padding: 16,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  loadingContent: {
    flex: 1,
  },
  loadingTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.secondary,
    marginBottom: 2,
  },
  loadingSubtitle: {
    fontSize: 12,
    color: theme.colors.secondary,
    opacity: 0.7,
  },
  
  // Error Styles
  errorCard: {
    backgroundColor: theme.colors.fourthly,
    borderRadius: 20,
    marginVertical: 10,
    marginHorizontal: 14,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  errorContent: {
    gap: 8,
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  errorSubtitle: {
    fontSize: 13,
    color: theme.colors.secondary,
    opacity: 0.7,
    lineHeight: 18,
    paddingLeft: 28,
  },
  retryButton: {
    paddingLeft: 28,
    paddingTop: 4,
  },
  retryButtonText: {
    fontSize: 13,
    fontWeight: '500',
  },

  // Success Styles
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.fourthly,
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
    color: theme.colors.secondary,
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
    color: theme.colors.secondary,
  },
  divider: {
    width: 1,
    height: "100%",
    backgroundColor: theme.colors.tertiary,
    marginHorizontal: 12,
  },
  rightSection: {
    flex: 2,
    justifyContent: "center",
  },
  adviceLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.primary,
    marginBottom: 4,
  },
  adviceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  adviceText: {
    fontSize: 14,
    color: theme.colors.secondary,
    flex: 1,
  },
})