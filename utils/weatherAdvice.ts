export type Recommendation = {
  id: number;
  text: string;
  type: "good" | "bad";
};

/**
 * Generates short two-word plant advice
 */
export const getWeatherAdvice = (data: any): Recommendation[] => {
  const temp = data.main?.temp || 0;
  const humidity = data.main?.humidity || 0;
  const condition = data.weather?.[0]?.main || "Clear";
  const clouds = data.clouds?.all || 0;
  const windSpeed = data.wind?.speed || 0;

  const advice: Recommendation[] = [];

  // 💧 Watering
  if (condition.toLowerCase().includes("rain") || (humidity > 80)) {
    advice.push({ id: 1, text: "Avoid watering", type: "bad" });
  } else if (temp < 5) {
    advice.push({ id: 1, text: "Skip watering", type: "bad" });
  } else {
    advice.push({ id: 1, text: "Watering fine", type: "good" });
  }

  // 🌿 Spraying
  if (
    condition.toLowerCase().includes("rain") ||
    windSpeed > 8 ||
    clouds > 70 ||
    temp < 10
  ) {
    advice.push({ id: 2, text: "Avoid spraying", type: "bad" });
  } else {
    advice.push({ id: 2, text: "Spraying ok", type: "good" });
  }

  return advice;
};
