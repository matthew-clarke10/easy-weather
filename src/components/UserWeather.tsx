import { useEffect } from 'react';
import '../index.css';

// API Details.
const apiKey = 'cc25d26bc930e2edf6c211fc3106986a';
const apiUrl = `https://api.openweathermap.org/data/2.5/forecast/daily?appid=${apiKey}&cnt=14&units=metric`;

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

function UserWeather() {
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const response = await fetchWeatherData(latitude, longitude);
          const userLocationSection = document.querySelector('.userLocationWeather')
          if (userLocationSection) {
            userLocationSection.innerHTML =
              `
              <div class="text-2xl w-full p-4 text-center border-b-2 border-b-black">Two Week Forecast for ${response.city.name} (${response.city.country})</div>
              ${getForecastData(response.list)}
            `;
          }
        },
        (error) => {
          //setError('Error getting location');
          console.error('Error getting location:', error);
        }
      );
    } else {
      //setError('Geolocation is not supported by this browser.');
    }
  }, []);

  return (
    <section className="userLocationSection w-11/12 my-8 mx-auto justify-center border-2 border-black flex items-center h-[108]">
      <section className="userLocationWeather flex flex-col justify-center items-center w-full h-full">
        <button className="bg-green-400 p-4 rounded-lg mb-4 mt-16 hover:bg-green-500">Allow Location Access</button>
        <div className="text-center text-gray-600">Allow location access to see your local weather. <br />Or search your city above manually.</div>
      </section>
    </section>
  )
}

async function fetchWeatherData(latitude: number, longitude: number) {
  const response = await fetch(`${apiUrl}&lat=${latitude}&lon=${longitude}`);
  return await response.json();
}

function getForecastData(forecast: ForecastData[]) {
  let dailyWeather = '';
  forecast.forEach((day, index) => {
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

    if (index < 7) {
      dailyWeather += `
        <div class="flex items-center w-full mx-auto justify-center text-lg md:text-sm lg:text-lg border-r-0 md:border-r-2 md:border-r-black">
          <div class="flex flex-row items-center md:w-1/2 lg:w-3/5 xl:w-2/5 ml-4">
            <div class="w-48 md:w-36">${weekday} ${actualDate}</div>
            <img class="mx-4 w-12 h-12" src=${`https://openweathermap.org/img/w/${day.weather[0].icon}.png`} alt="Weather icon" />
          </div>
          <div class="flex flex-row items-center w-full md:w-1/2 lg:w-3/5 mr-4">
            <div>${Math.round(day.temp.min)}</div>
            <div class="userLocationRangeLine w-16 h-1 mx-2 flex-1"></div>
            <div>${Math.round(day.temp.max)}</div>
          </div>
        </div>`;
    } else {
      dailyWeather += `
        <div class="flex items-center w-full mx-auto justify-center text-lg md:text-sm lg:text-lg">
          <div class="flex flex-row items-center md:w-1/2 lg:w-3/5 xl:w-2/5 ml-4">
            <div class="w-48">${weekday} ${actualDate}</div>
            <img class="mx-4 w-12 h-12" src=${`https://openweathermap.org/img/w/${day.weather[0].icon}.png`} alt="Weather icon" />
          </div>
          <div class="flex flex-row items-center w-full md:w-1/2 lg:w-3/5 mr-4">
            <div>${Math.round(day.temp.min)}</div>
            <div class="userLocationRangeLine w-16 h-1 mx-2 flex-1"></div>
            <div>${Math.round(day.temp.max)}</div>
          </div>
        </div>`;
    }
  });

  return `
    <section class="grid grid-cols-1 md:grid-cols-2 grid-rows-7 md:grid-flow-col-dense w-full">
      ${dailyWeather}
    </section>
  `;
}

export default UserWeather