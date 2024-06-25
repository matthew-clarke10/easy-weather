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
          <Search />
          <UserWeather />
          <PreviewWeather />
        </>
      } />
      <Route path="/weather/:location" element={<DetailedWeather />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App