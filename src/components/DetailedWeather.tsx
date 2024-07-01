import { useLocation } from 'react-router-dom';

function DetailedWeather() {
  const location = useLocation();
  const { state } = location;

  return (
    <h1>{state}</h1>
  )
}

export default DetailedWeather