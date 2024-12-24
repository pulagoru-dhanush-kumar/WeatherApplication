const API_KEY = 'bd5e378503939ddaee76f12ad7a97608'; // Replace this with your OpenWeather API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

document.getElementById('searchForm').addEventListener('submit', event => {
  event.preventDefault();
  const city = document.getElementById('cityInput').value.trim();
  if (!city) {
    displayError('Please enter a city name.');
    return;
  }
  fetchWeather(city).then(data => {
    if (data) {
      displayWeather(data);
      addToFavorites(city);
    }
  });
});

function fetchWeather(city) {
  const url = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`;

  return fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.cod === 200) {
        clearError();
        return data;
      } else {
        throw new Error(data.message);
      }
    })
    .catch(error => {
      displayError('City not found. Please enter a valid city name.');
      console.error('Error fetching weather data:', error);
    });
}

function displayWeather(data) {
  const weatherDisplay = document.getElementById('weatherDisplay');
  const { name, main, weather } = data;

  weatherDisplay.innerHTML = `
    <h3>Weather in ${name}</h3>
    <p>Temperature: ${main.temp}°C</p>
    <p>Condition: ${weather[0].description}</p>
  `;
}

function displayError(message) {
  const weatherDisplay = document.getElementById('weatherDisplay');
  weatherDisplay.innerHTML = `<p style="color: red;">${message}</p>`;
}

function clearError() {
  const weatherDisplay = document.getElementById('weatherDisplay');
  weatherDisplay.innerHTML = '';
}

function addToFavorites(city) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  if (!favorites.includes(city)) {
    favorites.push(city);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
  } else {
    displayError(`${city} is already in your favorites.`);
  }
}

function displayFavorites() {
  const favList = document.getElementById('favoritesList');
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  favList.innerHTML = '';

  favorites.forEach(city => {
    const li = document.createElement('li');

    const cityText = document.createElement('span');
    cityText.textContent = city;

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => editFavorite(city));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Remove';
    deleteBtn.addEventListener('click', () => removeFromFavorites(city));

    const showWeatherBtn = document.createElement('button');
    showWeatherBtn.textContent = 'Show Weather';
    showWeatherBtn.addEventListener('click', () => fetchWeather(city).then(displayWeather));

    li.appendChild(cityText);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    li.appendChild(showWeatherBtn);

    favList.appendChild(li);
  });
}

function editFavorite(oldCity) {
  const newCity = prompt('Enter the new city name:', oldCity).trim();

  if (newCity && newCity !== oldCity) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.includes(newCity)) {
      displayError(`${newCity} is already in your favorites.`);
      return;
    }

    const index = favorites.indexOf(oldCity);
    if (index !== -1) {
      favorites[index] = newCity;
      localStorage.setItem('favorites', JSON.stringify(favorites));
      displayFavorites();
    }
  }
}

function removeFromFavorites(city) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites = favorites.filter(favCity => favCity !== city);

  localStorage.setItem('favorites', JSON.stringify(favorites));
  displayFavorites();
}

document.addEventListener('DOMContentLoaded', () => {
  displayFavorites();
});
