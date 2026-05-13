import { theme, WEATHER_THEMES } from "@/utils/theme";
import { Recommendation } from "@/utils/weatherAdvice";
import { getWeatherIcon } from "@/utils/weatherIcon";
import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useRef } from "react";
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
import { HourlyWeatherToday } from "./HorlyWeatherToday";
import { NextDaysForecast } from "./NextDaysForecast";

interface Props {
  visible: boolean;
  onClose: () => void;
  weather: any | null;
  recommendations: Recommendation[];
}

const { width } = Dimensions.get("window");

export default function WeatherDetailsModal({
  visible,
  onClose,
  weather,
  recommendations,
}: Props) {
  const scrollViewRef = useRef<ScrollView>(null);

  const weatherDetails = useMemo(() => {
    if (!weather) return null;
    return {
      city:       weather.city ?? "Unknown",
      country:    weather.country ?? "",
      temp:       weather.today.temp,
      feels:      weather.today.feels,
      condition:  weather.today.condition,
      desc:       weather.today.desc,
      humidity:   weather.today.humidity,
      windSpeed:  weather.today.windSpeed,
      windDeg:    weather.today.windDeg,
      clouds:     weather.today.clouds,
      rainChance: weather.today.rainChance,
      isDay:      weather.today.isDay,
      timeOfDay:  weather.today.timeOfDay,
    };
  }, [weather]);

  if (!weatherDetails) return null;

  const nextDays = (weather?.forecast ?? []).map((item: any) => ({
    date:       item.date,
    day:        new Date(item.date).toLocaleDateString("en-US", { weekday: "long" }),
    temp:       item.tempMax,
    mintemp:    item.tempMin,
    condition:  item.condition,
    rainChance: item.rainChance,
    icon:       weatherDetails.isDay ? "01d" : "01n",
  }));

  const isNight = !weatherDetails.isDay;

  const weatherIcon = getWeatherIcon(
    weatherDetails.condition,
    isNight ? "01n" : "01d"
  );

  const themeKey = isNight
    ? `${weatherDetails.condition}Night`
    : weatherDetails.condition;

  const weatherTheme =
    WEATHER_THEMES[themeKey as keyof typeof WEATHER_THEMES] ||
    (isNight ? WEATHER_THEMES.defaultNight : WEATHER_THEMES.default);

  const now = new Date();
  const timeString = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const dateString = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={weatherTheme.gradient as any} style={styles.container}>
        {/* Sticky Header */}
        <LinearGradient
          colors={[weatherTheme.primary, weatherTheme.secondary]}
          style={styles.stickyHeader}
        >
          {/* Close button */}
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Feather name="x" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Center: location */}
          <View style={styles.headerCenter}>
            <View style={styles.locationRow}>
              <Text style={styles.city}>{weatherDetails.city}</Text>
              <Text style={styles.country}>{weatherDetails.country}</Text>
            </View>
          </View>

          {/* Right: live clock + date */}
          <View style={styles.headerRight}>
            <Text style={styles.clockText}>{timeString}</Text>
            <Text style={styles.dateText}>{dateString}</Text>
          </View>
        </LinearGradient>

        <ScrollView 
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContentContainer}
        >
          {/* ── MAIN WEATHER CARD ── */}
          <Animated.View
            entering={FadeIn.delay(200).duration(500)}
            style={[styles.mainCard, { backgroundColor: weatherTheme.cardBg }]}
          >
            {/* Icon + Temp row */}
            <View style={styles.weatherMain}>
              <View style={styles.weatherIconContainer}>
                <Ionicons
                  name={weatherIcon.name as any}
                  size={72}
                  color={weatherTheme.primary}
                />
                <Text style={styles.conditionLabel}>{weatherDetails.desc}</Text>
              </View>

              <View style={styles.tempContainer}>
                <Text style={styles.temp}>{weatherDetails.temp}°C</Text>
                <Text style={styles.feelsLabel}>
                  Feels like{" "}
                  <Text style={styles.feelsValue}>{weatherDetails.feels}°C</Text>
                </Text>
                <Text style={styles.windRow}>
                  <FontAwesome5 name="wind"/> {weatherDetails.windSpeed} km/h
                </Text>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Metrics */}
            <View style={styles.metricsGrid}>
              <MetricItem
                icon="water-outline"
                value={`${weatherDetails.humidity}%`}
                label="Humidity"
                color={weatherTheme.primary}
              />
              <MetricItem
                icon="rainy-outline"
                value={`${weatherDetails.rainChance}%`}
                label="Rain"
                color={weatherTheme.primary}
              />
              <MetricItem
                icon="cloud-outline"
                value={`${weatherDetails.clouds}%`}
                label="Cloud"
                color={weatherTheme.primary}
              />
            </View>
          </Animated.View>

          {/* ── HOURLY ── */}
          <HourlyWeatherToday hourly={weather?.hourly ?? []} />

          {/* ── 7 DAY FORECAST ── */}
          <NextDaysForecast forecasts={nextDays} />

          {/* ── RECOMMENDATIONS ── */}
          <Animated.View
            entering={FadeInDown.delay(400)}
            style={styles.recommendationsContainer}
          >
            <View style={styles.sectionHeader}>
              <Ionicons name="leaf-outline" size={16} color={isNight ? "#fff" : "#5D8A6F"} />
              <Text style={isNight ? styles.nightSectionTitle : styles.sectionTitle}>
                Farming Recommendations
              </Text>
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
                      color={item.type === "good" ? "#5D8A6F" : "#C62828"}
                    />
                  </View>
                  <Text style={styles.recoType}>
                    {item.type === "good" ? "Recommended" : "Not Recommended"}
                  </Text>
                </View>
                <Text style={styles.recoText}>{item.text}</Text>
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

