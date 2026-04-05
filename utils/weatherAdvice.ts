export type Recommendation = {
  id: number;
  text: string;
  type: "good" | "bad";
  reason?: string;
};

export const getWeatherAdvice = (data: any): Recommendation[] => {
  const temp       = data.temp ?? 0;
  const humidity   = data.humidity ?? 0;
  const condition  = data.condition ?? "Clear";
  const clouds     = data.clouds ?? 0;
  const windSpeed  = data.windSpeed ?? 0;
  const rainChance = data.rainChance ?? 0;  // already 0-100 not 0-1
  const frostRisk  = temp <= 2;

  const advice: Recommendation[] = [];

  // 💧 Watering advice
  if (rainChance > 30 || condition.toLowerCase().includes("rain") || humidity > 80) {
    advice.push({
      id: 1,
      text: "Avoid watering",
      type: "bad",
      reason: `High chance of rain (${rainChance}%), high humidity (${humidity}%), or rainy conditions. Watering now may overwater crops.`,
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
    condition.toLowerCase().includes("thunderstorm") ||
    windSpeed > 6 ||
    clouds > 70 ||
    temp < 10 ||
    frostRisk
  ) {
    advice.push({
      id: 2,
      text: "Avoid spraying",
      type: "bad",
      reason: `Rainy or windy conditions (${windSpeed} km/h), clouds (${clouds}%), or low temperature (${temp}°C). Spraying may be ineffective or harm crops.`,
    });
  } else {
    advice.push({
      id: 2,
      text: "Spraying fine",
      type: "good",
      reason: `Weather is calm and temperature (${temp}°C) is suitable. Safe to spray crops.`,
    });
  }

  return advice;
};