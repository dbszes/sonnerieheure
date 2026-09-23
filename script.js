const bell = document.getElementById("bell");
const enabled = document.getElementById("enabled");
const mode = document.getElementById("mode");
const customTime = document.getElementById("customTime");
const customLabel = document.getElementById("customLabel");
const testButton = document.getElementById("testButton");
const clock = document.getElementById("clock");
const status = document.getElementById("status");
const nextBell = document.getElementById("nextBell");

let lastTriggeredKey = null;

function pad(value) {
return String(value).padStart(2, "0");
}

function formatTime(date) {
return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function updateModeUI() {
const custom = mode.value === "custom";

customTime.classList.toggle("hidden", !custom);
customLabel.classList.toggle("hidden", !custom);

updateNextBell();
}

function getNextBellDate(now = new Date()) {
const next = new Date(now);

// Sonnerie au début de chaque heure
if (mode.value === "hourly") {
next.setMinutes(0, 0, 0);

```
if (next <= now) {
  next.setHours(next.getHours() + 1);
}

return next;
```

}

// Sonnerie à une heure précise
const [hours, minutes] = customTime.value
.split(":")
.map(Number);

if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
return null;
}

next.setHours(hours, minutes, 0, 0);

if (next <= now) {
next.setDate(next.getDate() + 1);
}

return next;
}

function updateNextBell() {
if (!enabled.checked) {
nextBell.textContent = "—";
return;
}

const next = getNextBellDate();

if (!next) {
nextBell.textContent = "—";
return;
}

const diff = next - new Date();

const totalSeconds = Math.max(
0,
Math.ceil(diff / 1000)
);

const hours = Math.floor(totalSeconds / 3600);

const minutes = Math.floor(
(totalSeconds % 3600) / 60
);

const seconds = totalSeconds % 60;

nextBell.textContent =
`${formatTime(next)} ` +
`(dans ${pad(hours)}:${pad(minutes)}:${pad(seconds)})`;
}

function playBell() {
bell.currentTime = 0;

bell.play().catch(() => {
status.textContent =
"Lecture bloquée : clique sur « Tester la sonnerie »";

```
status.classList.remove("active");
```

});
}

function checkBell(now) {
if (!enabled.checked) {
return;
}

let shouldPlay = false;

let key = "";

if (mode.value === "hourly") {
// Toutes les heures à XX:00:00
shouldPlay =
now.getMinutes() === 0 &&
now.getSeconds() === 0;

```
key =
  `${now.getFullYear()}-` +
  `${now.getMonth()}-` +
  `${now.getDate()}-` +
  `${now.getHours()}`;
```

} else {
// Heure personnalisée
const [hours, minutes] = customTime.value
.split(":")
.map(Number);

```
shouldPlay =
  now.getHours() === hours &&
  now.getMinutes() === minutes &&
  now.getSeconds() === 0;

key =
  `${now.getFullYear()}-` +
  `${now.getMonth()}-` +
  `${now.getDate()}-` +
  `${customTime.value}`;
```

}

if (shouldPlay && key !== lastTriggeredKey) {
lastTriggeredKey = key;
playBell();
}
}

function tick() {
const now = new Date();

// Affichage de l'heure actuelle
clock.textContent = formatTime(now);

// Vérification de la sonnerie
checkBell(now);

// Mise à jour du compte à rebours
updateNextBell();
}

// Activation / désactivation
enabled.addEventListener("change", () => {
if (enabled.checked) {
status.textContent = "Activée";
status.classList.add("active");

```
// Prépare le fichier audio après interaction utilisateur
bell.load();
```

} else {
status.textContent = "Désactivée";
status.classList.remove("active");
}

updateNextBell();
});

// Changement de mode
mode.addEventListener("change", () => {
updateModeUI();
});

// Changement de l'heure personnalisée
customTime.addEventListener("input", () => {
updateNextBell();
});

// Bouton de test
testButton.addEventListener("click", () => {
playBell();
});

// Initialisation
updateModeUI();
tick();

// Vérification plusieurs fois par seconde pour éviter
// de rater le changement d'heure.
setInterval(tick, 250);