/* ── METRIC ITEM ── */
const MetricItem = ({
  icon, value, label, color,
}: {
  icon: string; value: string; label: string; color: string;
}) => (
  <View style={styles.metricItem}>
    <View style={[styles.metricIconContainer, { backgroundColor: `${color}18` }]}>
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

  // ── STICKY HEADER ──
  stickyHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 16,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 8,
  },
  locationRow: {
    flexDirection: "column",
    alignItems: "center",
    gap: 0,
  },
  city: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  country: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "500",
  },
  headerRight: {
    alignItems: "flex-end",
    minWidth: 60,
  },
  clockText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  dateText: {
    fontSize: 10,
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
    fontWeight: "500",
  },

  scrollContentContainer: {
    paddingTop: 120, // Space for sticky header
    paddingBottom: 30,
  },

  // ── MAIN CARD ──
  mainCard: {
    margin: 20,
    marginTop: 16,
    borderRadius: 24,
    padding: 22,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  weatherMain: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  weatherIconContainer: {
    alignItems: "center",
    marginRight: 20,
  },
  conditionLabel: {
    fontSize: 11,
    color: theme.colors.secondary,
    marginTop: 4,
    textTransform: "capitalize",
    fontWeight: "500",
  },
  tempContainer: {
    flex: 1,
  },
  temp: {
    fontSize: 54,
    fontWeight: "300",
    color: theme.colors.secondary,
    letterSpacing: -1,
  },
  feelsLabel: {
    fontSize: 13,
    color: theme.colors.secondary,
    fontWeight: "400",
    marginTop: -4,
  },
  feelsValue: {
    fontWeight: "600",
    color: theme.colors.secondary
  },
  windRow: {
    fontSize: 12,
    color: theme.colors.secondary,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricItem: {
    width: (width - 88) / 3,
    alignItems: "center",
  },
  metricIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.secondary,
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 10,
    color: theme.colors.secondary,
    textAlign: "center",
    fontWeight: "500",
  },

  // ── RECOMMENDATIONS ──
  recommendationsContainer: {
    paddingBottom:30,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.secondary
  },
  nightSectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
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
    color: theme.colors.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  recoText: {
    fontSize: 13,
    color: theme.colors.secondary,
    lineHeight: 18,
    fontWeight: "600",
  },
  recoReason: {
    fontSize: 11,
    color: theme.colors.secondary,
    lineHeight: 16,
    marginTop: 4,
  },
});