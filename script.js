const audio = document.getElementById("bell");
const enabled = document.getElementById("enabled");
const mode = document.getElementById("mode");
const customTime = document.getElementById("customTime");
const customSettings = document.getElementById("customSettings");
const clock = document.getElementById("clock");
const status = document.getElementById("status");
const nextBell = document.getElementById("nextBell");
const testButton = document.getElementById("testButton");

let lastPlayed = "";

/* =========================
AFFICHAGE DE L'HEURE
========================= */

function updateClock() {

const now = new Date();

const hours =
String(now.getHours()).padStart(2, "0");

const minutes =
String(now.getMinutes()).padStart(2, "0");

const seconds =
String(now.getSeconds()).padStart(2, "0");

clock.textContent =
`${hours}:${minutes}:${seconds}`;
}

/* =========================
JOUER LA SONNERIE
========================= */

function playBell() {

audio.pause();

audio.currentTime = 0;

audio.play()
.then(() => {

```
  console.log("Sonnerie lancée");

})
.catch((error) => {

  console.error(
    "Impossible de jouer la sonnerie :",
    error
  );

  status.textContent =
    "⚠️ Clique d'abord sur « Tester la sonnerie »";

  status.className =
    "status off";

});
```

}

/* =========================
CHANGER LE MODE
========================= */

function updateMode() {

if (mode.value === "custom") {

```
customSettings.classList.remove(
  "hidden"
);
```

} else {

```
customSettings.classList.add(
  "hidden"
);
```

}

updateNextBell();
}

/* =========================
PROCHAINE SONNERIE
========================= */

function getNextBell() {

if (!enabled.checked) {

```
return null;
```

}

const now = new Date();

const next = new Date(now);

/* Toutes les heures */

if (mode.value === "hourly") {

```
next.setMinutes(0);

next.setSeconds(0);

next.setMilliseconds(0);

if (next <= now) {

  next.setHours(
    next.getHours() + 1
  );

}

return next;
```

}

/* Heure précise */

if (!customTime.value) {

```
return null;
```

}

const parts =
customTime.value.split(":");

const hours =
Number(parts[0]);

const minutes =
Number(parts[1]);

next.setHours(
hours,
minutes,
0,
0
);

if (next <= now) {

```
next.setDate(
  next.getDate() + 1
);
```

}

return next;
}

/* =========================
AFFICHER LA PROCHAINE
SONNERIE
========================= */

function updateNextBell() {

const next =
getNextBell();

if (!next) {

```
nextBell.textContent =
  "—";

return;
```

}

const now = new Date();

const difference =
Math.max(
0,
next - now
);

const totalSeconds =
Math.ceil(
difference / 1000
);

const hours =
Math.floor(
totalSeconds / 3600
);

const minutes =
Math.floor(
(totalSeconds % 3600) / 60
);

const seconds =
totalSeconds % 60;

const nextTime =
`${String(next.getHours()).padStart(2, "0")}:` +
`${String(next.getMinutes()).padStart(2, "0")}`;

nextBell.textContent =
`${nextTime} — dans ` +
`${String(hours).padStart(2, "0")}:` +
`${String(minutes).padStart(2, "0")}:` +
`${String(seconds).padStart(2, "0")}`;
}

/* =========================
VÉRIFICATION DE LA SONNERIE
========================= */

function checkBell() {

/* Si désactivée : rien */

if (!enabled.checked) {

```
return;
```

}

const now = new Date();

const hours =
now.getHours();

const minutes =
now.getMinutes();

const seconds =
now.getSeconds();

let shouldPlay = false;

let key = "";

/* =========================
TOUTES LES HEURES
========================= */

if (mode.value === "hourly") {

```
shouldPlay =
  minutes === 0 &&
  seconds === 0;


key =
  `${now.getFullYear()}-` +
  `${now.getMonth()}-` +
  `${now.getDate()}-` +
  `${hours}`;
```

}

/* =========================
HEURE PRÉCISE
========================= */

else {

```
if (!customTime.value) {

  return;

}


const [customHours, customMinutes] =
  customTime.value
    .split(":")
    .map(Number);


shouldPlay =
  hours === customHours &&
  minutes === customMinutes &&
  seconds === 0;


key =
  `${now.getFullYear()}-` +
  `${now.getMonth()}-` +
  `${now.getDate()}-` +
  `${customTime.value}`;
```

}

/* Évite les répétitions */

if (
shouldPlay &&
key !== lastPlayed
) {

```
lastPlayed = key;

playBell();
```

}
}

/* =========================
BOUTON ACTIVATION
========================= */

enabled.addEventListener(
"change",
function () {

```
if (enabled.checked) {

  status.textContent =
    "🟢 Sonnerie activée";

  status.className =
    "status on";

  /*
    Charge le fichier audio.
  */

  audio.load();

} else {

  status.textContent =
    "🔴 Sonnerie désactivée";

  status.className =
    "status off";

  /*
    Arrête immédiatement
    une éventuelle sonnerie.
  */

  audio.pause();

  audio.currentTime = 0;

  nextBell.textContent =
    "—";
}

updateNextBell();
```

}
);

/* =========================
CHANGEMENT DE MODE
========================= */

mode.addEventListener(
"change",
updateMode
);

/* =========================
CHANGEMENT D'HEURE
========================= */

customTime.addEventListener(
"change",
function () {

```
updateNextBell();
```

}
);

/* =========================
TEST DE LA SONNERIE
========================= */

testButton.addEventListener(
"click",
function () {

```
playBell();
```

}
);

/* =========================
MISE À JOUR
========================= */

function update() {

updateClock();

checkBell();

updateNextBell();

}

/* =========================
DÉMARRAGE
========================= */

/*
IMPORTANT :
La sonnerie est désactivée
au démarrage.
*/

enabled.checked = false;

status.textContent =
"🔴 Sonnerie désactivée";

status.className =
"status off";

customSettings.classList.add(
"hidden"
);

nextBell.textContent =
"—";

updateClock();

updateNextBell();

/*
Vérifie régulièrement
l'heure.
*/

setInterval(
update,
250
);
