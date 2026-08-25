// ===================================================================
// BROMA "TE TOMARÉ UNA FOTO" — lógica completa de la secuencia
// ===================================================================

const STORAGE_KEY = "playSong";

const screens = {
  intro: document.getElementById("screen-intro"),
  reveal: document.getElementById("screen-reveal"),
  no: document.getElementById("screen-no"),
  song: document.getElementById("screen-song"),
};

const flashOverlay = document.getElementById("flash-overlay");
const modalOverlay = document.getElementById("modal-overlay");
const modalText = document.getElementById("modal-text");
const btnSi = document.getElementById("btn-si");
const btnNo = document.getElementById("btn-no");
const btnRetry = document.getElementById("btn-retry");
const songAudio = document.getElementById("song-audio");
const btnPlayFallback = document.getElementById("btn-play-fallback");

// Las 3 preguntas de la cadena, en orden
const QUESTIONS = [
  "¿QUIERES ESCUCHAR AMIGOS - DPOS?",
  "¿ENSERIO QUIERES ESCUCHAR LA CANCIÓN?",
  "¿DE VERITAS DE VERITAS QUIERES ESCUCHAR LA CANCIÓN?",
];

let questionIndex = 0;

function showScreen(name) {
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  screens[name].classList.add("active");
}

// ---------------------------------------------------------------
// 1) Si venimos de la recarga con la bandera activa -> ir directo
//    a la pantalla de la canción y reproducirla.
// ---------------------------------------------------------------
function boot() {
  if (localStorage.getItem(STORAGE_KEY) === "true") {
    localStorage.removeItem(STORAGE_KEY);
    showScreen("song");
    attemptAutoplay();
    return;
  }
  runIntroSequence();
}

// ---------------------------------------------------------------
// 2) Secuencia de intro: cámara -> flash -> revelado -> modal
// ---------------------------------------------------------------
function runIntroSequence() {
  showScreen("intro");

  // Espera un momento con el mensaje "Espera, te tomaré una foto..."
  setTimeout(() => {
    fireFlash();
  }, 5000);
}

function fireFlash() {
  flashOverlay.classList.add("fire");

  // A mitad del flash (pantalla completamente blanca) cambiamos de escena
  setTimeout(() => {
    showScreen("reveal");
  }, 700);

  flashOverlay.addEventListener(
    "animationend",
    () => {
      flashOverlay.classList.remove("fire");
      // Tras mostrar el mono sonriendo un momento, abrimos el modal
      setTimeout(openModalChain, 3000);
    },
    { once: true }
  );
}

// ---------------------------------------------------------------
// 3) Cadena de 3 preguntas en modal
// ---------------------------------------------------------------
function openModalChain() {
  questionIndex = 0;
  modalText.textContent = QUESTIONS[questionIndex];
  modalOverlay.classList.add("active");
}

btnSi.addEventListener("click", () => {
  questionIndex++;
  if (questionIndex < QUESTIONS.length) {
    modalText.textContent = QUESTIONS[questionIndex];
  } else {
    // Ya confirmó las 3 veces -> recargar y reproducir la canción
    modalOverlay.classList.remove("active");
    localStorage.setItem(STORAGE_KEY, "true");
    location.reload();
  }
});

btnNo.addEventListener("click", () => {
  modalOverlay.classList.remove("active");
  showScreen("no");
});

btnRetry.addEventListener("click", () => {
  openModalChain();
});

// ---------------------------------------------------------------
// 4) Pantalla canción: intenta autoplay, si el navegador lo bloquea
//    muestra un botón para reproducir manualmente.
// ---------------------------------------------------------------
function attemptAutoplay() {
  const playPromise = songAudio.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      btnPlayFallback.classList.add("show");
    });
  }
}

btnPlayFallback.addEventListener("click", () => {
  songAudio.play();
  btnPlayFallback.classList.remove("show");
});

// ---------------------------------------------------------------
boot();
