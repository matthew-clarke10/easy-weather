import { useEffect } from 'react';

function UserWeather() {
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          //fetchWeatherData(latitude, longitude);
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
    <section className="w-11/12 h-72 mt-4 mx-auto justify-center border-2 border-red-200 flex items-center">
      <section className="userLocation flex flex-col justify-center items-center">
        <button>Allow Location Access</button>
        <div>Allow location access to see your local weather, or search your city above manually.</div>
      </section>
    </section>
  )
}

export default UserWeather