import { Recommendation } from "@/utils/weatherAdvice";
import { getWeatherIcon } from "@/utils/weatherIcon";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

interface Props {
  visible: boolean;
  onClose: () => void;
  weather: any | null;
  recommendations: Recommendation[];
}

const { width } = Dimensions.get("window");

// Weather condition themes
const WEATHER_THEMES = {
  Clear: {
    primary: "#FFB74D", // Sunny orange
    secondary: "#FF9800",
    gradient: ["#FFE0B2", "#FFF3E0"],
    cardBg: "#FFFFFF",
  },
  Clouds: {
    primary: "#90A4AE", // Cloudy gray
    secondary: "#78909C",
    gradient: ["#ECEFF1", "#F5F7FA"],
    cardBg: "#FFFFFF",
  },
  Rain: {
    primary: "#64B5F6", // Rainy blue
    secondary: "#42A5F5",
    gradient: ["#E3F2FD", "#F3F9FF"],
    cardBg: "#FFFFFF",
  },
  Snow: {
    primary: "#81D4FA", // Snow blue
    secondary: "#4FC3F7",
    gradient: ["#E1F5FE", "#F4FAFE"],
    cardBg: "#FFFFFF",
  },
  Thunderstorm: {
    primary: "#7986CB", // Storm purple
    secondary: "#5C6BC0",
    gradient: ["#E8EAF6", "#F5F7FF"],
    cardBg: "#FFFFFF",
  },
  Drizzle: {
    primary: "#4DB6AC", // Mist teal
    secondary: "#26A69A",
    gradient: ["#E0F2F1", "#F1F9F8"],
    cardBg: "#FFFFFF",
  },
  default: {
    primary: "#5D8A6F", // Sage Green
    secondary: "#4A7660",
    gradient: ["#E8F5E8", "#FAFAFA"],
    cardBg: "#FFFFFF",
  },
};

