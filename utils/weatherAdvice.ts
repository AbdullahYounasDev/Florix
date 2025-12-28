export type Recommendation = {
  id: number;
  text: string;          // Two-word advice
  type: "good" | "bad";  // Positive or caution
  reason?: string;        // Explanation in simple words
};

/**
 * Generates precise two-word plant advice with reasons for farmers
 */
export const getWeatherAdvice = (data: any): Recommendation[] => {
  const temp = data.main?.temp ?? 0; // current temperature
  const humidity = data.main?.humidity ?? 0; // humidity %
  const condition = data.weather?.[0]?.main ?? "Clear"; // weather main
  const clouds = data.clouds?.all ?? 0; // cloud %
  const windSpeed = data.wind?.speed ?? 0; // m/s
  const rainChance = data.pop ?? 0; // probability of precipitation (0-1)
  const snow = data.snow?.["1h"] ?? 0; // snow volume in mm
  const frostRisk = temp <= 2; // frost below 2°C

  const advice: Recommendation[] = [];

  // 💧 Watering advice
  if (rainChance > 0.3 || condition.toLowerCase().includes("rain") || humidity > 80 || snow > 0) {
    advice.push({
      id: 1,
      text: "Avoid watering",
      type: "bad",
      reason: `High chance of rain (${Math.round(rainChance * 100)}%), high humidity (${humidity}%), or snow present. Watering now may overwater crops.`,
    });
  } else if (temp < 5 || frostRisk) {
    advice.push({
      id: 1,
      text: "Skip watering",
      type: "bad",
      reason: `Low temperature (${temp}°C) or frost risk. Watering can damage plants.`,
    });
  } else {
    advice.push({
      id: 1,
      text: "Watering fine",
      type: "good",
      reason: `Temperature (${temp}°C) and humidity (${humidity}%) are suitable. Safe to water crops.`,
    });
  }

  // 🌿 Spraying advice
  if (
    condition.toLowerCase().includes("rain") ||
    windSpeed > 6 ||
    clouds > 70 ||
    temp < 10 ||
    frostRisk
  ) {
    advice.push({
      id: 2,
      text: "Avoid spraying",
      type: "bad",
      reason: `Rainy or windy conditions (${windSpeed} m/s), clouds (${clouds}%), or low temperature (${temp}°C). Spraying may be ineffective or harm crops.`,
    });
  } else {
    advice.push({
      id: 2,
      text: "Spraying fine",
      type: "good",
      reason: `Weather is calm, sunny, and temperature (${temp}°C) is suitable. Safe to spray crops.`,
    });
  }

  return advice;
};
