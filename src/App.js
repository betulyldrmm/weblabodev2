import React, { useState, useEffect } from 'react';
import './App.css';
import getNews from './api';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

function App() {
  const [news, setNews] = useState([]);
  const [smallNews, setSmallNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [weatherData, setWeatherData] = useState({});
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const [currencyData, setCurrencyData] = useState(null);
  const [currencyLoading, setCurrencyLoading] = useState(false);
  const [currencyError, setCurrencyError] = useState(null);

  const categories = ['General', 'Business', 'Technology', 'Entertainment', 'Sports', 'Health', 'Science'];
  const cities = ['Istanbul', 'Washington', 'Berlin', 'Paris', 'Romania'];
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
    fetchSmallNews();
    fetchWeather();
    fetchExchangeRates();

    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
      setIsLoggedIn(true);
    }

    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites);

    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  const fetchExchangeRates = async () => {
    setCurrencyLoading(true);
    setCurrencyError(null);
    const apiKey = "335651143353d37e6d15a9ef";
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API Hatası: ${response.statusText}`);
      }
      const data = await response.json();
      
      if (data.conversion_rates) {
        const usdToTry = data.conversion_rates.TRY;
        const eurToTry = usdToTry * (1 / data.conversion_rates.EUR);
        setCurrencyData({
          usdToTry,
          eurToTry
        });
      }
    } catch (error) {
      console.error("Döviz kuru verisi alınamadı:", error);
      setCurrencyError('Döviz kuru verisi alınamadı');
    } finally {
      setCurrencyLoading(false);
    }
  };

  

  const fetchWeather = async () => {
    setWeatherLoading(true);
    const apiKey = '3ceab4472a49c5efbe3273634eaafeb9';
    let data = {};

    try {
      for (let city of cities) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`API Hatası: ${response.statusText}`);
        }

        const cityData = await response.json();
        
        data[city] = {
          temperature: cityData.main.temp,
          condition: cityData.weather[0].description,
        };
      }

      setWeatherData(data);
    } catch (error) {
      console.error('Hava durumu verisi alınamadı:', error);
      setWeatherError('Hava durumu verisi alınamadı');
    } finally {
      setWeatherLoading(false);
    }
  };

  const fetchNews = async (category = 'general') => {
    setLoading(true);
    setError(null);
    try {
      const fetchedNews = await getNews(category);
      setNews(fetchedNews);
    } catch (error) {
      setError('Haberler yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSmallNews = async () => {
    try {
      const fetchedSmallNews = await getNews('technology');
      setSmallNews(fetchedSmallNews);
    } catch (error) {
      console.error('Küçük haberler yüklenirken hata:', error);
    }
  };

  

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const toggleFavorite = (item) => {
    const updatedFavorites = favorites.includes(item)
      ? favorites.filter(fav => fav !== item)
      : [...favorites, item];

    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

    const sortedNews = [...news].sort((a, b) => {
      const isAFavorite = updatedFavorites.includes(a);
      const isBFavorite = updatedFavorites.includes(b);
      return isBFavorite - isAFavorite;
    });
    setNews(sortedNews);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('username');
    window.location.href = 'https://www.google.com';
  };

  const handleSmallNewsClick = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode);
  };

  const goToAbonePage = () => {
    window.location.href = '/abone.html';
  };

  return (
    <div className={`darkMode ${darkMode ? 'dark-mode' : ''}`}>
      <div className="header-container">
        <div className="header-content">
          <h1 className="site-title">WN</h1>
          <hr />

          {isLoggedIn && <h2 className="welcome-message" >Hi, {username}!</h2>}
          <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>

            <div className="header-actions">
              <ul className="categories">
                {categories.map((category, index) => (
                  <li key={index} onClick={() => fetchNews(category.toLowerCase())}>{category}</li>
                ))}
              </ul>

              <button className="abone-btn" onClick={goToAbonePage}>Abonelik</button>

              <input 
                type="text" 
                className="search-bar" 
                placeholder="Haber Ara..." 
                value={searchTerm} 
                onChange={handleSearch} 
              />
            
              

              <div className="theme-toggle">
              
                <button onClick={handleLogout} className="logout-btn">Çıkış Yap</button>
                </div>
            </div>
          </div>
        </div>
      
        </div>
      <div className="widgets-container">
        <div className="weather-widget">
          <h3>Hava Durumu:</h3>
          {weatherLoading && <p>Hava durumu yükleniyor...</p>}
          {weatherError && <p className="error-message">{weatherError}</p>}
          {!weatherLoading && !weatherError && Object.keys(weatherData).map((city) => (
            <div key={city} className="city-weather">
              <h4>{city}</h4>
              <p>Sıcaklık: {weatherData[city].temperature}°C</p>
              <p>Durum: {weatherData[city].condition}</p>
            </div>
          ))}
        </div>

        <div className="currency-widget">
          <h3>Döviz Kurları:</h3>
          {currencyLoading && <p>Döviz kurları yükleniyor...</p>}
          {currencyError && <p className="error-message">{currencyError}</p>}
          {!currencyLoading && !currencyError && currencyData && (
            <>
              <p>1 USD💲 = {currencyData.usdToTry.toFixed(2)} TRY</p>
              <p>1 EUR💶 = {currencyData.eurToTry.toFixed(2)} TRY</p>
             
     
            </>
          )}
        </div>
      </div>

      <hr className="divider" />

      <div className="content-container">
        <div className="main-news">
          {loading && <p>Yükleniyor...</p>}
          {error && <p className="error-message">{error}</p>}
          {!loading && !error && news
            .filter(item => item.title.toLowerCase().includes(searchTerm))
            .map((item, index) => (
              <div key={index} className="main-card">
                <img 
                  src={item.urlToImage || 'https://via.placeholder.com/400x200'}
                  alt={item.title}
                />
                <div className="card-body">
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-text">{item.description}</p>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">Haberi Oku</a>
                  <button onClick={() => toggleFavorite(item)} className="favorite-btn">
                    {favorites.includes(item) ? '❤️' : '🤍'}
                  </button>
                </div>
              </div>
            ))}
        </div>

        <div className="sidebar">
          {smallNews.slice(0, 25).map((item, index) => (
            <div 
              key={index} 
              className="small-news-card" 
              onClick={() => handleSmallNewsClick(item.url)}
              style={{ cursor: 'pointer' }}
            >
              <img 
                src={item.urlToImage || 'https://via.placeholder.com/80'}
                alt={item.title}
              />
              <div className="small-news-card-body">
                <h5 className="small-news-card-title">{item.title}</h5>
                <p className="small-news-card-text">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;