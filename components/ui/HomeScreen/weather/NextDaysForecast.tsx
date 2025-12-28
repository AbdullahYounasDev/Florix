import { getWeatherIcon } from "@/utils/weatherIcon";
import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface ForecastItem {
  date: string;
  day: string;
  temp: number;
  mintemp: number;
  condition: string;
  rainChance: number;
  icon: string;
}

// Add this component inside the WeatherDetailsModal component, before the Recommendations section
export const NextDaysForecast = ({ forecasts }: { forecasts: ForecastItem[] }) => {
  if (!forecasts || forecasts.length === 0) return null;

  return (
    <Animated.View 
      entering={FadeInDown.delay(300)}
      style={styles.forecastContainer}
    >
      <View style={styles.forecastHeader}>
        <Ionicons name="calendar-outline" size={18} color="#5D8A6F" />
        <Text style={styles.forecastTitle}>Next 4 Days Forecast</Text>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.forecastScrollContent}
      >
        {forecasts.map((day, index) => {
          const weatherIcon = getWeatherIcon(day.condition, 'd');
          return (
            <View key={index} style={styles.forecastDayCard}>
              <Text style={styles.forecastDayText}>{day.day.substring(0, 3)}</Text>
              
              <View style={styles.forecastIconContainer}>
                <Ionicons
                  name={weatherIcon.name as any}
                  size={28}
                  color={weatherIcon.color as any}
                />
              </View>
              
              <Text style={styles.forecastTempText}>{day.temp}°</Text>
              
              <View style={styles.rainChanceContainer}>
                <Ionicons name="rainy-outline" size={12} color="#64B5F6" />
                <Text style={styles.rainChanceText}>{day.rainChance}%</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({

  forecastContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  forecastHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  forecastTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#37474F",
    marginLeft: 8,
  },
  forecastScrollContent: {
    paddingRight: 0,
  },
  forecastDayCard: {
    alignItems: "center",
    marginRight: 10,
    marginLeft:10,
    minWidth: 60,
  },
  forecastDayText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#A1887F",
    marginBottom: 8,
    textAlign: "center",
  },
  forecastIconContainer: {
    marginBottom: 8,
  },
  forecastTempText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#37474F",
    marginBottom: 4,
  },
  rainChanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rainChanceText: {
    fontSize: 12,
    color: "#64B5F6",
    fontWeight: "500",
  },
});