import {useState, useEffect} from "react";
import axios from "axios";

const API_KEY = "c42d96c896b35e6dfe530cd973564856";

function Weather(){
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  useEffect(()=>{
    const sevedCity = localStorage.getItem("lastCity");
    if(sevedCity){
      setCity(sevedCity);
      fetchWeather(sevedCity);
    }
  }, []);

  const fetchWeather = async (cityName) => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=kr`
      );
      setWeather(res.data);

      localStorage.setItem("lastCity", cityName);
    } catch (err){
      alert("도시를 찾을 수 없습니다.");
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if(city.trim() !== ""){
      fetchWeather(city);
    }
  };

  return(
    <div>
      <h1>Weather</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={city}
          placeholder="도시를 입력해주세요!"
          onChange={(e)=>setCity(e.target.value)} />
          <button type="submit">검색</button>
      </form>

      {weather && (
        <div>
          <h2>{weather.name} 날씨</h2>
          <p>온도 : {weather.main.temp}</p>
        </div>
      )}
    </div>
  );
}

export default Weather;