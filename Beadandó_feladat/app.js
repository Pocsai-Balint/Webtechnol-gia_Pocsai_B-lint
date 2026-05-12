const API_BASE = 'https://iit-playground.arondev.hu/api';
const CAR_BRANDS = [
    'Toyota','Honda','Ford','Chevrolet','Nissan',
    'BMW','Mercedes-Benz','Volkswagen','Audi','Hyundai',
    'Kia','Subaru','Lexus','Mazda','Tesla',
    'Jeep','Porsche','Volvo','Jaguar','Land Rover',
    'Mitsubishi','Ferrari','Lamborghini', 'Suzuki'
];

function getNeptun() { return localStorage.getItem('neptun') || ''; }
function setNeptun(code) { localStorage.setItem('neptun', code.toUpperCase()); }
function clearNeptun() { localStorage.removeItem('neptun'); }

function handleLogout() {
    clearNeptun();
    window.location.href = 'index.html';
}

function loadNavigation() {
    const navbarHTML = `
        <nav class="navbar">
            <div class="nav-brand">
                <a href="autok.html">BorsodTaxi</a>
            </div>
            <div id="nav-actions" class="hidden">
                <a href="autok.html">Autók Listája</a>
                <a href="uj-auto.html">Új autó felvétele</a>
                <button class="btn btn-danger" onclick="handleLogout()">Kijelentkezés</button>
            </div>
        </nav>`;
    
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);
    
    if (getNeptun()) {
        const actions = document.getElementById('nav-actions');
        if (actions) actions.classList.remove('hidden');
    }
}

function getCars(neptun) {
    return fetch(`${API_BASE}/${neptun}/car`).then(res => {
        if (!res.ok) throw new Error(`Hiba: ${res.status}`);
        return res.json();
    }); 
}

function getCarDetails(neptun, id) {
    return fetch(`${API_BASE}/${neptun}/car/${id}`).then(res => {
        if (!res.ok) throw new Error(`Hiba: ${res.status}`);
        return res.json();
    });
}

function createCar(neptun, carData) {
    return fetch(`${API_BASE}/${neptun}/car`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carData)
    }).then(async res => {
        const adatok = await res.json();
        if (!res.ok) throw new Error(adatok.message || `Szerverhiba: ${res.status}`);
        return adatok;
    });
}

function updateCar(neptun, carData) {
    return fetch(`${API_BASE}/${neptun}/car`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carData)
    }).then(async res => {
        const adatok = await res.json();
        if (!res.ok) throw new Error(adatok.message || `Szerverhiba: ${res.status}`);
        return adatok;
    });
}

function deleteCar(neptun, id) {
    return fetch(`${API_BASE}/${neptun}/car/${id}`, { method: 'DELETE' })
        .then(async res => {
            if (!res.ok) {
                const adatok = await res.json();
                throw new Error(adatok.message || `Hiba: ${res.status}`);
            }
            return res.status === 204 ? null : res.json();
        });
}

function fillBrandSelect(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;
    CAR_BRANDS.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        select.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', loadNavigation);
