import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function WeatherDetail() {
  const { city } = useParams();
  const [weatherDetail, setWeatherDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/weather/detail/${city}`
        );
        setWeatherDetail(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load weather details");
        setLoading(false);
      }
    };

    fetchWeatherDetail();
  }, [city]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="weather-detail-container">
      <Link to="/" className="back-link">
        ← Back to Search
      </Link>

      {weatherDetail && (
        <div className="weather-card">
          <h1 className="city-name">{city}</h1>

          <div className="weather-content">
            <div className="weather-main">
              <h2>Current Weather</h2>
              <div className="weather-info">
                <img
                  src={`http://openweathermap.org/img/wn/${weatherDetail.list[0].weather[0].icon}@2x.png`}
                  alt="weather icon"
                />
                <div>
                  <p className="temp">
                    {Math.round(weatherDetail.list[0].main.temp)}°C
                  </p>
                  <p className="description">
                    {weatherDetail.list[0].weather[0].description}
                  </p>
                </div>
              </div>
            </div>

            <div className="weather-details">
              <h2>Details</h2>
              <div className="grid">
                <div>
                  <p>Humidity</p>
                  <p className="bold">{weatherDetail.list[0].main.humidity}%</p>
                </div>
                <div>
                  <p>Wind Speed</p>
                  <p className="bold">{weatherDetail.list[0].wind.speed} m/s</p>
                </div>
                <div>
                  <p>Pressure</p>
                  <p className="bold">
                    {weatherDetail.list[0].main.pressure} hPa
                  </p>
                </div>
                <div>
                  <p>Visibility</p>
                  <p className="bold">
                    {weatherDetail.list[0].visibility / 1000} km
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="forecast">
            <h2>5-Day Forecast</h2>
            <div className="forecast-grid">
              {weatherDetail.list
                .filter((item, index) => index % 8 === 0)
                .map((item, index) => (
                  <div key={index} className="forecast-card">
                    <p className="day">
                      {new Date(item.dt * 1000).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </p>
                    <img
                      src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                      alt="weather icon"
                    />
                    <p className="temp">{Math.round(item.main.temp)}°C</p>
                    <p className="description">{item.weather[0].description}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherDetail;
