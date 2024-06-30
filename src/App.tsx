import { Route, Routes } from 'react-router-dom';
import Search from './components/Search';
import UserWeather from './components/UserWeather';
import PreviewWeather from './components/PreviewWeather';
import DetailedWeather from './components/DetailedWeather';
import NotFound from './components/NotFound';
import { useEffect, useState } from 'react';

const apiKey = 'cc25d26bc930e2edf6c211fc3106986a';
const apiUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=metric`;
const apiUrlDaily = `https://api.openweathermap.org/data/2.5/forecast/daily?appid=${apiKey}&units=metric&cnt=14`;

const cities = ['Hong Kong', 'Bangkok', 'London', 'Singapore', 'Macau', 'Paris', 'Dubai', 'New York City', 'Kuala Lumpur', 'Shenzhen', 'Phuket', 'Istanbul', 'Delhi', 'Tokyo', 'Rome', 'Antalya', 'Taipei', 'Guangzhou', 'Mumbai', 'Prague', 'Mecca', 'Miami', 'Amsterdam', 'Seoul', 'Pattaya', 'Shanghai', 'Los Angeles', 'Las Vegas', 'Agra', 'Osaka', 'Barcelona', 'Milan', 'Denpasar', 'Vienna', 'Cancún', 'Berlin', 'Johor Bahru', 'Johannesburg', 'Ho Chi Minh City', 'Riyadh', 'Venice', 'Jaipur', 'Madrid', 'Orlando', 'Chennai', 'Dublin', 'Florence', 'Moscow'];

interface UserLocationWeatherInterface {
  city: {
    name: string;
    country: string;
  }
  list: {
    dt: number;
    temp: {
      min: number;
      max: number;
    };
    weather: {
      description: string;
      icon: string;
    }[];
  }[];
}

type NullableUserLocationWeather = UserLocationWeatherInterface | null;

interface PreviewWeatherInterface {
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

function App() {
  const [userLocationWeather, setUserLocationWeather] = useState<NullableUserLocationWeather>(null);
  const [previewWeather, setPreviewWeather] = useState<PreviewWeatherInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeatherData() {
      try {
        setLoading(true);
        const userLocationWeatherData = await getUserLocationWeather();
        setUserLocationWeather(userLocationWeatherData);
        const previewWeatherData = await getPreviewWeather(cities);
        setPreviewWeather(previewWeatherData);
      } catch (e) {
        setError((e as Error).message || 'An error occurred.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchWeatherData();
  }, []);

  async function getUserLocationWeather(): Promise<NullableUserLocationWeather> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const userLocationWeatherData = await fetchUserLocationWeatherData(latitude, longitude);
              resolve(userLocationWeatherData);
            } catch (error) {
              reject(error);
            }
          },
          (error) => {
            //setError('Error getting location');
            console.error('Error getting location:', error);
            reject(error);
          }
        );
      } else {
        //setError('Geolocation is not supported by this browser.');
        resolve(null);
      }
    });
  }

  async function fetchUserLocationWeatherData(latitude: number, longitude: number) {
    const response = await fetch(`${apiUrlDaily}&lat=${latitude}&lon=${longitude}`);
    return await response.json();
  }

  async function getPreviewWeather(cities: string[]): Promise<PreviewWeatherInterface[]> {
    const previewWeatherPromises = cities.map(city => fetchPreviewWeather(city));
    const previewWeatherArray = await Promise.all(previewWeatherPromises);
    return previewWeatherArray;
  }

  async function fetchPreviewWeather(city: string): Promise<PreviewWeatherInterface> {
    const previewWeatherResponse = await fetch(`${apiUrlCurrent}&q=${city}`);
    const previewWeatherData = await previewWeatherResponse.json();
    return previewWeatherData;
  }

  if (loading) {
    return (
      <Routes>
        <Route path="/" element={
          <>
            <h1 className="text-6xl text-center my-8">EasyWeather</h1>
            <Search />
            <div className="flex justify-center items-center h-loading">
              <div className="animate-spin border-8 border-gray-100 border-t-blue-500 rounded-3xl w-12 h-12">
              </div>
            </div>
          </>
        } />
        <Route path="/weather/:location" element={<DetailedWeather />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  if (error) {
    return (
      <div>Error: {error}</div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={
        <>
          <h1 className="text-6xl text-center my-8">EasyWeather</h1>
          <Search />
          <section>
            <UserWeather data={userLocationWeather} />
            <PreviewWeather data={previewWeather} />
          </section>
        </>
      } />
      <Route path="/weather/:location" element={<DetailedWeather />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
