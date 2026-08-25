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

function boot() {
  if (localStorage.getItem(STORAGE_KEY) === "true") {
    localStorage.removeItem(STORAGE_KEY);
    buildLyrics();
    showScreen("song");
    attemptAutoplay();
    return;
  }
  runIntroSequence();
}

function runIntroSequence() {
  showScreen("intro");
  setTimeout(() => {
    fireFlash();
  }, 5000);
}

function fireFlash() {
  flashOverlay.classList.add("fire");

  setTimeout(() => {
    showScreen("reveal");
  }, 700);

  flashOverlay.addEventListener(
    "animationend",
    () => {
      flashOverlay.classList.remove("fire");
      setTimeout(openModalChain, 3000);
    },
    { once: true }
  );
}

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

// ---- Letra sincronizada ----
const lyricsContainer = document.getElementById("lyrics-lines");
let lyricEls = [];
let activeLineIndex = -1;

function buildLyrics() {
  if (!lyricsContainer || typeof LYRICS === "undefined") return;
  lyricsContainer.innerHTML = "";
  lyricEls = LYRICS.map((entry) => {
    const p = document.createElement("p");
    p.className = "lyric-line";
    p.textContent = entry.text;
    lyricsContainer.appendChild(p);
    return p;
  });
  activeLineIndex = -1;
}

function updateActiveLine(currentTime) {
  if (typeof LYRICS === "undefined" || LYRICS.length === 0) return;
  let newIndex = -1;
  for (let i = 0; i < LYRICS.length; i++) {
    if (currentTime >= LYRICS[i].time) newIndex = i;
    else break;
  }
  if (newIndex !== activeLineIndex) {
    if (activeLineIndex >= 0 && lyricEls[activeLineIndex]) {
      lyricEls[activeLineIndex].classList.remove("active");
      lyricEls[activeLineIndex].classList.add("sung");
    }
    if (newIndex >= 0 && lyricEls[newIndex]) {
      lyricEls[newIndex].classList.add("active");
      scrollLyricsTo(lyricEls[newIndex]);
    }
    activeLineIndex = newIndex;
  }
}

function scrollLyricsTo(lineEl) {
  const viewport = lyricsContainer.parentElement;
  const targetY = viewport.clientHeight / 2 - (lineEl.offsetTop + lineEl.offsetHeight / 2);
  lyricsContainer.style.transform = `translateY(${targetY}px)`;
}

songAudio.addEventListener("timeupdate", () => {
  updateActiveLine(songAudio.currentTime);
});

// ---------------------------------------------------------------
boot();