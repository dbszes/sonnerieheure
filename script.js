```js
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


/* HORLOGE */

function updateClock() {
  const now = new Date();

  clock.textContent =
    String(now.getHours()).padStart(2, "0") + ":" +
    String(now.getMinutes()).padStart(2, "0") + ":" +
    String(now.getSeconds()).padStart(2, "0");
}


/* JOUER LA SONNERIE */

function playBell() {
  audio.pause();
  audio.currentTime = 0;

  audio.play()
    .then(() => {
      console.log("Sonnerie lancée");
    })
    .catch((error) => {
      console.error("Erreur audio :", error);

      status.textContent = "⚠️ Impossible de jouer le son";
      status.className = "status off";
    });
}


/* PROCHAINE SONNERIE */

function getNextBell() {
  if (!enabled.checked) {
    return null;
  }

  const now = new Date();
  const next = new Date(now);

  if (mode.value === "hourly") {
    next.setMinutes(0);
    next.setSeconds(0);
    next.setMilliseconds(0);

    if (next <= now) {
      next.setHours(next.getHours() + 1);
    }

    return next;
  }

  if (!customTime.value) {
    return null;
  }

  const [hours, minutes] = customTime.value.split(":").map(Number);

  next.setHours(hours);
  next.setMinutes(minutes);
  next.setSeconds(0);
  next.setMilliseconds(0);

  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }

  return next;
}


/* AFFICHER LA PROCHAINE SONNERIE */

function updateNextBell() {
  const next = getNextBell();

  if (!next) {
    nextBell.textContent = "—";
    return;
  }

  const now = new Date();

  const secondsLeft = Math.ceil(
    (next - now) / 1000
  );

  const hours = Math.floor(secondsLeft / 3600);

  const minutes = Math.floor(
    (secondsLeft % 3600) / 60
  );

  const seconds = secondsLeft % 60;

  const nextTime =
    String(next.getHours()).padStart(2, "0") + ":" +
    String(next.getMinutes()).padStart(2, "0");

  nextBell.textContent =
    `${nextTime} — dans ` +
    `${String(hours).padStart(2, "0")}:` +
    `${String(minutes).padStart(2, "0")}:` +
    `${String(seconds).padStart(2, "0")}`;
}


/* VÉRIFIER LA SONNERIE */

function checkBell() {
  if (!enabled.checked) {
    return;
  }

  const now = new Date();

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  let shouldPlay = false;
  let key = "";

  if (mode.value === "hourly") {

    shouldPlay =
      minutes === 0 &&
      seconds === 0;

    key =
      `${now.getFullYear()}-` +
      `${now.getMonth()}-` +
      `${now.getDate()}-` +
      `${hours}`;

  } else {

    if (!customTime.value) {
      return;
    }

    const [customHours, customMinutes] =
      customTime.value.split(":").map(Number);

    shouldPlay =
      hours === customHours &&
      minutes === customMinutes &&
      seconds === 0;

    key =
      `${now.getFullYear()}-` +
      `${now.getMonth()}-` +
      `${now.getDate()}-` +
      `${customTime.value}`;
  }

  if (shouldPlay && key !== lastPlayed) {
    lastPlayed = key;
    playBell();
  }
}


/* ACTIVATION */

enabled.addEventListener("change", function () {

  if (enabled.checked) {

    status.textContent =
      "🟢 Sonnerie activée";

    status.className =
      "status on";

    updateNextBell();

  } else {

    status.textContent =
      "🔴 Sonnerie désactivée";

    status.className =
      "status off";

    audio.pause();
    audio.currentTime = 0;

    nextBell.textContent = "—";
  }
});


/* CHANGEMENT DE MODE */

mode.addEventListener("change", function () {

  if (mode.value === "custom") {
    customSettings.classList.remove("hidden");
  } else {
    customSettings.classList.add("hidden");
  }

  updateNextBell();
});


/* CHANGEMENT D'HEURE */

customTime.addEventListener("change", function () {
  updateNextBell();
});


/* TEST DE LA SONNERIE */

testButton.addEventListener("click", function () {

  /*
    Le bouton de test active maintenant
    automatiquement la sonnerie.
  */

  enabled.checked = true;

  status.textContent =
    "🟢 Sonnerie activée";

  status.className =
    "status on";

  updateNextBell();

  playBell();
});


/* DÉMARRAGE */

enabled.checked = false;

status.textContent =
  "🔴 Sonnerie désactivée";

status.className =
  "status off";

customSettings.classList.add("hidden");

nextBell.textContent = "—";

updateClock();


/* MISE À JOUR */

setInterval(function () {

  updateClock();
  checkBell();
  updateNextBell();

}, 250);
```
