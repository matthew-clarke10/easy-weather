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
      <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-11/12 my-8 mx-auto justify-center items-center border-2 border-black'>
        {data.map((weatherData, index) => (
          <Link to={`/weather/${weatherData.name.replace(/\s+/g, '-').toLowerCase()}`} state={weatherData.name} key={index} className={`${getWeatherClass(weatherData.weather[0].icon)} text-center border-2 border-black h-full flex flex-col justify-center my-4`}>
            <div className="city text-3xl h-16 m-4">{weatherData.name}</div>
            <div className="temp text-2xl">{weatherData.main.temp}°C</div>
            <img className="mx-auto h-20 w-20" src={`https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`} alt="Weather icon" />
            <div className="flex flex-row items-center w-11/12 mx-auto mb-4">
              <div className="rangeLine h-3 mx-2 flex-1 relative rounded-full">
                <div className="bg-blue-600 absolute -top-1 w-5 h-5 border-black border-2 rounded-full" style={{ left: `${getPercentage(-10, 40, weatherData.main.temp_min)}%` }}></div>
                <div className="bg-red-600 absolute -top-1 w-5 h-5 border-black border-2 rounded-full" style={{ left: `${getPercentage(-10, 40, weatherData.main.temp_max)}%` }}></div>
              </div>
            </div>
            <div className="flex flex-col mx-auto text-2xl w-full">
              <div className="flex">
                <div className="tempLow flex flex-col justify-center mx-auto my-2 w-2/5 aspect-square py-6 bg-blue-400 rounded-xl">
                  <div className="tempLowHeader">Low:</div>
                  <div className="tempLowBody">{weatherData.main.temp_min}°C</div>
                </div>
                <div className="tempHigh flex flex-col justify-center mx-auto my-2 w-2/5 aspect-square py-6 bg-red-400 rounded-xl">
                  <div className="tempHighHeader">High:</div>
                  <div className="tempHighBody">{weatherData.main.temp_max}°C</div>
                </div>
              </div>
              <div className="flex">
                <div className="tempHumidity flex flex-col justify-center mx-auto my-2 w-2/5 aspect-square py-6 bg-yellow-300 rounded-xl">
                  <div className="tempHumidityHeader">Humidity:</div>
                  <div className="tempHumidityBody">{weatherData.main.humidity}%</div>
                </div>
                <div className="tempWind flex flex-col justify-center mx-auto my-2 w-2/5 aspect-square py-6 bg-green-400 rounded-xl">
                  <div className="tempWindHeader">Wind:</div>
                  <div className="tempWindBody">{weatherData.wind.speed}m/s</div>
                </div>
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
      return 'bg-amber-400 hover:bg-amber-500 focus:bg-amber-500';
    case '03d':
    case '04d':
      return 'bg-gray-300 hover:bg-gray-400 focus:bg-gray-400';
    case '09d':
    case '10d':
    case '11d':
      return 'bg-sky-700 hover:bg-sky-800 focus:bg-sky-800';
    case '13d':
      return 'bg-white hover:bg-slate-100 focus:bg-slate-100';
    case '50d':
    default:
      return 'bg-gray-700 hover:bg-gray-800 focus:bg-gray-800';
  }
}

export default PreviewWeather;