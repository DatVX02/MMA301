import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const searchWeather = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/weather/${city}`
      );
      setWeather(response.data);
      setLoading(false);
    } catch (err) {
      setError("City not found or network error");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      <h1 className="text-4xl text-center">
        🌤 Weather App
      </h1>

      {/* Search Bar */}
      <form onSubmit={searchWeather} className="search-container">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name..."
        />
        <button type="submit">Search</button>
      </form>

      {/* Loading Message */}
      {loading && <div className="text-center text-white">Loading...</div>}

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Weather Card */}
      {weather && (
        <div
          className="weather-card cursor-pointer mt-6"
          onClick={() => navigate(`/detail/${city}`)}
        >
          <h2 className="text-2xl font-bold mb-4">{weather.name}</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="temp">{Math.round(weather.main.temp)}°C</p>
              <p className="text-gray-300">{weather.weather[0].description}</p>
            </div>
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="weather icon"
              className="w-20 h-20"
            />
          </div>
          <div className="details">
            <div>
              <p>Humidity</p>
              <p className="font-bold">{weather.main.humidity}%</p>
            </div>
            <div>
              <p>Wind Speed</p>
              <p className="font-bold">{weather.wind.speed} m/s</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
