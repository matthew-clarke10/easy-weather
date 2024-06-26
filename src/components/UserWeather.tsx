import { useEffect } from 'react';

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
          console.log(response);
          const date = new Date(response.list[0].dt * 1000);
          console.log(date);
          const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          };
          console.log(date.toLocaleDateString("en-US", options));
          const userLocationSection = document.querySelector('.userLocationWeather')
          if (userLocationSection) {
            userLocationSection.innerHTML =
              `
              <div class="text-2xl mb-4">Two Week Forecast for ${response.city.name} (${response.city.country})</div>
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
    <section className="userLocationSection w-11/12 my-8 mx-auto justify-center border-2 p-4 border-black flex items-center h-96">
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
  forecast.forEach((day) => {
    const date = new Date(day.dt * 1000);
    const weekdayOption: Intl.DateTimeFormatOptions = {
      weekday: 'long'
    };

    const dateOption: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric'
    };

    const weekday = date.toLocaleDateString("en-US", weekdayOption);
    const actualDate = date.toLocaleDateString("en-US", dateOption);

    dailyWeather += `
      <div class="border-2 border-black text-center">
        <div>${weekday}<br />${actualDate}</div>
        <div>${Math.round(day.temp.max)}</div>
        <img class="mx-auto w-12 h-12" src=${`https://openweathermap.org/img/w/${day.weather[0].icon}.png`} alt="Weather icon" />
        <div>${Math.round(day.temp.min)}</div>
      </div>`;
  });

  return `
    <section class="grid grid-cols-7 w-full text-center gap-2">
      ${dailyWeather}
    </section>
  `;
}

export default UserWeather