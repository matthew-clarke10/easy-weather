import { Link } from 'react-router-dom';
import '../index.css'

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

interface WeatherDataProps {
  data: WeatherData[];
}

function getPercentage(min: number, max: number, value: number) {
  if (((value - min) / (max - min)) * 100 > 100) {
    return 100;
  } else if (((value - min) / (max - min)) * 100 < 0) {
    return 0;
  }
  return ((value - min) / (max - min)) * 100;
}

function PreviewWeather({ data }: WeatherDataProps) {
  if (!data || data.length === 0) return null;
  return (
    <>
      <h2 className="text-4xl text-center my-8">Weather for Popular Cities</h2>
      <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-11/12 mt-4 mx-auto justify-center items-center border-2 border-black'>
        {data.map((weatherData, index) => (
          <Link to={`/weather/${weatherData.name.replace(/\s+/g, '-').toLowerCase()}`} state={weatherData.name} key={index} className={`${getWeatherClass(weatherData.weather[0].icon)} text-center border-2 border-black h-full flex flex-col justify-center`}>
            <div className="city text-3xl h-16 m-4">{weatherData.name}</div>
            <div className="temp text-2xl">{weatherData.main.temp}°C</div>
            <img className="mx-auto" src={`https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`} alt="Weather icon" />
            <div className="temperaturePreviewLine mx-auto my-4 relative">
              <div className="bg-blue-600 absolute -top-1 lg:-top-2 w-3 lg:w-5 h-3 lg:h-5 border-black border-2 rounded-full" style={{ left: `${getPercentage(-10, 40, weatherData.main.temp_min)}%` }}></div>
              <div className="bg-red-600 absolute -top-1 lg:-top-2 w-3 lg:w-5 h-3 lg:h-5 border-black border-2 rounded-full" style={{ left: `${getPercentage(-10, 40, weatherData.main.temp_max)}%` }}></div>
            </div>
            <div className="tempRange flex text-xl mb-4">
              <div className="tempLow flex flex-col mx-auto px-4 py-2 w-2/5 border-blue-600 border-4">
                <div className="tempLowHeader">Low:</div>
                <div className="tempLowBody">{weatherData.main.temp_min}°C</div>
              </div>
              <div className="tempHigh flex flex-col mx-auto px-4 py-2 w-2/5 border-red-600 border-4">
                <div className="tempHighHeader">High:</div>
                <div className="tempHighBody">{weatherData.main.temp_max}°C</div>
              </div>
            </div>
            <div className="tempDetails flex mb-4 text-xl">
              <div className="tempHumidity flex flex-col mx-auto px-4 py-2 w-2/5 border-yellow-400 border-4">
                <div className="tempHumidityHeader">Humidity:</div>
                <div className="tempHumidityBody">{weatherData.main.humidity}%</div>
              </div>
              <div className="tempWind flex flex-col mx-auto px-4 py-2 w-2/5 border-green-600 border-4">
                <div className="tempWindHeader">Wind:</div>
                <div className="tempWindBody">{weatherData.wind.speed}m/s</div>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </>
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

export default PreviewWeather;