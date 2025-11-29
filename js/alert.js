const alertsContainer = document.getElementById("alertList");

async function loadAlerts() {
  let alerts = [];
  //Recent Earthquakes api
  try {
    const eq = await fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"
    );
    const data = await eq.json();
    data.features.slice(0, 6).forEach((q) => {
      alerts.push({
        title: `Magnitude ${q.properties.mag} Earthquake`,
        location: q.properties.place,
        time: new Date(q.properties.time).toLocaleString(),
        desc:
          q.properties.mag > 6
            ? "Strong earthquake — possible damage and tsunami risk"
            : "Significant earthquake detected",
        type: "quake",
      });
    });
  } catch (e) {
    console.log("Earthquake API failed");
  }

  //Severe Weather Alerts api
  try {
    const res = await fetch(
      "https://api.weather.gov/alerts/active?status=actual&message_type=alert&limit=10"
    );
    const json = await res.json();
    json.features
      .filter((a) => a.properties.severity !== "Minor")
      .slice(0, 6)
      .forEach((a) => {
        alerts.push({
          title: a.properties.event,
          location: a.properties.areaDesc,
          time: new Date(a.properties.sent).toLocaleString(),
          desc:
            a.properties.headline || a.properties.description.split("\n")[0],
          type: "storm",
        });
      });
  } catch (e) {
    // placeholder
    alerts.push(
      {
        title: "Tropical Storm Warning",
        location: "Bay of Bengal, India & Bangladesh",
        time: "Just now",
        desc: "Storm expected to intensify. Heavy rain and strong winds.",
        type: "storm",
      },
      {
        title: "Flash Flood Warning",
        location: "Central Europe",
        time: "2 hours ago",
        desc: "Heavy rainfall causing flooding in multiple regions.",
        type: "storm",
      }
    );
  }
  // simple js sorting
  alerts.sort((a, b) => new Date(b.time) - new Date(a.time));

  // Display
  if (alerts.length === 0) {
    alertsContainer.innerHTML =
      '<div class="no-alerts">No active alerts right now. All clear!</div>';
  } else {
    alertsContainer.innerHTML = alerts
      .map(
        (a) => `
          <div class="alert-card">
            <div class="alert-title">${a.title}</div>
            <div class="alert-location">Location: ${a.location}</div>
            <div class="alert-time">Time: ${a.time}</div>
            <div class="alert-desc">${a.desc}</div>
          </div>
        `
      )
      .join("");
  }
}

loadAlerts();
