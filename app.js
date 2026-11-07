const form = document.getElementById("answerForm");
const answerInput = document.getElementById("answer");
const quizCard = document.getElementById("quizCard");
const quizScreen = document.getElementById("quizScreen");
const feedback = document.getElementById("feedback");
const hint = document.getElementById("hint");
const attemptDots = [...document.querySelectorAll("#attemptDots i")];
const celebration = document.getElementById("celebration");
const partyTitle = document.getElementById("partyTitle");
const againButton = document.getElementById("againButton");
const confettiCanvas = document.getElementById("confetti");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let attempts = 0;
let celebrationStarted = false;

const acceptedWords = new Set([
  "e",
  "euler",
  "eulers",
  "eulerzahl",
  "eulerszahl",
  "eulersche",
  "eulerschezahl",
  "eulerschezahl",
  "dieeulerschezahl",
  "dereulerschezahl",
  "eulerschekonstante",
  "eulerskonstante",
  "eulerkonstante",
  "eulersnumber",
  "eulersconstant",
]);

const wrongMessages = [
  "Noch nicht. Die Party bleibt hinter der Gleichung.",
  "Knapp daneben ist auch vorbei. Ein neuer Versuch?",
  "Die Tanzfläche wartet. Rechne noch einmal.",
  "Da kürzt sich mehr weg, als du denkst.",
];

const hints = [
  "",
  "Tipp: ln(e) = 1.",
  "Tipp: Der Bruch und der Logarithmus dahinter heben sich gegenseitig auf.",
  "Tipp: Übrig bleibt die Eulersche Zahl – ungefähr 2,718…",
];

