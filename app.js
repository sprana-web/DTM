mapboxgl.accessToken = 'pk.eyJ1Ijoic2FqaXRoLTkzMCIsImEiOiJjbHM0OTdzcTMwMWFzMmpueHRyYnM5M3JvIn0.Rim5QyMVWVCM4y-oJcT2TA'; // Replace with your Mapbox token

const bounds = [
    [10.26, 60.32], // Southwest coordinates
    [11.44, 61.21]  // Northeast coordinates
];

// Initialize Mapbox map
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: [11.1, 60.60], // Centered on Lake Mjøsa
    zoom: 10.5,
    pitch: 60, // Pitch the map for a 3D effect
    bearing: -17.6,
    maxBounds: bounds // Set the map bounds
});

// Function to add 3D terrain and sky layers
function addTerrainAndSky() {
    map.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
    });
    map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

    map.addLayer({
        'id': 'sky',
        'type': 'sky',
        'paint': {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 0.0],
            'sky-atmosphere-sun-intensity': 15
        }
    });
}

// Add 3D terrain and sky layers on map load
map.on('load', addTerrainAndSky);

// Locations with their respective coordinates and weather widget URLs
const locations = [
    { name: 'Lillehammer', coordinates: [10.4663, 61.1153], url: 'https://www.yr.no/en/content/1-143669/card.html?mode=dark' },
    { name: 'Gjøvik', coordinates: [10.6917, 60.7957], url: 'https://www.yr.no/en/content/1-130075/card.html?mode=dark' },
    { name: 'Moelv', coordinates: [10.7017, 60.9340], url: 'https://www.yr.no/en/content/1-129672/card.html?mode=dark' },
    { name: 'Hamar', coordinates: [11.0671, 60.7945], url: 'https://www.yr.no/en/content/1-131071/card.html?mode=dark' },
    { name: 'Brumunddal', coordinates: [10.9393, 60.8800], url: 'https://www.yr.no/en/content/1-130685/card.html?mode=dark' }
];

// Add markers for each location
locations.forEach(location => {
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker(el)
        .setLngLat(location.coordinates)
        .addTo(map)
        .getElement()
        .addEventListener('click', () => showWeatherWidget(location.url));
});

// Function to show weather widget in a popup
function showWeatherWidget(url) {
    const popup = document.getElementById('weather-popup');
    const iframe = document.getElementById('weather-iframe');
    iframe.src = url;
    popup.style.display = 'block';
}

// Toggle switch to change the base map
const toggleSwitch = document.getElementById('basemap-toggle');

toggleSwitch.addEventListener('change', () => {
    const newStyle = toggleSwitch.checked ? 'mapbox://styles/mapbox/outdoors-v11' : 'mapbox://styles/mapbox/satellite-v9';
    map.setStyle(newStyle);

    map.once('styledata', addTerrainAndSky); // Reapply terrain and sky layers after style change
});