export default function WeatherDetailsModal({
  visible,
  onClose,
  weather,
  recommendations,
}: Props) {
  console.log(weather)
  const weatherDetails = useMemo(() => {
    if (!weather) return null;

    const main = weather.main || {};
    const wind = weather.wind || {};
    const w = weather.weather?.[0] || {};

    return {
      city: weather.name ?? "Unknown",
      temp: Math.round(main.temp ?? 0),
      feels: Math.round(main.feels_like ?? 0),
      condition: w.main ?? "Clear",
      desc: w.description ?? "",
      humidity: main.humidity ?? 0,
      windSpeed: wind.speed ?? 0,
      windDeg: wind.deg ?? 0,
      clouds: weather.clouds?.all ?? 0,
      pressure: main.pressure ?? 0,
      visibility: Math.round((weather.visibility ?? 0) / 1000),
      icon: w.icon ?? "",
      sunrise: weather.sys?.sunrise ? new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--',
      sunset: weather.sys?.sunset ? new Date(weather.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--',
    };
  }, [weather]);

  if (!weatherDetails) return null;

  const getWindDir = (d: number) =>
    ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.round(d / 45) % 8];

  const weatherIcon = getWeatherIcon(
    weatherDetails.condition,
    weatherDetails.icon
  );

  // Get theme based on weather condition
  const theme = WEATHER_THEMES[weatherDetails.condition as keyof typeof WEATHER_THEMES] || WEATHER_THEMES.default;

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={theme.gradient as any}
        style={styles.container}
      >
        {/* HEADER */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={[styles.header, { backgroundColor: theme.primary }]}
        >
          <TouchableOpacity
            onPress={onClose}
            style={styles.backButton}
          >
            <Ionicons name="chevron-down" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.city}>{weatherDetails.city}</Text>
            <Text style={styles.condition}>{weatherDetails.desc}</Text>
          </View>

          <View style={styles.headerRight}>
            <Text style={styles.currentTime}>
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </Text>
          </View>

        </Animated.View>

        {/* MAIN WEATHER CARD */}
        <Animated.View
          entering={FadeIn.delay(200).duration(500)}
          style={[styles.mainCard, { backgroundColor: theme.cardBg }]}
        >
          <View style={styles.weatherMain}>
            <View style={styles.weatherIconContainer}>
              <Ionicons
                name={weatherIcon.name as any}
                size={64}
                color={theme.primary}
              />
            </View>

            <View style={styles.tempContainer}>
              <Text style={styles.temp}>{weatherDetails.temp}°</Text>
              <Text style={styles.feels}>
                Feels like {weatherDetails.feels}°
              </Text>
            </View>
          </View>

          {/* WEATHER METRICS GRID */}
          <View style={styles.metricsGrid}>
            <MetricItem
              icon="water-outline"
              value={`${weatherDetails.humidity}%`}
              label="Humidity"
              color={theme.primary}
            />
            <MetricItem
              icon="flag-outline"
              value={`${weatherDetails.windSpeed} m/s`}
              label={`Wind ${getWindDir(weatherDetails.windDeg)}`}
              color={theme.primary}
            />
            <MetricItem
              icon="cloud-outline"
              value={`${weatherDetails.clouds}%`}
              label="Cloud Cover"
              color={theme.primary}
            />
          </View>
        </Animated.View>

        {/* RECOMMENDATIONS SECTION */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View entering={FadeInDown.delay(400)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Farming Recommendations</Text>
            </View>

            {recommendations.map((item, index) => (
              <Animated.View
                key={item.id}
                entering={FadeInDown.delay(500 + index * 100)}
                style={[
                  styles.recoCard,
                  item.type === "good" ? styles.goodCard : styles.badCard,
                ]}
              >
                <View style={styles.recoHeader}>
                  <View style={[
                    styles.recoIconContainer,
                    { backgroundColor: item.type === "good" ? "#E8F5E8" : "#FFEBEE" }
                  ]}>
                    <Ionicons
                      name={item.type === "good" ? "checkmark-circle" : "close-circle"}
                      size={20}
                      color={item.type === "good" ? "#2E7D32" : "#C62828"}
                    />
                  </View>
                  <Text style={styles.recoType}>
                    {item.type === "good" ? "Recommended" : "Not Recommended"}
                  </Text>
                </View>
                <Text style={styles.recoText}>{item.text}</Text>
              </Animated.View>
            ))}
          </Animated.View>

          {/* INFO FOOTER */}
          <Animated.View
            entering={FadeInDown.delay(800)}
            style={styles.infoFooter}
          >
            <Ionicons name="information-circle-outline" size={18} color="#A1887F" />
            <Text style={styles.infoText}>
              Weather updates automatically. Farming advice is optimized based on current conditions.
            </Text>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </Modal>
  );
}

/* METRIC ITEM COMPONENT */
const MetricItem = ({
  icon,
  value,
  label,
  color,
}: {
  icon: string;
  value: string;
  label: string;
  color: string;
}) => (
  <View style={styles.metricItem}>
    <View style={[styles.metricIconContainer, { backgroundColor: `${color}15` }]}>
      <Ionicons name={icon as any} size={18} color={color} />
    </View>
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    alignItems: "center",
  },
  headerRight: {
    width: 40,
  },
  city: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  condition: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    textTransform: "capitalize",
    marginTop: 2,
  },
  currentTime: {
    fontSize: 10,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },
  mainCard: {
    margin: 20,
    marginTop: -10,
    borderRadius: 24,
    padding: 24,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  weatherMain: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  weatherIconContainer: {
    marginRight: 20,
  },
  tempContainer: {
    flex: 1,
  },
  temp: {
    fontSize: 56,
    fontWeight: "300",
    color: "#37474F",
    letterSpacing: -1,
  },
  feels: {
    fontSize: 14,
    color: "#A1887F",
    fontWeight: "500",
    marginTop: -6,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  metricItem: {
    width: (width - 88) / 3,
    alignItems: "center",
    marginBottom: 20,
  },
  metricIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#37474F",
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 11,
    color: "#A1887F",
    textAlign: "center",
    fontWeight: "500",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#37474F",
    marginLeft: 8,
  },
  recoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  goodCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#5D8A6F",
  },
  badCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#EF5350",
  },
  recoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  recoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  recoType: {
    fontSize: 12,
    fontWeight: "600",
    color: "#37474F",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  recoText: {
    fontSize: 13,
    color: "#37474F",
    lineHeight: 18,
  },
  infoFooter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  infoText: {
    fontSize: 12,
    color: "#A1887F",
    marginLeft: 10,
    flex: 1,
    lineHeight: 16,
  },
});