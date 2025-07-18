let hourlyData = [];

function fetchWeather() {
  const city = document.getElementById("cityInput").value || "Naperville";
  document.getElementById("hourlyBar").innerHTML = "";
  document.getElementById("weeklyForecast").innerHTML = "";

  hourlyData = [];
  for (let i = 0; i < 24; i++) {
    const temp = 65 + (i % 5);
    const wind = 5 + (i % 3);
    const humidity = 50 + (i % 10);
    const rain = i % 4 === 0 ? 0.5 : 0;
    const visibility = 5 + (i % 2);
    const uv = i % 8;
    const aqi = 30 + i * 2;

    const pwi = (
      (1 - Math.abs(temp - 70) / 30) * 2 +
      (1 - wind / 20) * 1.5 +
      (1 - humidity / 100) * 1 +
      (1 - rain / 2) * 1 +
      (visibility / 10) * 1 +
      (1 - uv / 10) * 1 +
      (1 - aqi / 200) * 1.5
    );
    const pwiClamped = Math.max(0, Math.min(10, pwi.toFixed(1)));

    hourlyData.push({ hour: i, temp, wind, humidity, rain, visibility, uv, aqi, pwi: pwiClamped });

    const box = document.createElement("div");
    box.className = "hour-box";
    const colorClass = pwiClamped >= 8 ? 'pwi-high' : pwiClamped >= 5 ? 'pwi-medium' : 'pwi-low';
    const icon = pwiClamped >= 8 ? '🏆' : pwiClamped >= 5 ? '👍' : '🚫';
    box.innerHTML = `<strong>${i}:00</strong><br>${icon}<br><span class="${colorClass}">${pwiClamped}</span>`;
    box.onclick = () => showDetails(i);
    document.getElementById("hourlyBar").appendChild(box);
  }

  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  for (let i = 0; i < 7; i++) {
    const card = document.createElement("div");
    card.className = "day-card";
    card.innerHTML = `<strong>${days[(new Date().getDay() + i) % 7]}</strong>: 🌤️ ${70 + i}°F / ${60 + i}°F`;
    document.getElementById("weeklyForecast").appendChild(card);
  }
}

function showDetails(hour) {
  const data = hourlyData[hour];
  const details = `
    <h3>Pickleball Weather: ${
      data.pwi >= 8 ? 'Excellent' : data.pwi >= 5 ? 'Good' : 'Poor'
    }</h3>
    <ul>
      <li>Temperature: ${data.temp}°F</li>
      <li>Wind: ${data.wind} mph</li>
      <li>Humidity: ${data.humidity}%</li>
      <li>Rain: ${data.rain} mm</li>
      <li>Visibility: ${data.visibility} mi</li>
      <li>UV Index: ${data.uv}</li>
      <li>AQI: ${data.aqi}</li>
    </ul>
  `;
  document.getElementById("detailsContent").innerHTML = details;
  drawGauge(data.pwi);
}

function drawGauge(score) {
  const ctx = document.getElementById("pwiChart").getContext("2d");
  if (window.pwiChart) window.pwiChart.destroy();
  window.pwiChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['PWI'],
      datasets: [{
        data: [score, 10 - score],
        backgroundColor: [score >= 8 ? 'green' : score >= 5 ? 'goldenrod' : 'red', '#e0e0e0'],
        borderWidth: 0
      }]
    },
    options: {
      rotation: -90,
      circumference: 180,
      cutout: '70%',
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      }
    }
  });
}
