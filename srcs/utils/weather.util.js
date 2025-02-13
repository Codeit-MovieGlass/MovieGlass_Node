import axios from "axios";

export const getWeatherCondition = async (latitude, longitude) => {
  try {
    const API_KEY = process.env.WEATHER_API_KEY; 
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=kr`;

    const response = await axios.get(url);
    const weatherMain = response.data.weather[0].main; // 날씨 상태 값 가져오기

    console.log("현재 날씨 상태:", weatherMain);

    if (["Clouds", "Mist", "Haze", "Fog"].includes(weatherMain)) return "흐림";
    if (["Clear"].includes(weatherMain)) return "맑음";
    if (["Rain", "Drizzle", "Thunderstorm"].includes(weatherMain)) return "비";
    if (["Snow"].includes(weatherMain)) return "눈";

    return "맑음"; // 기본값
  } catch (error) {
    console.error("날씨 API 호출 오류:", error);
    return null; // 오류 발생 시 기본값
  }
};
