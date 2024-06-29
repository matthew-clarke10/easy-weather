import { Route, Routes } from 'react-router-dom'
import Search from './components/Search'
import UserWeather from './components/UserWeather'
import PreviewWeather from './components/PreviewWeather'
import DetailedWeather from './components/DetailedWeather'
import NotFound from './components/NotFound'
import { useState } from 'react'

function App() {
  const [userWeatherLoading, setUserWeatherLoading] = useState(true);
  const [previewWeatherLoading, setPreviewWeatherLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);

  function handleUserWeatherLoaded() {
    setUserWeatherLoading(false);
    handlePageLoaded();
  }

  function handlePreviewWeatherLoaded() {
    setPreviewWeatherLoading(false);
    handlePageLoaded();
  }

  function handlePageLoaded() {
    if (!userWeatherLoading && !previewWeatherLoading) {
      setPageLoading(false);
    }
  }

  return (
    <Routes>
      <Route path="/" element={
        <>
          <h1 className="text-6xl text-center my-8">EasyWeather</h1>
          <Search />
          <section>
            {pageLoading ? (
              <>
                <div className="flex justify-center items-center h-loading">
                  <div className="animate-spin border-8 border-gray-100 border-t-blue-500 rounded-3xl w-12 h-12">{pageLoading}</div>
                </div>
                <UserWeather onUserWeatherLoaded={handleUserWeatherLoaded} />
                <h2 className="text-4xl text-center my-8">Popular City Weather</h2>
                <PreviewWeather onPreviewWeatherLoaded={handlePreviewWeatherLoaded} />
              </>
            ) : (
              <>
                <UserWeather onUserWeatherLoaded={handleUserWeatherLoaded} />
                <h2 className="text-4xl text-center my-8">Popular City Weather</h2>
                <PreviewWeather onPreviewWeatherLoaded={handlePreviewWeatherLoaded} />
              </>
            )}
          </section>
        </>
      } />
      <Route path="/weather/:location" element={<DetailedWeather />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App