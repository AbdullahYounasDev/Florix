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
import { NextDaysForecast } from "./NextDaysForecast";

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
  const weatherDetails = useMemo(() => {
    if (!weather) return null;

    const current = weather.list[0];
    const main = current.main;
    const w = current.weather[0];
    const wind = current.wind;

    return {
      city: weather.city?.name ?? "Unknown",
      temp: Math.round(main?.temp ?? 0),
      feels: Math.round(main?.feels_like ?? 0),
      condition: w?.main ?? "Clear",
      desc: w?.description ?? "",
      humidity: main?.humidity ?? 0,
      windSpeed: wind?.speed ?? 0,
      windDeg: wind?.deg ?? 0,
      clouds: current.clouds?.all ?? 0,
      icon: w?.icon ?? "",
      rainChance: Math.round((current.pop ?? 0) * 100)
    };

  }, [weather]);

  if (!weatherDetails) return null;

  const getNextDays = (weather: any): any[] => {
  if (!weather || !weather.list) return [];

  const timezoneOffset = weather.city.timezone ?? 0; // seconds
  const daysMap: { [key: string]: any[] } = {};

  // Group all entries by local date
  weather.list.forEach((item: any) => {
    const localTime = new Date((item.dt + timezoneOffset) * 1000);
    const dateStr = `${localTime.getFullYear()}-${(localTime.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${localTime.getDate().toString().padStart(2, "0")}`;

    if (!daysMap[dateStr]) daysMap[dateStr] = [];
    daysMap[dateStr].push({ ...item, localTime });
  });

  // Get today in city timezone
  const now = new Date();
  const cityNow = new Date(now.getTime() + timezoneOffset * 1000);
  const todayStr = `${cityNow.getFullYear()}-${(cityNow.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${cityNow.getDate().toString().padStart(2, "0")}`;

  // Sort dates chronologically
  const sortedDates = Object.keys(daysMap).sort();

  // Skip today only if it has all 8 entries (full day), otherwise include it
  const nextDates: string[] = [];
  for (const date of sortedDates) {
    if (date === todayStr && daysMap[date].length < 8) {
      nextDates.push(date); // include partial today
    } else if (date !== todayStr) {
      nextDates.push(date);
    }
    if (nextDates.length >= 4) break; // only next 4 days
  }

  // Map to forecast objects
  return nextDates.map((date) => {
    const dayEntries = daysMap[date];

    // Prefer 12:00 PM entry
    const noonEntry = dayEntries.find((e) => e.localTime.getHours() === 12) || dayEntries[0];

    const temps = dayEntries.map((e) => e.main.temp);
    const rainChances = dayEntries.map((e) => e.pop ?? 0);

    const maxTemp = Math.round(Math.max(...temps));
    const minTemp = Math.round(Math.min(...temps));
    const rainChance = Math.round(Math.max(...rainChances) * 100);

    const dayName = noonEntry.localTime.toLocaleDateString("en-US", { weekday: "long" });

    return {
      date,
      day: dayName,
      temp: maxTemp,
      mintemp: minTemp,
      condition: noonEntry.weather[0].main,
      rainChance,
      icon: noonEntry.weather[0].icon,
    };
  });
  };



  const nextDays = getNextDays(weather);


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
        <ScrollView
          showsVerticalScrollIndicator={false}
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
                <Text style={styles.temp}>{weatherDetails.temp}°C</Text>
                <Text style={styles.feels}>
                  {new Date().toLocaleDateString("en-US", { weekday: "long" })}
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
                icon="rainy-outline"
                value={`${weatherDetails.rainChance}%`}
                label={`Rain`}
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
          {/* NEXT DAYS FORECAST SECTION */}
          <NextDaysForecast forecasts={nextDays} />
          {/* RECOMMENDATIONS SECTION */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.scrollContent}>
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
                  <View
                    style={[
                      styles.recoIconContainer,
                      { backgroundColor: item.type === "good" ? "#E8F5E8" : "#FFEBEE" },
                    ]}
                  >
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

                {/* Advice text */}
                <Text style={styles.recoText}>{item.text}</Text>

                {/* Reason text */}
                {item.reason ? (
                  <Text style={styles.recoReason}>{item.reason}</Text>
                ) : null}
              </Animated.View>
            ))}
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
  recoReason: {
  fontSize: 11,
  color: "#616161",
  lineHeight: 16,
  marginTop: 4,
},

});