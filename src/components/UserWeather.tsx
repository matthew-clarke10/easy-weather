import { Link } from 'react-router-dom';
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
  main: {
    temp_min: number;
    temp_max: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

type NullableUserLocationWeather = UserLocationWeatherInterface | null;

interface UserWeatherProps {
  locationPermission: PermissionState;
  requestLocationAccess: () => void;
  data: NullableUserLocationWeather;
}

function UserWeather(props: UserWeatherProps) {
  if (props.data) {
    const forecastDataHtml = getForecastData(props.data.list);
    return (
      <Link to={`/weather/${props.data.city.name.replace(/\s+/g, '-').toLowerCase()}`} state={props.data.city.name} className="bg-sky-400 hover:bg-sky-500 w-11/12 my-8 mx-auto justify-center border-2 border-black flex items-center h-[108]">
        <section className="userLocationWeather flex flex-col justify-center items-center w-full h-full">
          <div className="text-2xl w-full p-4 text-center border-b-2 border-b-black">
            Five Day Forecast for {props.data.city.name} ({props.data.city.country})
          </div>
          {forecastDataHtml}
        </section>
      </Link>
    )
  } else {
    return (
      <section className="bg-sky-400 w-11/12 my-8 mx-auto justify-center border-2 border-black flex items-center h-[16rem]">
        <section className="userLocationWeather flex flex-col justify-center items-center w-full h-full">
          <button onClick={props.requestLocationAccess} className="bg-green-400 p-4 rounded-lg mb-4 mt-16 hover:bg-green-500">Allow Location Access</button>
          <div className="text-center">Allow location access to see your local weather. <br />Or search your city above manually.</div>
        </section>
      </section>
    )
  }
}

function getPercentage(min: number, max: number, value: number) {
  if (((value - min) / (max - min)) * 100 > 100) {
    return 100;
  } else if (((value - min) / (max - min)) * 100 < 0) {
    return 0;
  }
  return ((value - min) / (max - min)) * 100;
}

function getForecastData(forecast: ForecastData[]) {
  return (
    <section className="grid grid-cols-1 grid-rows-5 md:grid-flow-col-dense w-full">
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
          <div key={index} className={`flex items-center w-full mx-auto justify-center text-lg md:text-sm lg:text-lg ${index < 7 ? 'border-r-0 md:border-r-black' : ''}`}>
            <div className="flex flex-row items-center md:w-1/4 lg:w-1/5 ml-4">
              <div className="w-48 md:w-36">{weekday} {actualDate}</div>
              <img className="mx-4 w-12 h-12" src={`https://openweathermap.org/img/w/${day.weather[0].icon}.png`} alt="Weather icon" />
            </div>
            <div className="flex flex-row items-center w-full md:w-3/4 lg:w-4/5 mr-4">
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
    </section>
  );
}

export default UserWeather