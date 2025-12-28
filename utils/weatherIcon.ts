export const getWeatherIcon = (condition: string, iconCode: string) => {
  const isNight = iconCode?.endsWith("n");
  const weather = condition.toLowerCase();

  switch (weather) {
    case "clear":
      return isNight
        ? { name: "moon", color: "#B0BEC5" }
        : { name: "sunny", color: "#FFB300" };

    case "clouds":
      return isNight
        ? { name: "cloudy-night", color: "#78909C" }
        : { name: "cloud", color: "#78909C" };

    case "rain":
    case "drizzle":
      return isNight
        ? { name: "rainy-night", color: "#1976D2" } // Ionicons has rainy/night variant
        : { name: "rainy", color: "#1976D2" };

    case "snow":
      return { name: "snow", color: "#80DEEA" };

    case "thunderstorm":
      return { name: "thunderstorm", color: "#4527A0" };

    case "mist":
    case "fog":
    case "haze":
      return { name: "cloudy", color: "#90A4AE" };

    default:
      return isNight
        ? { name: "cloudy-night", color: "#5D8A6F" }
        : { name: "partly-sunny", color: "#5D8A6F" };
  }
};
