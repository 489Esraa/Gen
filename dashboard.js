// dashboard.js

// Get DB instance initialized by firebase-config.js
const database = window.hydroGenDB;

// DOM Elements
const tankLevelPercent = document.getElementById('tankLevelPercent');
const tankLevelFill = document.getElementById('tankLevelFill');
const tankLevelCm = document.getElementById('tankLevelCm');
const envTemp = document.getElementById('envTemp');
const envHum = document.getElementById('envHum');
const envSoil = document.getElementById('envSoil');
const pumpStatusText = document.getElementById('pumpStatusText');
const pumpToggle = document.getElementById('pumpToggle');

// Sensor Cards & Status Labels
const cardTemp = document.getElementById('cardTemp');
const tempStatus = document.getElementById('tempStatus');
const cardHum = document.getElementById('cardHum');
const humStatus = document.getElementById('humStatus');
const cardSoil = document.getElementById('cardSoil');
const soilStatus = document.getElementById('soilStatus');

const maxTankLevelCm = 30; // Tank height is ~30cm as per user specifications
const maxCapacityLiters = 2; // Total capacity is 2 Liters

// --- Firebase Listeners (Compat Syntax) ---

// 1. Water Level (Ultrasonic Distance)
database.ref('sensors/water').on('value', (snapshot) => {
    const distanceCm = snapshot.val();
    if (distanceCm !== null) {
        const h_water = Math.max(0, maxTankLevelCm - distanceCm);
        let percent = (h_water / maxTankLevelCm) * 100;
        const volumeL = (h_water / maxTankLevelCm) * maxCapacityLiters;

        if (percent > 100) percent = 100;
        if (percent < 0) percent = 0;

        tankLevelCm.innerText = `${volumeL.toFixed(2)} Liters (${distanceCm.toFixed(1)} cm)`;
        tankLevelPercent.innerText = `${Math.round(percent)}%`;
        tankLevelFill.style.height = `${percent}%`;
    }
});

// 2. Temperature
database.ref('sensors/temp').on('value', (snapshot) => {
    const temp = snapshot.val();
    if (temp !== null) {
        envTemp.innerText = `${temp.toFixed(1)} °C`;
        updateTempState(temp);
    }
});

// 3. Humidity
database.ref('sensors/hum').on('value', (snapshot) => {
    const hum = snapshot.val();
    if (hum !== null) {
        envHum.innerText = `${hum.toFixed(1)} %`;
        updateHumState(hum);
    }
});

// 4. Soil Moisture
database.ref('sensors/soil').on('value', (snapshot) => {
    const soil = snapshot.val();
    if (soil !== null) {
        envSoil.innerText = `${soil} %`;
        updateSoilState(soil);
    }
});

// --- Dynamic State Handlers ---

function updateTempState(temp) {
    cardTemp.classList.remove('state-hot', 'state-cold', 'state-active');

    if (temp > 35) {
        tempStatus.innerHTML = 'Hot ☀️';
        cardTemp.classList.add('state-hot', 'state-active');
    } else if (temp < 15) {
        tempStatus.innerHTML = 'Cold ❄️';
        cardTemp.classList.add('state-cold', 'state-active');
    } else {
        tempStatus.innerHTML = 'Normal ✅';
    }
}

function updateHumState(hum) {
    cardHum.classList.remove('state-wet', 'state-dry', 'state-active');

    if (hum > 75) {
        humStatus.innerHTML = 'Damp ☁️';
        cardHum.classList.add('state-wet', 'state-active');
    } else if (hum < 30) {
        humStatus.innerHTML = 'Dry 💨';
        cardHum.classList.add('state-dry', 'state-active');
    } else {
        humStatus.innerHTML = 'Comfortable ✅';
    }
}

function updateSoilState(soil) {
    cardSoil.classList.remove('state-wet', 'state-dry', 'state-active');

    if (soil > 80) {
        soilStatus.innerHTML = 'Over-watered 🌊';
        cardSoil.classList.add('state-wet', 'state-active');
    } else if (soil < 30) {
        soilStatus.innerHTML = 'Needs Water 🏜️';
        cardSoil.classList.add('state-dry', 'state-active');
    } else {
        soilStatus.innerHTML = 'Optimal 🌿';
    }
}

// 5. Pump Status
const pumpControlRef = database.ref('controls/pump');
pumpControlRef.on('value', (snapshot) => {
    const isPumpOn = snapshot.val();
    if (isPumpOn === 1) {
        pumpStatusText.innerText = 'ON';
        pumpStatusText.className = 'm-0 text-success fw-black';
        pumpToggle.checked = true;
    } else {
        pumpStatusText.innerText = 'OFF';
        pumpStatusText.className = 'm-0 text-danger fw-black';
        pumpToggle.checked = false;
    }
});

// Manual Pump Toggle
pumpToggle.addEventListener('change', (e) => {
    const newState = e.target.checked ? 1 : 0;
    pumpControlRef.set(newState).catch(err => {
        console.error("Pump Error:", err);
        e.target.checked = !e.target.checked;
    });
});

function updateTemperature(temp){

  const card = document.getElementById("cardTemp");

  if(temp > 35){
      card.style.setProperty("--card-color","#ef4444");
      card.style.setProperty("--card-color-soft","rgba(239,68,68,.25)");
  }

  else if(temp < 15){
      card.style.setProperty("--card-color","#3b82f6");
      card.style.setProperty("--card-color-soft","rgba(59,130,246,.25)");
  }

  else{
      card.style.setProperty("--card-color","#f97316");
      card.style.setProperty("--card-color-soft","rgba(249,115,22,.25)");
  }

}

updateTemperature(32);


const dropletContainer = document.getElementById("droplets");

function createDroplet(){

    const drop = document.createElement("div");
    drop.classList.add("droplet");

    const left = Math.random()*100;
    const duration = 3 + Math.random()*4;

    drop.style.left = left+"%";
    drop.style.animationDuration = duration+"s";

    dropletContainer.appendChild(drop);

    setTimeout(()=>{
        drop.remove();
    },duration*1000);
}

setInterval(createDroplet,500);

function updateTank(level){

    const water = document.getElementById("tankLevelFill");
    const percent = document.getElementById("tankLevelPercent");
    const liters = document.getElementById("tankLevelCm");

    water.style.height = level + "%";

    percent.innerText = level + "%";

    const capacity = 2; 
    const current = (level/100)*capacity;

    liters.innerText = current.toFixed(2) + " Liters";

}

updateTank(65);