import './style.css'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

async function sha256Hex(text) {
  const data = new TextEncoder().encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

const loginView = document.getElementById('login-view')
const mapView = document.getElementById('map-view')
const loginForm = document.getElementById('login-form')
const loginError = document.getElementById('login-error')

const PARIS_BOUNDS = L.latLngBounds([48.815, 2.224], [48.902, 2.470])

function showMap() {
  loginView.hidden = true
  mapView.hidden = false

  const lat = parseFloat(import.meta.env.VITE_PIN_LAT)
  const lng = parseFloat(import.meta.env.VITE_PIN_LNG)
  const label = import.meta.env.VITE_PIN_LABEL || ''

  const map = L.map('map', {
    minZoom: 12,
    maxZoom: 18,
    maxBounds: PARIS_BOUNDS,
    maxBoundsViscosity: 1.0,
  }).setView([lat, lng], 15)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map)

  L.marker([lat, lng]).addTo(map).bindPopup(label).openPopup()
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault()

  const username = document.getElementById('username').value
  const password = document.getElementById('password').value

  const [usernameHash, passwordHash] = await Promise.all([
    sha256Hex(username),
    sha256Hex(password),
  ])

  const validUsername = usernameHash === import.meta.env.VITE_APP_USERNAME_HASH
  const validPassword = passwordHash === import.meta.env.VITE_APP_PASSWORD_HASH

  if (validUsername && validPassword) {
    loginError.hidden = true
    showMap()
  } else {
    loginError.hidden = false
  }
})
