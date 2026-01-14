// 27 fotos: img/01.jpg fins img/27.jpg
const imgs = Array.from({length: 27}, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return { src: `img/${n}.jpg`, name: `${n}.jpg` };
});

// Elements
const startGateBtn = document.getElementById("startGateBtn");
const gate = document.getElementById("gate");
const gateBtn = document.getElementById("gateBtn");
const gateMsg = document.getElementById("gateMsg");
const scrollBait = document.getElementById("scrollBait");
const voidBox = document.getElementById("voidBox");

const baitZone = document.getElementById("baitZone");
const baitWall = document.getElementById("baitWall");
const pixelGrid = document.getElementById("pixelGrid");
const finalRow = document.getElementById("finalRow");

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

const voidMsg = document.getElementById("voidMsg");

// Estat
let currentName = null;
let lastIndex = -1;
let dotsTimer = null;

function setStatus(msg){ statusEl.textContent = msg; }

// Entrar -> mostra gate
startGateBtn.addEventListener("click", () => {
  if (scrollBait) scrollBait.hidden = true;   // desapareix el bloc del scroll
  gate.hidden = false;                        // apareix el passadís
  // IMPORTANT: NO fem scrollIntoView -> et quedes al principi
});

// Steps gate (últim botó = "venga va")
const gateSteps = [
  { msg: "clica aquí per veure les fotos", btn: "aquí" },
  { msg: "aquí aquí", btn: "aquí" },
  { msg: "eii no, però aquí sí!", btn: "aquí sí" },
  { msg: "bait!! ara enserio es aquí", btn: "venga va" },
];

let step = 0;

gateBtn.addEventListener("click", () => {
  step++;
  if (step <= gateSteps.length) {
    const s = gateSteps[step - 1];
    gateMsg.textContent = s.msg;
    gateBtn.textContent = s.btn;
  }

  if (step === gateSteps.length) {
  baitZone.hidden = false;
  if (finalRow) finalRow.hidden = false;

  buildBaitWall();
  buildPixelGallery();
  showRandomImage();
}

});

// BAIT wall
function buildBaitWall(){
  baitWall.innerHTML = "";
  const total = 16;
  for (let i = 0; i < total; i++) {
    const d = document.createElement("div");
    d.className = "baitBlock" + (i % 5 === 0 ? " big" : "");
    d.textContent = "BAIT";
    baitWall.appendChild(d);
  }
}

// Galeria blur
function buildPixelGallery(){
  pixelGrid.innerHTML = "";
  imgs.forEach((it) => {
    const btn = document.createElement("button");
    btn.className = "thumb pixelWrap";
    btn.innerHTML = `
      <img class="pixelImg" src="${it.src}" alt="preview">
      <span class="pixelTag">clica aquí per veure</span>
    `;
    btn.addEventListener("click", () => openImage(it));
    pixelGrid.appendChild(btn);
  });
}

// Open image
function openImage(it){
  currentName = it.name;
  viewer.hidden = false;
  bigImg.src = it.src;
  currentNameEl.textContent = currentName;

  setStatus("problemes…");
  loader.hidden = true;
  if (dotsTimer) clearInterval(dotsTimer);
  dotsTimer = null;

  progressWrap.hidden = true;
  progressBar.style.width = "0%";
  progressPct.textContent = "0%";
  progressNote.textContent = "—";

  setTimeout(() => setStatus("ok ara sí (parcial)"), 600);
}

// Random different
function showRandomImage(){
  if (!imgs.length) return;

  let idx = Math.floor(Math.random() * imgs.length);
  if (imgs.length > 1) {
    while (idx === lastIndex) idx = Math.floor(Math.random() * imgs.length);
  }
  lastIndex = idx;
  openImage(imgs[idx]);
}

nextBtn.addEventListener("click", () => showRandomImage());

// Move button
moveBtn.addEventListener("click", () => {
  const parent = moveBtn.parentElement;
  const maxX = Math.max(0, parent.clientWidth - moveBtn.offsetWidth);
  const maxY = 120;

  const x = Math.floor(Math.random() * maxX);
  const y = Math.floor(Math.random() * maxY);

  moveBtn.style.position = "relative";
  moveBtn.style.left = x + "px";
  moveBtn.style.top = y + "px";

  const msgs = ["ups", "gairebé", "no", "sí", "bait"];
  setStatus(msgs[Math.floor(Math.random() * msgs.length)]);
});

// Loading infinit
loadBtn.addEventListener("click", () => {
  loader.hidden = false;
  setStatus("carregant…");

  let dots = 0;
  if (dotsTimer) clearInterval(dotsTimer);
  dotsTimer = setInterval(() => {
    dots = (dots + 1) % 4;
    loaderText.textContent = "carregant" + ".".repeat(dots);
  }, 450);
});

cancelFake.addEventListener("click", () => {
  loader.hidden = true;
  if (dotsTimer) clearInterval(dotsTimer);
  dotsTimer = null;
  setStatus("cancel·lat (però no)");
});

// Download fake 99%
dlBtn.addEventListener("click", () => {
  if (!currentName) {
    setStatus("obre una imatge primer");
    return;
  }

  progressWrap.hidden = false;
  progressLabel.textContent = `descarregant ${currentName}…`;
  progressNote.textContent = "preparant…";
  setStatus("");

  let p = 0;
  progressBar.style.width = "0%";
  progressPct.textContent = "0%";

  const interval = setInterval(() => {
    if (p < 90) p += 10;
    else if (p < 99) p += 1;
    else p = 99;

    progressBar.style.width = p + "%";
    progressPct.textContent = p + "%";

    if (p === 99) {
      progressNote.textContent = "quasi. però no.";
      setStatus("99% per sempre.");
      clearInterval(interval);
    }
  }, 200);
});

// Scroll infinit buit
window.addEventListener("scroll", () => {
  const y = window.scrollY || document.documentElement.scrollTop;

  if (y > 300 && y % 420 < 12) {
    const msgs = ["encara més avall", "mes avall", "seguix", "ja quasi", "bait"];
    voidMsg.textContent = msgs[Math.floor(Math.random() * msgs.length)];
  }

  const nearBottom = window.innerHeight + y >= document.body.offsetHeight - 60;
if (nearBottom && scrollBait && !scrollBait.hidden && voidBox) {
  const spacer = document.createElement("div");
  spacer.style.height = "55vh";
  voidBox.appendChild(spacer);
}
});
