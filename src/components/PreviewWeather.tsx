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
  const cities = ['Hong Kong', 'Bangkok', 'London', 'Singapore', 'Macau', 'Paris', 'Dubai', 'New York City', 'Kuala Lumpur', 'Shenzhen', 'Phuket', 'Istanbul', 'Delhi', 'Tokyo', 'Rome', 'Antalya', 'Taipei', 'Guangzhou', 'Mumbai', 'Prague', 'Mecca', 'Miami', 'Amsterdam', 'Seoul', 'Pattaya', 'Shanghai', 'Los Angeles', 'Las Vegas', 'Agra', 'Osaka', 'Barcelona', 'Milan', 'Denpasar', 'Vienna', 'Cancún', 'Berlin', 'Johor Bahru', 'Johannesburg', 'Ho Chi Minh City', 'Riyadh', 'Venice', 'Jaipur', 'Madrid', 'Orlando', 'Chennai', 'Dublin', 'Florence', 'Moscow'];
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
    <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-11/12 mt-4 mx-auto justify-center items-center border-2 border-black'>
      {weatherDataList.map((weatherData, index) => (
        <div key={index} className={`${getWeatherClass(weatherData.weather[0].icon)} text-center border-2 border-black h-full flex flex-col justify-center`}>
          <div className="city text-3xl h-16 m-4">{weatherData.name}</div>
          <div className="temp text-2xl">{weatherData.main.temp} °C</div>
          <img className="mx-auto" src={`https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`} alt="Weather icon" />
          <div className="temperatureLine mx-auto my-4"></div>
          <div className="tempRange flex text-xl mb-4">
            <div className="tempLow flex flex-col mx-auto px-4 py-2 w-2/5 border-blue-600 border-4">
              <div className="tempLowHeader">Low:</div>
              <div className="tempLowBody">{weatherData.main.temp_min} °C</div>
            </div>
            <div className="tempHigh flex flex-col mx-auto px-4 py-2 w-2/5 border-red-600 border-4">
              <div className="tempHighHeader">High:</div>
              <div className="tempHighBody">{weatherData.main.temp_max} °C</div>
            </div>
          </div>
          <div className="tempDetails flex mb-4 text-xl">
            <div className="tempHumidity flex flex-col mx-auto px-4 py-2 w-2/5 border-yellow-400 border-4">
              <div className="tempHumidityHeader">Humidity:</div>
              <div className="tempHumidityBody">{weatherData.main.humidity}%</div>
            </div>
            <div className="tempWind flex flex-col mx-auto px-4 py-2 w-2/5 border-green-600 border-4">
              <div className="tempWindHeader">Wind:</div>
              <div className="tempWindBody">{weatherData.wind.speed} m/s</div>
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