const body = document.getElementById('body');
const header = document.getElementById('header');
const mapContainer = document.querySelector('.map');
const locationInfo = document.getElementById('location-info');
const ipInput = document.getElementById('ip-input');
const buttonSwitchMode = document.getElementById('button-switch-mode');
const footer = document.getElementById('footer');

const apiKey = 'at_ZjLC3fBlzqfCWGgfQ6zI4CzuRjA5d';

const map = L.map('map').setView([0, 0], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
}).addTo(map);

L.control.scale().addTo(map);

function validateIPAddress(ipAddress) {
    const ipRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    if (!ipRegex.test(ipAddress)) {
        alert('Dirección IP no válida');
        return false;
    }

    const octets = ipAddress.split('.').map(octet => parseInt(octet, 10));
    if (octets.some(octet => octet < 0 || octet > 255)) {
        alert('Dirección IP no válida');
        return false;
    }

    return true;
}

async function getIPUser() {
    try {
        const response = await fetch(`https://geo.ipify.org/api/v1?apiKey=${apiKey}`);
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.log('Error al obtener la dirección IP: ' + error);
    }
}

async function mapIP(ip) {
    try {
        const response = await fetch(`https://geo.ipify.org/api/v1?apiKey=${apiKey}&ipAddress=${ip}`);
        const locationData = await response.json();

        const { lat, lng } = locationData.location;
        map.setView([lat, lng], 13);
        L.marker([lat, lng]).addTo(map).bindPopup(ip).openPopup();

        document.getElementById('country').textContent = locationData.location.country;
        document.getElementById('region').textContent = locationData.location.region;
        document.getElementById('city').textContent = locationData.location.city;
        document.getElementById('postal').textContent = locationData.location.postal;
    } catch (error) {
        console.log('Error al obtener la ubicación: ' + error);
    }
}

document.getElementById('search-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const ip = document.getElementById('ip-input').value;
    
    if (validateIPAddress(ip)) {
        await mapIP(ip);
    }
});

function toggleDarkMode() {
    body.classList.toggle('dark-body');
    header.classList.toggle('dark-header');
    mapContainer.classList.toggle('dark-map');
    locationInfo.classList.toggle('dark-location-info');
    footer.classList.toggle('dark-footer');
    ipInput.classList.toggle('dark-ip-input');
}

document.getElementById('button-switch-mode').addEventListener('click', function () {
    toggleDarkMode();
});

async function initMapWithUserIP() {
    try {
        const ipAddress = await getIPUser();
        await mapIP(ipAddress);
    } catch (error) {
        console.log(error);
    }
}

initMapWithUserIP();

L.Control.geocoder().addTo(map);
