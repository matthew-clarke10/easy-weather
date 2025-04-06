import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Search from './components/Search';
import UserWeather from './components/UserWeather';
import PreviewWeather from './components/PreviewWeather';
import DetailedWeather from './components/DetailedWeather';
import NotFound from './components/NotFound';
import { useEffect, useState, } from 'react';

// const apiKey = 'cc25d26bc930e2edf6c211fc3106986a';
const apiKey = '80582458eae5ce3112bfdedf6e61b8ed';
const apiUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=metric`;
const apiUrlDaily = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&units=metric`;

const cities = ['Hong Kong', 'Bangkok', 'London', 'Singapore', 'Macau', 'Paris', 'Dubai', 'New York City', 'Kuala Lumpur', 'Shenzhen', 'Phuket', 'Istanbul', 'Delhi', 'Tokyo', 'Rome', 'Antalya', 'Taipei', 'Guangzhou', 'Mumbai', 'Prague', 'Mecca', 'Miami', 'Amsterdam', 'Seoul', 'Pattaya', 'Shanghai', 'Los Angeles', 'Las Vegas', 'Agra', 'Osaka', 'Barcelona', 'Milan', 'Denpasar', 'Vienna', 'Cancún', 'Berlin', 'Johor Bahru', 'Johannesburg', 'Ho Chi Minh City', 'Riyadh', 'Venice', 'Jaipur', 'Madrid', 'Orlando', 'Chennai', 'Dublin', 'Florence', 'Moscow'];

interface UserLocationWeatherInterface {
  city: {
    name: string;
    country: string;
  }
  list: {
    dt: number;
    main: {
      temp_min: number;
      temp_max: number;
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

interface CurrentWeatherInterface {
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

interface ForecastWeatherInterface {
  city: {
    name: string;
    country: string;
  };
  list: ForecastDay[];
}

function App() {
  const location = useLocation();
  const [userLocationWeather, setUserLocationWeather] = useState<NullableUserLocationWeather>(null);
  const [previewWeather, setPreviewWeather] = useState<PreviewWeatherInterface[]>([]);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeatherInterface>();
  const [forecastWeather, setForecastWeather] = useState<ForecastWeatherInterface>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<PermissionState>('prompt');
  const [loadedPreviewWeather, setLoadedPreviewWeather] = useState(false);

  useEffect(() => {
    async function fetchWeatherData() {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      setLocationPermission(result.state);
      try {
        setLoading(true);
        if (result.state === 'prompt' || result.state === 'denied') {
          await getPreviewWeather(cities);
        } else {
          if (!loadedPreviewWeather) {
            getPreviewWeather(cities);
          }
          await getUserLocationWeather();
        }
      } catch (e) {
        setError((e as Error).message || 'An error occurred.');
        console.error(e);
      } finally {
        setLoadedPreviewWeather(true);
        setLoading(false);
      }
    }

    async function fetchDetailedWeatherData(city: string) {
      try {
        setLoading(true);
        getCurrentWeather(city);
        await getForecastWeather(city);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    async function getCurrentWeather(city: string) {
      const currentWeather = await fetchCurrentWeather(city);
      setCurrentWeather(currentWeather);
    }

    async function fetchCurrentWeather(city: string) {
      try {
        const currentWeatherResponse = await fetch(`${apiUrlCurrent}&q=${city}`);

        if (!currentWeatherResponse.ok) {
          throw new Error(`Error: ${currentWeatherResponse.status} ${currentWeatherResponse.statusText}`);
        }

        const currentWeatherData = await currentWeatherResponse.json();
        return currentWeatherData;
      } catch (e) {
        console.error("Error fetching current weather:", e);
        return null;
      }
    }

    async function getForecastWeather(city: string) {
      const forecastWeather = await fetchForecastWeather(city);
      setForecastWeather(forecastWeather);
    }

    async function fetchForecastWeather(city: string) {
      try {
        const forecastWeatherResponse = await fetch(`${apiUrlDaily}&q=${city}`);

        if (!forecastWeatherResponse.ok) {
          throw new Error(`Error: ${forecastWeatherResponse.status} ${forecastWeatherResponse.statusText}`);
        }

        let forecastWeatherData = await forecastWeatherResponse.json();
        forecastWeatherData = {
          ...forecastWeatherData,
          list: forecastWeatherData.list.filter((item: any) =>
            item.dt_txt.endsWith("09:00:00")
          ),
        };
        
        return forecastWeatherData;
      } catch (e) {
        console.error("Error fetching forecast weather:", e);
        return null;
      }
    }

    if (location.pathname === '/') {
      fetchWeatherData();
    } else if (location.pathname.startsWith('/weather/')) {
      const cityName = location.pathname.split('/weather/')[1].replace(/-/g, ' ');
      console.log(cityName);
      fetchDetailedWeatherData(cityName);
    }
  }, [locationPermission, location.pathname]);

  async function requestLocationAccess() {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    if (result.state === 'denied') {
      alert('Please enable location access in your browser settings.');
    } else {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationPermission('granted');
        },
        (error) => {
          setLocationPermission('denied');
          console.error('Location access denied', error);
        }
      );
    }
  }

  async function getUserLocationWeather() {
    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          return navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        try {
          let userLocationWeatherData = await fetchUserLocationWeatherData(latitude, longitude);
          userLocationWeatherData = {
            ...userLocationWeatherData,
            list: userLocationWeatherData.list.filter((item: any) =>
              item.dt_txt.endsWith("09:00:00")
            ),
          };
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
              <div className="flex flex-col justify-center items-center h-loading">
                <div className="animate-spin border-8 border-gray-100 border-t-blue-500 rounded-3xl w-12 h-12">
                </div>
                <div className="mt-4 text-2xl">Fetching local weather...</div>
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
              <DetailedWeather currentWeather={currentWeather} forecastWeather={forecastWeather} />
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
              <UserWeather locationPermission={locationPermission} requestLocationAccess={requestLocationAccess} data={userLocationWeather} />
              <div className="flex flex-col justify-center items-center h-loading-preview">
                <div className="animate-spin border-8 border-gray-100 border-t-blue-500 rounded-3xl w-12 h-12">
                </div>
                <div className="mt-4 text-2xl">Fetching popular city weather...</div>
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
              <DetailedWeather currentWeather={currentWeather} forecastWeather={forecastWeather} />
            </>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      );
    }
  }

  if (error) {
    return (
      <Routes>
        <Route path="/error" element={
          <>
            <h1 className="text-6xl text-center my-8">EasyWeather</h1>
            <Search />
            <section className="flex flex-col justify-center items-center h-loading text-2xl">
              <h1 className="text-6xl">Error</h1>
              <h2 className="m-8 text-center">An error occurred. Click the button below to return to the home page.</h2>
              <Link to="/" className="rounded-lg bg-sky-400 hover:bg-sky-500 focus:bg-sky-500 px-12 py-6">Back to Home</Link>
            </section>
          </>
        } />
      </Routes>
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
              <UserWeather locationPermission={locationPermission} requestLocationAccess={requestLocationAccess} data={userLocationWeather} />
              <PreviewWeather data={previewWeather} />
            </section>
          </>
        } />
        <Route path="/weather/:location" element={
          <>
            <h1 className="text-6xl text-center my-8">EasyWeather</h1>
            <Search />
            <section>
              <DetailedWeather currentWeather={currentWeather} forecastWeather={forecastWeather} />
            </section>
          </>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }
}

export default App;
