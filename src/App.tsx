import { Route, Routes } from 'react-router-dom'
import Search from './components/Search'
import UserWeather from './components/UserWeather'
import PreviewWeather from './components/PreviewWeather'
import DetailedWeather from './components/DetailedWeather'
import NotFound from './components/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <>
          <h1 className="text-6xl text-center my-8">EasyWeather</h1>
          <Search />
          <UserWeather />
          <h2 className="text-4xl text-center my-8">Popular City Weather</h2>
          <PreviewWeather />
        </>
      } />
      <Route path="/weather/:location" element={<DetailedWeather />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App