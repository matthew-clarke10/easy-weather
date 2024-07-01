import { useLocation } from 'react-router-dom';

interface CurrentWeatherProps {
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

interface ForecastWeatherProps { }

interface DetailedWeatherProps {
  currentWeather?: CurrentWeatherProps;
  forecastWeather?: ForecastWeatherProps;
}

function getPercentage(min: number, max: number, value: number) {
  if (((value - min) / (max - min)) * 100 > 100) {
    return 100;
  } else if (((value - min) / (max - min)) * 100 < 0) {
    return 0;
  }
  return ((value - min) / (max - min)) * 100;
}

function DetailedWeather(props: DetailedWeatherProps) {
  const location = useLocation();
  const { state } = location;
  const { currentWeather, forecastWeather } = props;

  console.log(currentWeather);
  console.log(forecastWeather);

  if (props.currentWeather) {

    return (
      <section className="w-11/12 mx-auto border-2 border-black mt-8">
        <h2 className="text-4xl text-center py-8 border-b-2 border-b-black">Weather for {state}</h2>
        <div className="flex">
          <div className={`text-center border-r-2 border-r-black flex flex-col justify-center min-w-80 w-80 h-full`}>
            <div className="city text-3xl my-2">Today</div>
            <div className="temp text-2xl">{props.currentWeather.main.temp}°C</div>
            <img className="mx-auto" src={`https://openweathermap.org/img/w/${props.currentWeather.weather[0].icon}.png`} alt="Weather icon" />
            <div className="temperaturePreviewLine mx-auto my-4 relative">
              <div className="bg-blue-600 absolute -top-1 lg:-top-2 w-3 lg:w-5 h-3 lg:h-5 border-black border-2 rounded-full" style={{ left: `${getPercentage(-10, 40, props.currentWeather.main.temp_min)}%` }}></div>
              <div className="bg-red-600 absolute -top-1 lg:-top-2 w-3 lg:w-5 h-3 lg:h-5 border-black border-2 rounded-full" style={{ left: `${getPercentage(-10, 40, props.currentWeather.main.temp_max)}%` }}></div>
            </div>
            <div className="tempRange flex text-xl mb-4">
              <div className="tempLow flex flex-col mx-auto px-4 py-2 w-2/5 border-blue-600 border-4">
                <div className="tempLowHeader">Low:</div>
                <div className="tempLowBody">{props.currentWeather.main.temp_min}°C</div>
              </div>
              <div className="tempHigh flex flex-col mx-auto px-4 py-2 w-2/5 border-red-600 border-4">
                <div className="tempHighHeader">High:</div>
                <div className="tempHighBody">{props.currentWeather.main.temp_max}°C</div>
              </div>
            </div>
            <div className="tempDetails flex text-xl mb-4">
              <div className="tempHumidity flex flex-col mx-auto px-4 py-2 w-2/5 border-yellow-400 border-4">
                <div className="tempHumidityHeader">Humidity:</div>
                <div className="tempHumidityBody">{props.currentWeather.main.humidity}%</div>
              </div>
              <div className="tempWind flex flex-col mx-auto px-4 py-2 w-2/5 border-green-600 border-4">
                <div className="tempWindHeader">Wind:</div>
                <div className="tempWindBody">{props.currentWeather.wind.speed}m/s</div>
              </div>
            </div>
          </div>
          <div className={`text-center flex-col justify-center w-full h-full`}>
            <div className="text-3xl my-2">Forecast</div>
          </div>
        </div>
      </section>
    )
  }

}

export default DetailedWeather