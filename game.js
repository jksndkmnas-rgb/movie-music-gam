const clips = [
  {file:"video1.mp4", correct:"NO"},
  {file:"video2_no.mp4", correct:"NO"},
  {file:"video3_no.mp4", correct:"NO"},
  {file:"video4_yes.mp4", correct:"YES"},
  {file:"video5_yes.mp4", correct:"YES"}
];

const lossVideo = "you_lost.mp4";
const winVideo = "you_won.mp4";

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const resultScreen = document.getElementById("resultScreen");
const gameVideo = document.getElementById("gameVideo");
const resultVideo = document.getElementById("resultVideo");
const scoreEl = document.getElementById("score");
const roundEl = document.getElementById("round");
const statusEl = document.getElementById("status");
const startBtn = document.getElementById("startBtn");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const restartBtn = document.getElementById("restartBtn");
const resultTitle = document.getElementById("resultTitle");
const resultText = document.getElementById("resultText");

let score = 0;
let round = 0;
let current = null;
let remaining = [];
let locked = false;

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function updateHeader() {
  scoreEl.textContent = score;
  roundEl.textContent = round;
}

function playGameClip(file) {
  gameVideo.pause();
  gameVideo.src = "videos/" + file;
  gameVideo.controls = false;
  gameVideo.removeAttribute("controls");
  gameVideo.loop = true;
  gameVideo.load();

  const p = gameVideo.play();
  if (p) p.catch(() => {
    statusEl.textContent = "Click the video once if your browser blocks autoplay.";
  });
}

function startGame() {
  score = 0;
  round = 0;
  locked = false;

  // Every clip is a playable round and is randomized.
  remaining = shuffle(clips);

  startScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");

  yesBtn.disabled = false;
  noBtn.disabled = false;

  nextRound();
}

function nextRound() {
  if (remaining.length === 0) {
    winGame();
    return;
  }

  current = remaining.shift();
  round++;
  locked = false;

  updateHeader();

  yesBtn.disabled = false;
  noBtn.disabled = false;

  statusEl.textContent = "Is the music and video from the same movie?";
  playGameClip(current.file);
}

function answer(choice) {
  if (locked || !current) return;

  locked = true;
  yesBtn.disabled = true;
  noBtn.disabled = true;

  if (choice === current.correct) {
    score++;
    updateHeader();
    statusEl.textContent = "CORRECT!";
    setTimeout(nextRound, 300);
  } else {
    loseGame();
  }
}

function loseGame() {
  gameVideo.pause();

  resultTitle.textContent = "YOU LOST";
  resultText.textContent = "Wrong answer! Score: " + score;

  gameScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  resultVideo.pause();
  resultVideo.src = "videos/" + lossVideo;
  resultVideo.controls = false;
  resultVideo.removeAttribute("controls");
  resultVideo.loop = false;
  resultVideo.load();

  const p = resultVideo.play();
  if (p) p.catch(() => {});
}

function winGame() {
  gameVideo.pause();

  resultTitle.textContent = "YOU WON";
  resultText.textContent = "Congratulations! You cleared all 5 rounds.";

  gameScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  resultVideo.pause();
  resultVideo.src = "videos/" + winVideo;
  resultVideo.controls = false;
  resultVideo.removeAttribute("controls");
  resultVideo.loop = false;
  resultVideo.load();

  const p = resultVideo.play();
  if (p) p.catch(() => {});
}

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);
yesBtn.addEventListener("click", () => answer("YES"));
noBtn.addEventListener("click", () => answer("NO"));

gameVideo.controls = false;
resultVideo.controls = false;
