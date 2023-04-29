import { displayMap } from './mapbox.js';
import { login, logout } from './login';

// DOM

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('form');
const logoutButton = document.querySelector('.nav__el--logout');

// VALUES

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutButton) {
  logoutButton.addEventListener('click', logout);
}
