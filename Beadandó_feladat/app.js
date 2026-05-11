const API_BASE = 'https://iit-playground.arondev.hu/api';
const CAR_BRANDS = ['Toyota', 'Honda', 'Ford', 'BMW', 'Audi', 'Suzuki', 'Opel', 'Skoda', 'Volkswagen'];

// Neptun kód kezelése helyi tárhelyen
function getNeptun() { return localStorage.getItem('neptun') || ''; }
function setNeptun(code) { localStorage.setItem('neptun', code.toUpperCase()); }
function clearNeptun() { localStorage.removeItem('neptun'); }

function handleLogout() {
    clearNeptun();
    window.location.href = 'index.html';
}

// Navigációs sáv betöltése és megjelenítése
function loadNavigation() {
    fetch('navbar.html')
        .then(res => res.text())
        .then(navbarHTML => {
            document.body.insertAdjacentHTML('afterbegin', navbarHTML);
            if (getNeptun()) {
                document.getElementById('nav-actions').classList.remove('hidden');
            }
        })
        .catch(err => console.error(err));
}

//API hívások
function getCars(neptun) {
    return fetch(`${API_BASE}/${neptun}/car`).then(res => {
        if (!res.ok) throw new Error(`Szerverhiba: ${res.status}`);
        return res.json();
    }); 
}

//autó részletes lekérdezése ID szerint
function getCarDetails(neptun, id) {
    return fetch(`${API_BASE}/${neptun}/car/${id}`).then(res => {
        if (!res.ok) throw new Error(`Szerverhiba: ${res.status}`);
        return res.json();
    });
}

//autó létrehozása és frissítése, törlése
function createCar(neptun, carData) {
    return fetch(`${API_BASE}/${neptun}/car`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carData)
    }).then(res => {
        if (!res.ok) throw new Error(`Szerverhiba: ${res.status}`);
        return res.json();
    });
}
function updateCar(neptun, carData) {
    return fetch(`${API_BASE}/${neptun}/car`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carData)
    }).then(res => {
        if (!res.ok) throw new Error(`Szerverhiba: ${res.status}`);
        return res.json();
    });
}
function deleteCar(neptun, id) {
    return fetch(`${API_BASE}/${neptun}/car/${id}`, { method: 'DELETE' })
        .then(res => {
            if (!res.ok) throw new Error(`Szerverhiba: ${res.status}`);
            if (res.status === 204 || res.status === 200) return null;
            return res.json();
        });
}

// Márkák feltöltése a legördülő listába
function fillBrandSelect(selectId) {
    const select = document.getElementById(selectId);
    CAR_BRANDS.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        select.appendChild(option);
    });
}

loadNavigation();