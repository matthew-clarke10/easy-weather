import '../index.css';

interface UserLocationWeatherInterface {
  city: {
    name: string;
    country: string;
  }
  list: ForecastData[];
}

interface ForecastData {
  dt: number;
  temp: {
    min: number;
    max: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

type NullableUserLocationWeather = UserLocationWeatherInterface | null;

interface UserWeatherProps {
  data: NullableUserLocationWeather;
}

function UserWeather({ data }: UserWeatherProps) {
  if (data) {
    const forecastDataHtml = getForecastData(data.list);
    return (
      <section className="userLocationSection w-11/12 my-8 mx-auto justify-center border-2 border-black flex items-center h-[108]">
        <section className="userLocationWeather flex flex-col justify-center items-center w-full h-full">
          <div className="text-2xl w-full p-4 text-center border-b-2 border-b-black">
            Two Week Forecast for {data.city.name} ({data.city.country})
          </div>
          {forecastDataHtml}
        </section>
      </section>
    )
  } else {
    return (
      <section className="userLocationSection w-11/12 my-8 mx-auto justify-center border-2 border-black flex items-center h-[108]">
        <section className="userLocationWeather flex flex-col justify-center items-center w-full h-full">
          <button className="bg-green-400 p-4 rounded-lg mb-4 mt-16 hover:bg-green-500">Allow Location Access</button>
          <div className="text-center text-gray-600">Allow location access to see your local weather. <br />Or search your city above manually.</div>
        </section>
      </section>
    )
  }
}

function getForecastData(forecast: ForecastData[]) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 grid-rows-7 md:grid-flow-col-dense w-full">
      {forecast.map((day, index) => {
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
          <div key={index} className={`flex items-center w-full mx-auto justify-center text-lg md:text-sm lg:text-lg ${index < 7 ? 'border-r-0 md:border-r-2 md:border-r-black' : ''}`}>
            <div className="flex flex-row items-center md:w-1/2 lg:w-3/5 xl:w-2/5 ml-4">
              <div className="w-48 md:w-36">{weekday} {actualDate}</div>
              <img className="mx-4 w-12 h-12" src={`https://openweathermap.org/img/w/${day.weather[0].icon}.png`} alt="Weather icon" />
            </div>
            <div className="flex flex-row items-center w-full md:w-1/2 lg:w-3/5 mr-4">
              <div>{Math.round(day.temp.min)}</div>
              <div className="userLocationRangeLine w-16 h-1 mx-2 flex-1"></div>
              <div>{Math.round(day.temp.max)}</div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default UserWeather