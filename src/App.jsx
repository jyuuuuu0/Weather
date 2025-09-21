import { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = "c42d96c896b35e6dfe530cd973564856";

export default function App() {
  const [city, setCity] = useState("");         
  const [weather, setWeather] = useState(null); 
  const [recent, setRecent] = useState([]);     

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("recentCities"));
    if (saved) {
      setRecent(saved);
      fetchWeather(saved[0]); 
    }
  }, []);

  const fetchWeather = async (cityName) => {
    if (!cityName) return;

    try {
      const res = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather",
        {
          params: {
            q: cityName,
            appid: API_KEY,
            units: "metric",
            lang: "kr",
          },
        }
      );

      if (res.status === 200) {
        if (weather) {
          setRecent([weather.name]);
          localStorage.setItem("recentCities", JSON.stringify([weather.name]));
        }
        setWeather(res.data);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        alert("지역을 찾을 수 없습니다.");
      } else {
        console.error("API 요청 에러:", err);
        alert("날씨 정보를 가져오지 못했습니다.");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    fetchWeather(city);
    setCity(""); 
  };

  return (
    <div>
      <h1>날씨 검색</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="도시 이름 입력"
        />
        <button type="submit">검색</button>
      </form>

      {weather && (
        <div>
          <h2>{weather.name} 날씨</h2>
          <p>기온: {weather.main.temp}°C</p>
          <p>날씨: {weather.weather[0].description}</p>
          <p>습도: {weather.main.humidity}%</p>
          <p>풍속: {weather.wind.speed}m/s</p>
        </div>
      )}

      {recent.length > 0 && (
        <div>
          <h3>최근 검색</h3>
          <p>{recent[0]}</p>
        </div>
      )}
    </div>
  );
}
