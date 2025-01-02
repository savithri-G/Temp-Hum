// Show content for Home, Area, or Contact sections
function showContent(sectionId) {
  document.querySelectorAll('.content-section').forEach((section) => {
    section.style.display = 'none';
  });
  document.getElementById(sectionId).style.display = 'block';

  if (sectionId === 'areas') {
    fetchDataAndUpdateDashboard();
  }
}

// Fetch data from ThinkSpeak API
async function fetchDataAndUpdateDashboard() {
  const apiKey = "PS6KPWYX8H6GV9GL";
  const channelId = "2793088";
  const url = `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&results=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.feeds && data.feeds.length > 0) {
      const feed = data.feeds[0];
      const timestamp = feed.created_at || new Date().toISOString(); // Use API timestamp or fallback to system time
      const temperature1 = feed.field2 || 0;
      const humidity1 = feed.field1 || 0;

      const temperature2 = feed.field3 || 0;
      const humidity2 = feed.field4 || 0;
      
      const temperature3 = feed.field5 || 0;
      const humidity3 = feed.field6 || 0;

      // Update dashboard
      updateLocationDetails("details1", temperature1, humidity1);
      updateLocationDetails("details2", temperature2, humidity2);
      updateLocationDetails("details3", temperature3, humidity3);

      // Update timestamp
      document.getElementById("timestamp").innerText = `Last updated: ${new Date(timestamp).toLocaleString()}`;
    } else {
      // Default values if no data is available
      updateLocationDetails("details1", 0, 0);
      updateLocationDetails("details2", 0, 0);
      updateLocationDetails("details3", 0, 0);

      // Use system timestamp as fallback
      const currentTimestamp = new Date().toLocaleString();
      document.getElementById("timestamp").innerText = `Last updated: ${currentTimestamp}`;
    }
  } catch (error) {
    console.error("Error fetching data from ThinkSpeak:", error);

    // Default values in case of error
    updateLocationDetails("details1", 0, 0);
    updateLocationDetails("details2", 0, 0);
    updateLocationDetails("details3", 0, 0);

    // Use system timestamp as fallback
    const currentTimestamp = new Date().toLocaleString();
    document.getElementById("timestamp").innerText = `Last updated: ${currentTimestamp}`;
  }
}

// Update details for a location
function updateLocationDetails(locationId, temp, humidity) {
  const detailsElement = document.getElementById(locationId);
  detailsElement.innerHTML = `
    <p><span class="icon">🌞</span> Temperature: <strong>${temp}°C</strong></p>
    <p><span class="icon">💧</span> Humidity: <strong>${humidity}%</strong></p>
  `;
  detailsElement.classList.add('visible');
}

// Default to show Home on page load
document.addEventListener('DOMContentLoaded', () => {
  showContent('Home');
});
