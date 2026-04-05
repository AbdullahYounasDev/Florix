import { theme } from "@/utils/theme";
import { getWeatherIcon } from "@/utils/weatherIcon";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface HourlyItem {
  time: string;
  temp: number;
  feels: number;
  humidity: number;
  windSpeed: number;
  clouds: number;
  rainChance: number;
  condition: string;
  desc: string;
}

export const HourlyWeatherToday = ({ hourly }: { hourly: HourlyItem[] }) => {
  if (!hourly || hourly.length === 0) return null;

  const formatTime = (time: string) => {
    const [hourStr] = time.split(":");
    const hour = parseInt(hourStr);
    const ampm = hour >= 12 ? "PM" : "AM";
    const display = hour % 12 === 0 ? 12 : hour % 12;
    return `${display}${ampm}`;
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(250)}
      style={styles.container}
    >
      <View style={styles.header}>
        <Ionicons name="time-outline" size={16} color={theme.colors.secondary} />
        <Text style={styles.title}>Today's Hourly Forecast</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {hourly.map((item, index) => {
          const weatherIcon = getWeatherIcon(
            item.condition,
            parseInt(item.time) >= 6 && parseInt(item.time) < 20 ? "01d" : "01n"
          );

          return (
            <View key={index} style={styles.hourCard}>
              {/* Time */}
              <Text style={styles.timeText}>{formatTime(item.time)}</Text>

              {/* Icon */}
              <View style={styles.iconContainer}>
                <Ionicons
                  name={weatherIcon.name as any}
                  size={22}
                  color={weatherIcon.color as any}
                />
              </View>

              {/* Temp */}
              <Text style={styles.tempText}>{item.temp}°</Text>

              {/* Rain Chance */}
              <View style={styles.rainRow}>
                <Ionicons name="rainy-outline" size={10} color="#2C3E50" />
                <Text style={styles.rainText}>{item.rainChance}%</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    color: "#37474F",
    marginLeft: 6,
  },
  scrollContent: {
    paddingRight: 4,
  },
  hourCard: {
    alignItems: "center",
    marginRight: 8,
    marginLeft: 8,
    minWidth: 46,
  },
  timeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 6,
    textAlign: "center",
  },
  iconContainer: {
    marginBottom: 6,
  },
  tempText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#37474F",
    marginBottom: 4,
  },
  rainRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  rainText: {
    fontSize: 10,
    color: "#2C3E50",
    fontWeight: "500",
  },
});