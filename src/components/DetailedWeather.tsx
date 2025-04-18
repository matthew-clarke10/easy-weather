import { Link } from "react-router-dom";

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

interface ForecastDay {
  dt: number;
  main: {
    temp_min: number;
    temp_max: number;
  }
  pressure: number;
  humidity: number;
  weather: {
    description: string;
    icon: string;
  }[];
}

/* interface ForecastDay {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: {
    min: number;
    max: number;
  };
  pressure: number;
  humidity: number;
  weather: {
    description: string;
    icon: string;
  }[];
  speed: number;
} */

interface ForecastWeatherProps {
  city: {
    name: string;
    country: string;
  };
  list: ForecastDay[];
}

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
  const { currentWeather, forecastWeather } = props;

  if (currentWeather) {
    if (forecastWeather) {
      return (
        <section className="w-11/12 mx-auto border-2 border-black my-8 bg-sky-400">
          <h2 className="text-4xl text-center py-8 border-b-2 border-b-black">Weather for {currentWeather.name} ({forecastWeather.city.country})</h2>
          <div className="flex flex-col md:flex-row">
            <div className={`text-center flex flex-col justify-center w-full md:min-w-80 md:w-80 h-full`}>
              <div className="city text-3xl my-2">Now</div>
              <div className="temp text-2xl">{currentWeather.main.temp}°C</div>
              <img className="mx-auto h-20 w-20" src={`https://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`} alt="Weather icon" />
              <div className="flex flex-row items-center w-11/12 md:w-4/5 mx-auto mb-4">
                <div className="rangeLine h-3 mx-2 flex-1 relative rounded-full">
                  <div className="bg-blue-600 absolute -top-1 w-5 h-5 border-black border-2 rounded-full" style={{ left: `${getPercentage(-10, 40, currentWeather.main.temp_min)}%` }}></div>
                  <div className="bg-red-600 absolute -top-1 w-5 h-5 border-black border-2 rounded-full" style={{ left: `${getPercentage(-10, 40, currentWeather.main.temp_max)}%` }}></div>
                </div>
              </div>
              <div className="flex flex-col mx-auto text-xl md:text-sm w-full">
                <div className="flex">
                  <div className="tempHumidity flex flex-col md:flex-row md:gap-1 justify-center mx-auto my-2 w-2/5 md:w-auto aspect-square md:aspect-auto py-6 px-2 bg-blue-400 rounded-xl">
                    <div className="tempLowHeader">Low:</div>
                    <div className="tempLowBody">{currentWeather.main.temp_min}°C</div>
                  </div>
                  <div className="tempHumidity flex flex-col md:flex-row md:gap-1 justify-center mx-auto my-2 w-2/5 md:w-auto aspect-square md:aspect-auto py-6 px-2 bg-red-400 rounded-xl">
                    <div className="tempHighHeader">High:</div>
                    <div className="tempHighBody">{currentWeather.main.temp_max}°C</div>
                  </div>
                </div>
                <div className="flex">
                  <div className="tempHumidity flex flex-col md:flex-row md:gap-1 justify-center mx-auto my-2 w-2/5 md:w-auto aspect-square md:aspect-auto py-6 px-2 bg-yellow-300 rounded-xl">
                    <div className="tempHumidityHeader">Humidity:</div>
                    <div className="tempHumidityBody">{currentWeather.main.humidity}%</div>
                  </div>
                  <div className="tempHumidity flex flex-col md:flex-row md:gap-1 justify-center mx-auto my-2 w-2/5 md:w-auto aspect-square md:aspect-auto py-6 px-2 bg-green-400 rounded-xl">
                    <div className="tempWindHeader">Wind:</div>
                    <div className="tempWindBody">{currentWeather.wind.speed}m/s</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`text-center flex-col justify-center w-full border-l-0 md:border-l-2 md:border-l-black`}>
              <div className="text-3xl my-2">Forecast</div>
              <div className="py-0 md:py-8">
              {forecastWeather.list.map((day: ForecastDay, index: number) => {
                const date = new Date(day.dt * 1000);
                const weekdayOption: Intl.DateTimeFormatOptions = {
                  weekday: 'short'
                };

                const dateOption: Intl.DateTimeFormatOptions = {
                  month: 'long',
                  day: 'numeric'
                };

                const weekday = date.toLocaleDateString("en-US", weekdayOption);
                const actualDate = date.toLocaleDateString("en-US", dateOption);

                return (
                  <div key={index} className="flex items-center w-full mx-auto justify-center text-lg">
                    <div className="flex flex-row items-center md:w-1/2 lg:w-3/5 xl:w-2/5">
                      <div className="w-48 md:w-36">{weekday} {actualDate}</div>
                      <img className="mx-4 w-12 h-12" src={`https://openweathermap.org/img/w/${day.weather[0].icon}.png`} alt="Weather icon" />
                    </div>
                    <div className="flex flex-row items-center w-full md:w-1/2 lg:w-3/5 mr-4">
                      <div>{Math.round(day.main.temp_min)}</div>
                      <div className="rangeLine w-16 h-3 mx-2 flex-1 relative rounded-full">
                        <div className="bg-blue-600 absolute -top-1 w-5 h-5 border-black border-2 rounded-full" style={{ left: `${getPercentage(-10, 40, day.main.temp_min)}%` }}></div>
                        <div className="bg-red-600 absolute -top-1 w-5 h-5 border-black border-2 rounded-full" style={{ left: `${getPercentage(-10, 40, day.main.temp_max)}%` }}></div>
                      </div>
                      <div>{Math.round(day.main.temp_max)}</div>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          </div>
        </section>
      )
    }
  }

  if (currentWeather === null) {
    return (
      <section className="text-center text-2xl md:mx-24">
        <div className="m-16">Something went wrong fetching the weather data for the city you entered (possibly the city is not recorded to determine the weather). You can try entering the city again, or try entering another city close to the one you entered.</div>
        <Link to="/" className="rounded-lg bg-sky-400 hover:bg-sky-500 focus:bg-sky-500 px-12 py-6">Back to Home</Link>
      </section>

    );
  }
}

export default DetailedWeather