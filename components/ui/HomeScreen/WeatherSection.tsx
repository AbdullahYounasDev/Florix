// components/WeatherSection.tsx
import { useLocation } from '@/contexts/LocationContext';
import { theme } from "@/utils/theme";
import { updateAddress } from "@/utils/userdata";
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
  const { locationData, locationVersion, refreshLocation } = useLocation();
  const [weatherData, setWeatherData] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fullWeatherData, setFullWeatherData] = useState<any>(null);

  const checkInternet = async (): Promise<boolean> => {
    try {
      const res = await fetch("https://www.google.com", { method: "HEAD" });
      return res.ok;
    } catch {
      return false;
    }
  };

  const getCoords = async (): Promise<{ latitude: number; longitude: number } | null> => {
    // First check if we have stored location
    if (locationData?.latitude && locationData?.longitude) {
      return { latitude: locationData.latitude, longitude: locationData.longitude };
    }

    // No stored location, request GPS
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorType("no_permission");
      return null;
    }

    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
      return coords;
    } catch {
      setErrorType("location_failed");
      return null;
    }
  };

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setErrorType(null);

      const hasInternet = await checkInternet();
      if (!hasInternet) {
        setErrorType("no_internet");
        return;
      }

      const coords = await getCoords();
      if (!coords) return;

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
        city: apiData.city,
        country: apiData.country,
        temp: apiData.today.temp,
        condition: apiData.today.condition,
        isDay: apiData.today.isDay,
        timeOfDay: apiData.today.timeOfDay,
        humidity: apiData.today.humidity,
        windSpeed: apiData.today.windSpeed,
        feels: apiData.today.feels,
        desc: apiData.today.desc,
        clouds: apiData.today.clouds,
        rainChance: apiData.today.rainChance,
      });

      setRecommendations(getWeatherAdvice(apiData.today));
      setFullWeatherData(apiData);
      await updateAddress({ city: apiData.city, country: apiData.country, ...coords });
      refreshLocation(); // Update context with new location
    } catch {
      setErrorType("unknown");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [locationVersion]);

  if (loading) {
    return (
      <View style={styles.loadingCard}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Fetching Weather...</Text>
      </View>
    );
  }

  if (errorType || !weatherData) {
    const errorConfig = {
      no_internet: { icon: "cloud-offline-outline", title: "No Connection", subtitle: "Check your internet to fetch forecast" },
      location_failed: { icon: "location-outline", title: "Location Required", subtitle: "Please set your location in settings" },
      api_failed: { icon: "server-outline", title: "Service Down", subtitle: "Weather service is temporarily unavailable" },
      unknown: { icon: "warning-outline", title: "Something Went Wrong", subtitle: "Couldn't load weather data" },
    };

    const cfg = errorConfig[errorType ?? "unknown"];

    return (
      <TouchableOpacity style={styles.errorCard} onPress={fetchWeather} activeOpacity={0.8}>
        <Ionicons name={cfg.icon as any} size={48} color={theme.colors.primary} />
        <Text style={styles.errorTitle}>{cfg.title}</Text>
        <Text style={styles.errorSubtitle}>{cfg.subtitle}</Text>
        <View style={styles.retryBadge}>
          <Ionicons name="refresh" size={14} color={theme.colors.fourthly} />
          <Text style={styles.retryText}>Tap to Retry</Text>
        </View>
      </TouchableOpacity>
    );
  }

  const icon = getWeatherIcon(weatherData.condition, weatherData.isDay ? "01d" : "01n");

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.card} onPress={() => setModalVisible(true)} activeOpacity={0.95}>
        <View style={styles.topRow}>
          <View style={styles.locationBadge}>
            <Ionicons name="location" size={14} color={theme.colors.primary} />
            <Text style={styles.locationText} numberOfLines={1}>
              {weatherData.city}, {weatherData.country}
            </Text>
          </View>
          <View style={styles.timeBadge}>
            <Ionicons
              name={weatherData.isDay ? "sunny-outline" : "moon-outline"}
              size={14}
              color={theme.colors.secondary}
            />
            <Text style={styles.timeText}>{weatherData.timeOfDay}</Text>
          </View>
        </View>

        <View style={styles.mainWeather}>
          <View style={styles.tempSection}>
            <Text style={styles.temperature}>{weatherData.temp}°</Text>
            <Text style={styles.conditionText}>{weatherData.desc}</Text>
          </View>
          <View style={styles.iconSection}>
            <Ionicons name={icon.name as any} size={64} color={icon.color} />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="water-outline" size={15} color={theme.colors.secondary} />
            <Text style={styles.statValue}>{weatherData.humidity}%</Text>
            <Text style={styles.statLabel}>Humidity</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="speedometer-outline" size={15} color={theme.colors.secondary} />
            <Text style={styles.statValue}>{weatherData.windSpeed} m/s</Text>
            <Text style={styles.statLabel}>Wind</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="rainy-outline" size={15} color={theme.colors.secondary} />
            <Text style={styles.statValue}>{weatherData.rainChance}%</Text>
            <Text style={styles.statLabel}>Rain</Text>
          </View>
        </View>

        <View style={styles.tapIndicator}>
          <Text style={styles.tapText}>Tap for details</Text>
          <Ionicons name="chevron-forward" size={14} color={theme.colors.secondary} />
        </View>
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
  wrapper: {
    width: '100%',
  },
  card: {
    backgroundColor: theme.colors.fourthly,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    padding: 18,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
      },
      android: { elevation: 1 },
    }),
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.fourthly,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.tertiary,
    flex: 1,
    marginRight: 12,
  },
  locationText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.secondary,
    flex: 1,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.fourthly,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.tertiary,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.secondary,
    opacity: 0.8,
  },
  mainWeather: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  tempSection: {
    flex: 1,
  },
  temperature: {
    fontSize: 56,
    fontWeight: '300',
    color: theme.colors.secondary,
    letterSpacing: -2,
    lineHeight: 64,
  },
  conditionText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.secondary,
    opacity: 0.7,
    marginTop: 4,
  },
  iconSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.tertiary,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: theme.colors.secondary,
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.fourthly,
    opacity: 0.5,
  },
  tapIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    opacity: 0.5,
  },
  tapText: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.colors.secondary,
  },
  loadingCard: {
    backgroundColor: theme.colors.fourthly,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
      },
      android: { elevation: 1 },
    }),
  },
  loadingText: {
    fontSize: 14,
    color: theme.colors.secondary,
    opacity: 0.6,
    fontWeight: '500',
  },
  errorCard: {
    backgroundColor: theme.colors.fourthly,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    padding: 32,
    marginBottom: 20,
    alignItems: 'center',
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
      },
      android: { elevation: 1 },
    }),
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.secondary,
    marginTop: 4,
  },
  errorSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: theme.colors.secondary,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  retryText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.fourthly,
  },
});