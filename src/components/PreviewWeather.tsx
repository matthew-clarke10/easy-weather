// import { Link } from "react-router-dom"
import { useState, useEffect } from 'react'
import '../index.css'

// API Details.
const apiKey = 'cc25d26bc930e2edf6c211fc3106986a';
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=metric`;

interface WeatherData {
  name: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
}

function PreviewWeather() {
  const [weatherDataList, setWeatherDataList] = useState<WeatherData[]>([]);
  const cities = ['London', 'Paris', 'Tokyo', 'Moscow', 'Sydney'];

  useEffect(() => {
    fetchWeatherDataForCities(cities);
  }, []);

  const fetchWeatherDataForCities = async (cities: string[]) => {
    const promises = cities.map(city => getWeatherData(city));
    const weatherDataArray = await Promise.all(promises);
    setWeatherDataList(weatherDataArray);
  };

  if (weatherDataList.length === 0) {
    return <div>Loading...</div>;
  }


  return (
    <section className='flex w-11/12 h-72 mt-4 mx-auto justify-center items-center border-2 border-black'>
      {weatherDataList.map((weatherData, index) => (
        <div key={index} className={`${getWeatherClass(weatherData.weather[0].icon)} w-1/5 text-center border-2 border-black h-full bg-red-50 flex flex-col justify-center`}>
          <div className="city">{weatherData.name}</div>
          <div className="temp">{weatherData.main.temp} °C</div>
          <div className="type">{weatherData.weather[0].description}</div>
          <div className="tempRange">
            <div className="tempLow">Low: {weatherData.main.temp_min} °C</div>
            <div className="tempHigh">High: {weatherData.main.temp_max} °C</div>
          </div>
          <img className="icon mx-auto" src={`https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`} alt="Weather icon" />
          <div className="details">
            <div className="detailsRow">
              <div className="humidityRow">Humidity: {weatherData.main.humidity}%</div>
              <div className="windRow">Wind: {weatherData.wind.speed} m/s</div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

function getWeatherClass(icon: string): string {
  switch (icon) {
    case '01d':
    case '02d':
      return 'sunny';
    case '03d':
    case '04d':
      return 'cloudy';
    case '09d':
    case '10d':
    case '11d':
      return 'rainy';
    case '13d':
      return 'snow';
    case '50d':
      return 'foggy';
    default:
      return 'night';
  }
}

async function getWeatherData(city: string): Promise<WeatherData> {
  const response = await fetch(`${apiUrl}&q=${city}`);
  const data = await response.json();
  return data;
}

export default PreviewWeather;