const apiKey = "8954583a7ab59de50058944f2e7289ad";

async function getWeather() {
  const location = document.getElementById("location").value;
  const weatherDiv = document.getElementById("weather");
  const forecastDiv = document.getElementById("forecast");
  const error = document.getElementById("error");

  error.innerText = "";  // Clear errors
  weatherDiv.innerHTML = "";
  forecastDiv.innerHTML = "";

  if (!location) {
    error.innerText = "Please enter a location!";
    return;
  }

  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);
    if (!res.ok) throw new Error("Location not found");

    const data = await res.json();

    weatherDiv.innerHTML = `
      <h2>${data.name}</h2>
      <p>${data.weather[0].description}</p>
      <p>🌡️ ${data.main.temp}°C</p>
    `;

    // 5-day Forecast
    const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`);
    const forecastData = await forecastRes.json();

    let forecastHTML = "<h3>5-Day Forecast:</h3><ul>";
    for (let i = 0; i < forecastData.list.length; i += 8) {
      let day = forecastData.list[i];
      forecastHTML += `<li>${day.dt_txt}: ${day.main.temp}°C, ${day.weather[0].description}</li>`;
    }
    forecastHTML += "</ul>";
    forecastDiv.innerHTML = forecastHTML;

  } catch (err) {
    error.innerText = err.message;
  }
}
