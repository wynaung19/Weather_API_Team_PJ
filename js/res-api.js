const urlParams = new URLSearchParams(window.location.search);
const city = urlParams.get("city") || "Yangon";

fetch(
  `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(
    city
  )}`
)
  .then((r) => r.json())
  .then((d) => {
    const c = d.current,
      l = d.location;

    document.title = `${l.name} Weather | Team 7`;
    document.getElementById("city").textContent = l.name;
    document.getElementById("country").textContent = l.country;
    document.getElementById("temp").textContent = Math.round(c.temp_c) + "°";
    document.getElementById("icon").src = "https:" + c.condition.icon;
    document.getElementById("text").textContent = c.condition.text;
    document.getElementById("time").textContent = c.last_updated.split(" ")[1];

    document.getElementById("feels").innerHTML =
      Math.round(c.feelslike_c) + '<span class="unit">°C</span>';
    document.getElementById("humid").innerHTML =
      c.humidity + '<span class="unit">%</span>';
    document.getElementById("wind").innerHTML =
      c.wind_kph + '<span class="unit"> km/h</span>';
    document.getElementById("dir").textContent = c.wind_dir;
    document.getElementById("precip").innerHTML =
      c.precip_mm + '<span class="unit"> mm</span>';
    document.getElementById("vis").innerHTML =
      c.vis_km + '<span class="unit"> km</span>';
    document.getElementById("press").innerHTML =
      c.pressure_mb + '<span class="unit"> mb</span>';
    document.getElementById("uv").textContent = c.uv;

    let bg = "cloudy";
    const txt = c.condition.text.toLowerCase();
    if (txt.includes("sunny") || (txt.includes("clear") && c.is_day))
      bg = "sunny-day";
    else if (txt.includes("clear")) bg = "clear-night";
    else if (txt.includes("partly cloudy")) bg = "partly-cloudy";
    else if (txt.includes("cloud")) bg = "cloudy";
    else if (txt.includes("rain") || txt.includes("drizzle")) bg = "rainy";
    else if (txt.includes("snow")) bg = "snow";
    else if (txt.includes("thunder") || txt.includes("storm")) bg = "thunder";
    else if (txt.includes("mist") || txt.includes("fog")) bg = "mist";
    document.body.className = bg;
    document.getElementById("content").style.display = "flex";
  })
  .catch(() => {
    document.body.innerHTML = `<div style="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:20px">
      <h1>City not found</h1>
      <a href="index.html" style="color:#00d4ff;text-decoration:underline">Back to search</a>
    </div>`;
  });
