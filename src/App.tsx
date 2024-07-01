import { Route, Routes, useLocation } from 'react-router-dom';
import Search from './components/Search';
import UserWeather from './components/UserWeather';
import PreviewWeather from './components/PreviewWeather';
import DetailedWeather from './components/DetailedWeather';
import NotFound from './components/NotFound';
import { useEffect, useState, } from 'react';

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
  const location = useLocation();
  const [userLocationWeather, setUserLocationWeather] = useState<NullableUserLocationWeather>(null);
  const [previewWeather, setPreviewWeather] = useState<PreviewWeatherInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<PermissionState>('prompt');

  useEffect(() => {
    async function fetchWeatherData() {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      setLocationPermission(result.state);
      try {
        setLoading(true);
        if (result.state === 'prompt' || result.state === 'denied') {
          await getPreviewWeather(cities);
        } else {
          getPreviewWeather(cities);
          await getUserLocationWeather();
        }
      } catch (e) {
        setError((e as Error).message || 'An error occurred.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    if (location.pathname === '/') {
      fetchWeatherData();
    } else {
      // TO-DO
    }

  }, [location.pathname]);

  async function getUserLocationWeather() {
    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const { latitude, longitude } = position.coords;
        try {
          const userLocationWeatherData = await fetchUserLocationWeatherData(latitude, longitude);
          setUserLocationWeather(userLocationWeatherData);
        } catch (error) {
          console.error('Error:', error);
          setUserLocationWeather(null);
        }
      } catch (error) {
        console.error('Error getting location:', error);
        setUserLocationWeather(null);
      }
    } else {
      setUserLocationWeather(null);
    }
  }

  async function fetchUserLocationWeatherData(latitude: number, longitude: number) {
    const response = await fetch(`${apiUrlDaily}&lat=${latitude}&lon=${longitude}`);
    return await response.json();
  }

  async function getPreviewWeather(cities: string[]) {
    const previewWeatherPromises = cities.map(city => fetchPreviewWeather(city));
    const previewWeatherArray = await Promise.all(previewWeatherPromises);
    setPreviewWeather(previewWeatherArray);
  }

  async function fetchPreviewWeather(city: string): Promise<PreviewWeatherInterface> {
    const previewWeatherResponse = await fetch(`${apiUrlCurrent}&q=${city}`);
    const previewWeatherData = await previewWeatherResponse.json();
    return previewWeatherData;
  }

  if (loading) {
    if (locationPermission === 'granted') {
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
          <Route path="/weather/:location" element={
            <>
              <h1 className="text-6xl text-center my-8">EasyWeather</h1>
              <Search />
              <div className="flex justify-center items-center h-loading">
                <div className="animate-spin border-8 border-gray-100 border-t-blue-500 rounded-3xl w-12 h-12">
                </div>
              </div>
              <DetailedWeather />
            </>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      );
    } else {
      return (
        <Routes>
          <Route path="/" element={
            <>
              <h1 className="text-6xl text-center my-8">EasyWeather</h1>
              <Search />
              <UserWeather data={userLocationWeather} />
              <div className="flex justify-center items-center h-loading-preview">
                <div className="animate-spin border-8 border-gray-100 border-t-blue-500 rounded-3xl w-12 h-12">
                </div>
              </div>
            </>
          } />
          <Route path="/weather/:location" element={
            <>
              <h1 className="text-6xl text-center my-8">EasyWeather</h1>
              <Search />
              <div className="flex justify-center items-center h-loading">
                <div className="animate-spin border-8 border-gray-100 border-t-blue-500 rounded-3xl w-12 h-12">
                </div>
              </div>
              <DetailedWeather />
            </>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      );
    }
  }

  if (error) {
    return (
      <div>Error: {error}</div>
    );
  }

  if (!loading) {
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
        <Route path="/weather/:location" element={
          <>
            <h1 className="text-6xl text-center my-8">EasyWeather</h1>
            <Search />
            <section>
              <DetailedWeather />
            </section>
          </>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }
}

export default App;
