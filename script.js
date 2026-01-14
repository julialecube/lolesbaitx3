// 27 fotos: img/01.jpg fins img/27.jpg
const imgs = Array.from({ length: 27 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return { src: `img/${n}.jpg`, name: `${n}.jpg` };
});

// Elements (assegura't que aquests IDs existeixen a index.html)
const startGateBtn = document.getElementById("startGateBtn");

const scrollBait = document.getElementById("scrollBait");
const voidBox = document.getElementById("voidBox");
const voidMsg = document.getElementById("voidMsg");

const gate = document.getElementById("gate");
const gateBtn = document.getElementById("gateBtn");
const gateMsg = document.getElementById("gateMsg");

const baitZone = document.getElementById("baitZone");
const baitWall = document.getElementById("baitWall");
const pixelGrid = document.getElementById("pixelGrid");

const viewer = document.getElementById("viewer");
const bigImg = document.getElementById("bigImg");
const currentNameEl = document.getElementById("currentName");
const statusEl = document.getElementById("status");

const nextBtn = document.getElementById("nextBtn");
const moveBtn = document.getElementById("moveBtn");
const loadBtn = document.getElementById("loadBtn");
const dlBtn = document.getElementById("dlBtn");

const loader = document.getElementById("loader");
const loaderText = document.getElementById("loaderText");
const cancelFake = document.getElementById("cancelFake");

const progressWrap = document.getElementById("progressWrap");
const progressBar = document.getElementById("progressBar");
const progressPct = document.getElementById("progressPct");
const progressLabel = document.getElementById("progressLabel");
const progressNote = document.getElementById("progressNote");

// Opcional (si ho tens a l'HTML)
const finalRow = document.getElementById("finalRow");

// Estat
let currentName = null;
let lastIndex = -1;
let dotsTimer = null;

function setStatus(msg) {
  if (statusEl) statusEl.textContent = msg;
}

// 1) Entrar: amaga scroll bait, mostra gate, però NO fa scroll automàtic
if (startGateBtn) {
  startGateBtn.addEventListener("click", () => {
    if (scrollBait) scrollBait.hidden = true;
    if (gate) gate.hidden = false;
    // NO scrollIntoView: et quedes al principi
  });
}

// 2) Passadís botons trampa
const gateSteps = [
  { msg: "clica aquí per veure les fotos", btn: "aquí" },
  { msg: "aquí aquí", btn: "aquí" },
  { msg: "eii no, però aquí sí!", btn: "aquí sí" },
  { msg: "bait!! ara enserio es aquí", btn: "venga va" },
];

let step = 0;

if (gateBtn) {
  gateBtn.addEventListener("click", () => {
    step++;

    // Actualitza text del passadís
    if (step <= gateSteps.length) {
      const s = gateSteps[step - 1];
      if (gateMsg) gateMsg.textContent = s.msg;
      gateBtn.textContent = s.btn;
    }

    // Entra a zona BAIT quan acabes passos
    if (step === gateSteps.length) {
      if (baitZone) baitZone.hidden = false;
      if (finalRow) finalRow.hidden = false;

      buildBaitWall();
      buildPixelGallery();

      // IMPORTANT:
      // - NO scroll automàtic a la zona de fotos
      // - NO obrim cap foto sola (sense showRandomImage aquí)
    }
  });
}

// 3) BAIT wall
function buildBaitWall() {
  if (!baitWall) return;
  baitWall.innerHTML = "";
  const total = 16;

  for (let i = 0; i < total; i++) {
    con
