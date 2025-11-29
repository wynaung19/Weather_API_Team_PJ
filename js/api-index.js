function setBackground(conditionText, isDay) {
  let theme = "cloudy";

  const lower = conditionText.toLowerCase();
  if (lower.includes("sunny") || (lower.includes("clear") && isDay)) {
    theme = "sunny-day";
  } else if (lower.includes("clear") || lower.includes("sun")) {
    theme = "clear-night";
  } else if (lower.includes("partly cloudy")) {
    theme = "partly-cloudy";
  } else if (lower.includes("cloud") || lower.includes("overcast")) {
    theme = "cloudy";
  } else if (
    lower.includes("rain") ||
    lower.includes("drizzle") ||
    lower.includes("shower")
  ) {
    theme = "rainy";
  } else if (lower.includes("snow") || lower.includes("blizzard")) {
    theme = "snow";
  } else if (lower.includes("thunder") || lower.includes("storm")) {
    theme = "thunder";
  } else if (lower.includes("mist") || lower.includes("fog")) {
    theme = "mist";
  }

  document.body.className = theme;
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(startApi, showErr);
  } else {
    showErr("Location Error");
  }
}

function startApi(position) {
  const { latitude, longitude } = position.coords;
  const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}`;

  $.getJSON(url)
    .done((data) => displayWeather(data))
    .fail(() => showErr("Failed to load weather. Check your API key."));
}

function displayWeather(data) {
  const l = data.location;
  const c = data.current;

  $("#cityName").text(l.name);
  $("#country").text(l.country);
  $("#temperature").text(Math.round(c.temp_c) + "°");
  $("#conditionIcon").attr("src", "https:" + c.condition.icon);
  $("#conditionText").text(c.condition.text);
  $("#feelsLike").html(
    Math.round(c.feelslike_c) + '<span class="detail-unit">°C</span>'
  );
  $("#humidity").html(c.humidity + '<span class="detail-unit">%</span>');
  $("#windSpeed").html(c.wind_kph + '<span class="detail-unit"> km/h</span>');
  $("#windDir").text(c.wind_dir);
  $("#precip").html(c.precip_mm + '<span class="detail-unit"> mm</span>');
  $("#visibility").html(c.vis_km + '<span class="detail-unit"> km</span>');
  $("#pressure").html(c.pressure_mb + '<span class="detail-unit"> mb</span>');
  $("#uv").text(c.uv);
  $("#lastUpdated").text("Last updated: " + c.last_updated.split(" ")[1]);
  setBackground(c.condition.text, c.is_day === 1);

  $("#loading").hide();
  $("#weatherContent").fadeIn(800);
}

function showErr(msg) {
  $("#loading").hide();
  $("#error")
    .text(
      typeof msg === "object"
        ? "Please allow location access to see your weather."
        : msg
    )
    .show();
}

$(document).ready(() => getLocation());
