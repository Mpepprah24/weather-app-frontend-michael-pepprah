const apiKey = "8954583a7ab59de50058944f2e7289ad";

const searchBtn = document.getElementById("search-btn");
const currentBtn = document.getElementById("current-location-btn");
const errorEl  = document.getElementById("error-message");

searchBtn.addEventListener("click", getWeatherByCity);
currentBtn.addEventListener("click", getWeatherByGeo);

async function getWeatherByCity() {
  const location = document.getElementById("location").value.trim();
  if (!location) {
    return (errorEl.innerText = "Please enter a location!");
  }
  await fetchAndDisplay(`q=${encodeURIComponent(location)}`);
}

function getWeatherByGeo() {
  if (!navigator.geolocation) {
    return (errorEl.innerText = "Geolocation not supported.");
  }
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      fetchAndDisplay(`lat=${coords.latitude}&lon=${coords.longitude}`);
    },
    () => (errorEl.innerText = "Unable to retrieve your location.")
  );
}

async function fetchAndDisplay(query) {
  errorEl.innerText = "";
  // Current weather
  try {
    const [weatherRes, forecastRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=metric`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?${query}&appid=${apiKey}&units=metric`)
    ]);
    if (!weatherRes.ok) throw new Error("Location not found");
    const weather = await weatherRes.json();
    document.getElementById("location-name").innerText = weather.name;
    document.getElementById("temperature").innerText = `${weather.main.temp}°C`;
    document.getElementById("weather-icon").src =
      `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`;
    document.getElementById("humidity").innerText = `${weather.main.humidity}%`;
    document.getElementById("wind").innerText = `${weather.wind.speed} km/h`;

    // 5-day forecast (every 8th entry ≈ 24h)
    const forecastData = await forecastRes.json();
    const container = document.getElementById("forecast-items");
    container.innerHTML = "";
    forecastData.list
      .filter((_, i) => i % 8 === 0)
      .forEach(day => {
        const date = day.dt_txt.split(" ")[0];
        const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
        container.innerHTML += `
          <div class="forecast-item">
            <p>${date}</p>
            <img src="${iconUrl}" alt="${day.weather[0].description}" />
            <p>${day.main.temp}°C</p>
            <small>${day.weather[0].description}</small>
          </div>`;
      });

  } catch (err) {
    errorEl.innerText = err.message;
  }
}


  } catch (err) {
    error.innerText = err.message;
  }
}