function isCorrect(rawAnswer) {
  const cleaned = rawAnswer.trim().toLowerCase().replace(/\s+/g, "");
  const asWord = cleaned.replace(/[.!?;:'"()]/g, "");

  if (acceptedWords.has(asWord)) {
    return true;
  }

  const asNumber = cleaned
    .replace(/,/g, ".")
    .replace(/[^\d.]/g, "")
    .replace(/^\.+|\.+$/g, "");

  if (asNumber && /^\d*\.?\d+$/.test(asNumber)) {
    const value = Number(asNumber);
    return Number.isFinite(value) && Math.abs(value - Math.E) < 0.02;
  }

  return false;
}

function updateAttemptDots() {
  attemptDots.forEach((dot, index) => {
    dot.classList.toggle("is-spent", index < attempts);
  });
  attemptDots[0]?.parentElement?.setAttribute(
    "aria-label",
    attempts === 0 ? "Noch kein Versuch" : `${attempts} ${attempts === 1 ? "Versuch" : "Versuche"}`
  );
}

function shakeCard() {
  quizCard.classList.remove("shake");
  void quizCard.offsetWidth;
  quizCard.classList.add("shake");
}

quizCard.addEventListener("animationend", (event) => {
  if (event.animationName === "shake-card") {
    quizCard.classList.remove("shake");
  }
});

answerInput.addEventListener("input", () => {
  answerInput.removeAttribute("aria-invalid");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (celebrationStarted) {
    return;
  }

  const rawAnswer = answerInput.value;

  if (!rawAnswer.trim()) {
    feedback.textContent = "Da fehlt noch eine Antwort.";
    feedback.classList.remove("is-correct");
    hint.textContent = "";
    answerInput.setAttribute("aria-invalid", "true");
    answerInput.focus();
    shakeCard();
    return;
  }

  if (isCorrect(rawAnswer)) {
    completeChallenge();
    return;
  }

  attempts += 1;
  updateAttemptDots();
  feedback.classList.remove("is-correct");
  answerInput.setAttribute("aria-invalid", "true");

  const normalized = rawAnswer.trim();
  if (normalized === "22") {
    feedback.textContent = "22 ist das Alter, nicht die Antwort.";
  } else if (normalized === "1") {
    feedback.textContent = "1 ist nur ein Zwischenschritt.";
  } else {
    feedback.textContent = wrongMessages[Math.min(attempts - 1, wrongMessages.length - 1)];
  }

  hint.textContent = hints[Math.min(attempts, hints.length - 1)];
  shakeCard();
  answerInput.focus();
  answerInput.select();
});

function completeChallenge() {
  if (celebrationStarted) {
    return;
  }

  celebrationStarted = true;
  attempts = Math.max(attempts, 1);
  updateAttemptDots();
  answerInput.removeAttribute("aria-invalid");
  feedback.textContent = "Richtig. Die Party ist offiziell eröffnet.";
  feedback.classList.add("is-correct");
  hint.textContent = "";

  window.setTimeout(() => {
    document.activeElement?.blur();
    document.body.classList.add("is-celebrating");
    celebration.setAttribute("aria-hidden", "false");
    quizScreen.setAttribute("aria-hidden", "true");
    startConfetti();

    window.setTimeout(() => {
      partyTitle.focus({ preventScroll: true });
    }, reducedMotion.matches ? 30 : 900);
  }, reducedMotion.matches ? 30 : 650);
}

function resetChallenge() {
  if (!celebrationStarted) {
    return;
  }

  celebrationStarted = false;
  stopConfetti();
  document.body.classList.remove("is-celebrating");
  celebration.setAttribute("aria-hidden", "true");
  quizScreen.removeAttribute("aria-hidden");
  form.reset();
  attempts = 0;
  updateAttemptDots();
  feedback.textContent = "";
  feedback.classList.remove("is-correct");
  hint.textContent = "";
  answerInput.removeAttribute("aria-invalid");

  window.setTimeout(() => {
    answerInput.focus({ preventScroll: true });
  }, reducedMotion.matches ? 30 : 720);
}

againButton.addEventListener("click", resetChallenge);

/* ---------------------------------- */
/* Floss crew                          */
/* ---------------------------------- */

const dancers = [
  {
    shirt: "#ff5a36",
    shirtInk: "#fff8ed",
    pants: "#282334",
    skin: "#995f3b",
    hair: "#171310",
    shoe: "#f7efe1",
    accent: "#d9ff55",
    hairStyle: "crop",
    hat: false,
    print: "22",
  },
  {
    shirt: "#d9ff55",
    shirtInk: "#1b1812",
    pants: "#1e1d22",
    skin: "#f0c29b",
    hair: "#5a3925",
    shoe: "#f5ecdd",
    accent: "#ff5a36",
    hairStyle: "curls",
    hat: true,
    print: "bolt",
  },
  {
    shirt: "#8d7bff",
    shirtInk: "#fff8ed",
    pants: "#302a40",
    skin: "#694229",
    hair: "#100d0c",
    shoe: "#f7efe1",
    accent: "#ffd34e",
    hairStyle: "bob",
    hat: false,
    print: "star",
  },
  {
    shirt: "#f7efe1",
    shirtInk: "#1b1812",
    pants: "#25252d",
    skin: "#d2986d",
    hair: "#ad4f2e",
    shoe: "#1b1812",
    accent: "#8d7bff",
    hairStyle: "bun",
    hat: true,
    print: "heart",
  },
  {
    shirt: "#6ecbff",
    shirtInk: "#171310",
    pants: "#1f2530",
    skin: "#e9bb8e",
    hair: "#d9ad63",
    shoe: "#f7efe1",
    accent: "#ff93b1",
    hairStyle: "wave",
    hat: false,
    print: "F",
  },
];

function hairMarkup(style, color) {
  switch (style) {
    case "curls":
      return `
        <g fill="${color}">
          <circle cx="61" cy="48" r="11"/>
          <circle cx="73" cy="38" r="12"/>
          <circle cx="89" cy="39" r="12"/>
          <circle cx="100" cy="51" r="9"/>
        </g>`;
    case "bob":
      return `
        <path d="M56 50 Q56 27 80 27 Q104 27 104 50 L106 78 Q96 82 91 67 L92 46 Q80 37 68 46 L69 67 Q64 82 54 78 Z" fill="${color}"/>`;
    case "bun":
      return `
        <circle cx="80" cy="23" r="12" fill="${color}"/>
        <path d="M57 56 C57 35 66 28 80 28 C94 28 103 35 103 56 C96 45 88 42 80 43 C70 42 62 46 57 56 Z" fill="${color}"/>`;
    case "wave":
      return `
        <path d="M56 54 C53 34 65 26 80 27 C96 27 105 37 104 56 C100 51 96 46 91 43 C86 49 76 48 71 43 C65 48 59 50 56 54 Z" fill="${color}"/>`;
    default:
      return `
        <path d="M57 56 C57 34 67 28 80 28 C95 28 104 36 103 56 C97 45 90 42 80 43 C69 42 62 46 57 56 Z" fill="${color}"/>`;
  }
}

function hatMarkup(accent) {
  return `
    <g>
      <path d="M58 40 L80 2 L102 40 Z" fill="${accent}"/>
      <path d="M66 26 L80 2 L94 26 Q80 32 66 26 Z" fill="rgba(20, 17, 14, 0.2)"/>
      <circle cx="80" cy="2" r="6" fill="#f7efe1"/>
    </g>`;
}

function printMarkup(type, ink, accent) {
  switch (type) {
    case "bolt":
      return `<path d="M84 106 L69 123 H78 L73 138 L92 116 H83 Z" fill="${accent}"/>`;
    case "star":
      return `<path d="M80 106 L83.2 114.3 L92 115.2 L85.4 120.9 L87.4 129.5 L80 124.9 L72.6 129.5 L74.6 120.9 L68 115.2 L76.8 114.3 Z" fill="${accent}"/>`;
    case "heart":
      return `<path d="M80 133 C69 124 62 119 62 112 C62 105 71 102 76 107 L80 111 L84 107 C89 102 98 105 98 112 C98 119 91 124 80 133 Z" fill="${accent}"/>`;
    default:
      return `<text class="dancer-shirt-print" x="80" y="130" font-size="22" fill="${ink}">${type}</text>`;
  }
}

function dancerMarkup(dancer) {
  return `
    <svg viewBox="0 0 160 240" aria-hidden="true" focusable="false">
      <ellipse class="dancer-shadow" cx="80" cy="232" rx="53" ry="7"/>

      <g class="dancer-legs">
        <path class="dancer-leg" d="M69 140 C62 168 58 192 54 223" stroke="${dancer.pants}"/>
        <path class="dancer-leg" d="M91 140 C98 168 102 192 106 223" stroke="${dancer.pants}"/>
        <ellipse cx="50" cy="226" rx="16" ry="7" fill="${dancer.shoe}" transform="rotate(-8 50 226)"/>
        <ellipse cx="110" cy="226" rx="16" ry="7" fill="${dancer.shoe}" transform="rotate(8 110 226)"/>
      </g>

      <g class="dancer-upper">
        <g class="dancer-arms" stroke="${dancer.skin}">
          <path class="dancer-arm" d="M56 103 C42 119 44 139 66 150"/>
          <path class="dancer-arm" d="M104 103 C118 119 116 139 94 150"/>
          <circle class="dancer-hand" cx="66" cy="150" r="5.8" fill="${dancer.skin}"/>
          <circle class="dancer-hand" cx="94" cy="150" r="5.8" fill="${dancer.skin}"/>
        </g>

        <rect x="72" y="79" width="16" height="19" rx="7" fill="${dancer.skin}"/>

        <path d="M50 93 Q80 84 110 93 L113 139 Q80 151 47 139 Z" fill="${dancer.shirt}"/>
        <path d="M50 93 Q80 84 110 93 L110.8 101 Q80 94 49.2 101 Z" fill="rgba(20, 17, 14, 0.1)"/>
        ${printMarkup(dancer.print, dancer.shirtInk, dancer.accent)}

        <g class="dancer-head">
          <circle cx="56" cy="64" r="4.5" fill="${dancer.skin}"/>
          <circle cx="104" cy="64" r="4.5" fill="${dancer.skin}"/>
          <ellipse cx="80" cy="61" rx="23" ry="25" fill="${dancer.skin}"/>
          ${hairMarkup(dancer.hairStyle, dancer.hair)}
          ${dancer.hat ? hatMarkup(dancer.accent) : ""}
          <g class="dancer-glasses">
            <rect x="62" y="56" width="16" height="10" rx="4.5"/>
            <rect x="82" y="56" width="16" height="10" rx="4.5"/>
            <rect x="77" y="59" width="6" height="2.5" rx="1.2"/>
          </g>
          <g class="dancer-glasses-frame">
            <rect x="62" y="56" width="16" height="10" rx="4.5"/>
            <rect x="82" y="56" width="16" height="10" rx="4.5"/>
            <path d="M61 59 L56 58 M99 59 L104 58" fill="none"/>
          </g>
          <path class="dancer-smile" d="M73 73 Q80 79 87 73"/>
          <ellipse cx="67" cy="72" rx="4" ry="2.2" fill="rgba(255, 90, 54, 0.17)"/>
          <ellipse cx="93" cy="72" rx="4" ry="2.2" fill="rgba(255, 90, 54, 0.17)"/>
        </g>
      </g>
    </svg>`;
}

const dancersContainer = document.getElementById("dancers");

dancers.forEach((dancer, index) => {
  const element = document.createElement("div");
  element.className = "dancer";
  element.style.setProperty("--i", String(index));
  element.style.setProperty("--delay", `${(-0.06 * index).toFixed(2)}s`);
  element.innerHTML = dancerMarkup(dancer);
  dancersContainer.appendChild(element);
});

/* ---------------------------------- */
/* Confetti                            */
/* ---------------------------------- */

const context = confettiCanvas.getContext("2d");
const confettiColors = ["#ff5a36", "#d9ff55", "#8d7bff", "#6ecbff", "#ff93b1", "#ffd34e", "#f4eee2"];
let particles = [];
let confettiRunning = false;
let confettiFrame = 0;
let lastFrameTime = 0;
let viewportWidth = 0;
let viewportHeight = 0;
let pixelRatio = 1;

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function resizeConfettiCanvas() {
  pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  viewportWidth = window.innerWidth;
  viewportHeight = window.innerHeight;
  confettiCanvas.width = Math.floor(viewportWidth * pixelRatio);
  confettiCanvas.height = Math.floor(viewportHeight * pixelRatio);
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function createParticle(initial = false) {
  const sizeScale = Math.min(1.2, Math.max(0.72, viewportWidth / 1250));
  const shapeRoll = Math.random();
  const shape = shapeRoll > 0.82 ? "circle" : shapeRoll > 0.62 ? "ribbon" : "rectangle";

  return {
    x: Math.random() * viewportWidth,
    y: initial ? Math.random() * viewportHeight : randomBetween(-viewportHeight * 0.3, -12),
    width: randomBetween(3.5, 7.5) * sizeScale,
    height: randomBetween(7, 14) * sizeScale,
    vx: randomBetween(-1.15, 1.15),
    vy: randomBetween(1.2, 3.35),
    rotation: Math.random() * Math.PI * 2,
    spin: randomBetween(-0.11, 0.11),
    sway: Math.random() * Math.PI * 2,
    swaySpeed: randomBetween(0.018, 0.045),
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    opacity: randomBetween(0.62, 0.97),
    shape,
  };
}

function resetParticle(particle) {
  particle.x = Math.random() * viewportWidth;
  particle.y = randomBetween(-viewportHeight * 0.24, -18);
  particle.vx = randomBetween(-1.15, 1.15);
  particle.vy = randomBetween(1.2, 3.35);
  particle.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
}

function drawParticle(particle) {
  context.globalAlpha = particle.opacity;
  context.fillStyle = particle.color;
  context.save();
  context.translate(particle.x, particle.y);
  context.rotate(particle.rotation);

  if (particle.shape === "circle") {
    context.beginPath();
    context.arc(0, 0, particle.width * 0.62, 0, Math.PI * 2);
    context.fill();
  } else {
    const height = particle.shape === "ribbon" ? particle.height * 1.75 : particle.height;
    context.fillRect(-particle.width / 2, -height / 2, particle.width, height);
  }

  context.restore();
}

function animateConfetti(timestamp) {
  if (!confettiRunning) {
    return;
  }

  const delta = Math.min((timestamp - lastFrameTime) / 16.667 || 1, 2.6);
  lastFrameTime = timestamp;
  confettiFrame += 1;
  context.clearRect(0, 0, viewportWidth, viewportHeight);

  particles.forEach((particle) => {
    particle.sway += particle.swaySpeed * delta;
    particle.x += (particle.vx + Math.sin(particle.sway) * 0.34) * delta;
    particle.y += particle.vy * delta;
    particle.rotation += particle.spin * delta;

    if (particle.y > viewportHeight + 28) {
      resetParticle(particle);
    }

    if (particle.x < -30) {
      particle.x = viewportWidth + 26;
    } else if (particle.x > viewportWidth + 30) {
      particle.x = -26;
    }

    drawParticle(particle);
  });

  confettiFrame = window.requestAnimationFrame(animateConfetti);
}

function startConfetti() {
  resizeConfettiCanvas();
  const particleCount = viewportWidth < 700 ? 90 : 155;
  particles = Array.from({ length: particleCount }, () => createParticle(true));

  if (reducedMotion.matches) {
    context.clearRect(0, 0, viewportWidth, viewportHeight);
    particles.forEach(drawParticle);
    return;
  }

  confettiRunning = true;
  lastFrameTime = performance.now();
  confettiFrame = window.requestAnimationFrame(animateConfetti);
}

function stopConfetti() {
  confettiRunning = false;
  window.cancelAnimationFrame(confettiFrame);
  context.clearRect(0, 0, viewportWidth, viewportHeight);
  particles = [];
}

window.addEventListener("resize", () => {
  if (!celebrationStarted) {
    return;
  }

  resizeConfettiCanvas();

  if (reducedMotion.matches) {
    context.clearRect(0, 0, viewportWidth, viewportHeight);
    particles.forEach(drawParticle);
  }
});

if ("serviceWorker" in navigator && window.location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
