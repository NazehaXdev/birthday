/* ==========================================================================
   HAPPY BIRTHDAY TANVIR - INTERACTIVE JAVASCRIPT ENGINE (ENGLISH EDITION)
   ========================================================================== */

// --- 1. WEB AUDIO API SYNTHESIZER SOUND ENGINE ---
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isPlayingMusic = false;
    this.musicTimer = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a synthesized tone
  playTone(freq, type = 'sine', duration = 0.3, volume = 0.2) {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.log('Audio error:', e);
    }
  }

  // Balloon pop sound effect
  playPop() {
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {}
  }

  // Party horn / celebratory cheer sound
  playCheer() {
    const notes = [261.63, 329.63, 392.00, 523.25];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.4, 0.25), idx * 100);
    });
  }

  // Cake slicing sound
  playSlice() {
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch (e) {}
  }

  // Funny roast buzzer sound
  playBuzzer() {
    this.playTone(130, 'sawtooth', 0.5, 0.3);
  }

  // Success Chime
  playSuccess() {
    const melody = [523.25, 659.25, 783.99, 1046.50];
    melody.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.35, 0.2), i * 90);
    });
  }

  // Synthesized Happy Birthday song melody
  toggleHappyBirthday() {
    this.init();
    if (this.isPlayingMusic) {
      this.stopHappyBirthday();
      return false;
    }

    this.isPlayingMusic = true;
    document.querySelector('.top-control-bar').classList.add('music-playing');
    document.getElementById('musicStatusText').innerText = 'Playing 🎵';

    // Happy Birthday notes (frequency, duration ms)
    const melody = [
      { f: 261.63, d: 350 }, { f: 261.63, d: 350 }, { f: 293.66, d: 700 }, { f: 261.63, d: 700 }, { f: 349.23, d: 700 }, { f: 329.63, d: 1200 },
      { f: 261.63, d: 350 }, { f: 261.63, d: 350 }, { f: 293.66, d: 700 }, { f: 261.63, d: 700 }, { f: 392.00, d: 700 }, { f: 349.23, d: 1200 },
      { f: 261.63, d: 350 }, { f: 261.63, d: 350 }, { f: 523.25, d: 700 }, { f: 440.00, d: 700 }, { f: 349.23, d: 700 }, { f: 329.63, d: 700 }, { f: 293.66, d: 700 },
      { f: 466.16, d: 350 }, { f: 466.16, d: 350 }, { f: 440.00, d: 700 }, { f: 349.23, d: 700 }, { f: 392.00, d: 700 }, { f: 349.23, d: 1400 }
    ];

    let noteIdx = 0;
    const playNext = () => {
      if (!this.isPlayingMusic) return;
      const note = melody[noteIdx];
      this.playTone(note.f, 'triangle', note.d / 1000 * 0.9, 0.2);
      
      noteIdx = (noteIdx + 1) % melody.length;
      this.musicTimer = setTimeout(playNext, note.d);
    };

    playNext();
    return true;
  }

  stopHappyBirthday() {
    this.isPlayingMusic = false;
    clearTimeout(this.musicTimer);
    document.querySelector('.top-control-bar').classList.remove('music-playing');
    document.getElementById('musicStatusText').innerText = 'Play Music 🎶';
  }
}

const sounds = new SoundEngine();

// --- 2. CONFETTI & FIREWORKS ENGINE ---
class CelebrationFX {
  constructor() {
    this.confettiCanvas = document.getElementById('confettiCanvas');
    this.ctx = this.confettiCanvas.getContext('2d');
    this.particles = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    this.confettiCanvas.width = window.innerWidth;
    this.confettiCanvas.height = window.innerHeight;
  }

  blast(originX = window.innerWidth / 2, originY = window.innerHeight / 2, count = 100) {
    const colors = ['#ff3366', '#ffd700', '#00f2fe', '#7928ca', '#10b981', '#f43f5e', '#ffffff'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      this.particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5,
        gravity: 0.25,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 6,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        life: 1,
        decay: Math.random() * 0.015 + 0.008,
        shape: Math.random() > 0.4 ? 'rect' : 'circle'
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotationSpeed;
      p.life -= p.decay;

      if (p.life <= 0 || p.y > this.confettiCanvas.height + 50) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.life;
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }

    requestAnimationFrame(this.animate);
  }
}

let fx;

// --- 3. BACKGROUND FLOATING BALLOONS & EMOJIS ---
function initFloatingBackground() {
  const container = document.getElementById('floatingContainer');
  const items = ['🎈', '🎂', '🎉', '✨', '👑', '🎁', '🍕', '🍰', '🧁', '⭐'];

  for (let i = 0; i < 22; i++) {
    const el = document.createElement('div');
    el.className = 'floating-item';
    el.innerText = items[Math.floor(Math.random() * items.length)];
    el.style.left = `${Math.random() * 95}vw`;
    el.style.fontSize = `${Math.random() * 1.5 + 1.2}rem`;
    el.style.animationDuration = `${Math.random() * 10 + 12}s`;
    el.style.animationDelay = `${Math.random() * 10}s`;
    container.appendChild(el);
  }
}

// --- 4. TYPEWRITER EFFECT (ENGLISH) ---
const typewriterPhrases = [
  "The One and Only Legendary Tanvir! 👑",
  "Today is Tanvir's Day! 🍕",
  "Happy Birthday Tanvir — The King of Chill & Fun! 🕶️",
  "One year older, but did the wisdom kick in yet? 🤔",
  "Forever Young, Forever Iconic, World's Best Bro! ❤️",
  
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function handleTypewriter() {
  const element = document.getElementById('typewriterText');
  if (!element) return;

  const currentPhrase = typewriterPhrases[phraseIndex];

  if (isDeleting) {
    element.innerText = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    element.innerText = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  let typingSpeed = isDeleting ? 30 : 65;

  if (!isDeleting && charIndex === currentPhrase.length) {
    typingSpeed = 2200; // Pause at end
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % typewriterPhrases.length;
    typingSpeed = 500;
  }

  setTimeout(handleTypewriter, typingSpeed);
}

// --- 5. CAKE CUTTING CEREMONY ---
let candlesBlown = false;
let cakeCut = false;

function initCakeCeremony() {
  const blowBtn = document.getElementById('blowCandlesBtn');
  const cutBtn = document.getElementById('cutCakeBtn');
  const reaction = document.getElementById('cakeReactionText');

  blowBtn.addEventListener('click', () => {
    sounds.playTone(300, 'sine', 0.2);
    document.querySelectorAll('.flame').forEach(f => f.classList.add('blown-out'));
    
    // Add smoke effect
    document.querySelectorAll('.candle').forEach(c => {
      const smoke = document.createElement('div');
      smoke.className = 'smoke-particle';
      c.appendChild(smoke);
      setTimeout(() => smoke.remove(), 1200);
    });

    candlesBlown = true;
    blowBtn.disabled = true;
    blowBtn.style.opacity = '0.5';
    cutBtn.classList.remove('btn-secondary');
    cutBtn.classList.add('btn-primary');
    
    reaction.innerHTML = '💨 Candles are out! Make a birthday wish and slice the cake, Tanvir! 🎂';
    sounds.playCheer();
    fx.blast(window.innerWidth / 2, window.innerHeight * 0.4, 40);
  });

  cutBtn.addEventListener('click', () => {
    if (!candlesBlown) {
      reaction.innerHTML = '⚠️ Hold on bro! Blow the candles out first!';
      sounds.playBuzzer();
      return;
    }

    const overlay = document.querySelector('.cake-cut-overlay');
    overlay.classList.add('slicing');
    sounds.playSlice();

    setTimeout(() => {
      cakeCut = true;
      reaction.innerHTML = '🎉 Woohoo! Cake sliced! Tanvir owes everyone a big slice & treat! 🍰😋';
      fx.blast(window.innerWidth / 2, window.innerHeight * 0.5, 150);
      sounds.playSuccess();
      
      // Auto start music if not playing
      if (!sounds.isPlayingMusic) {
        sounds.toggleHappyBirthday();
      }
    }, 400);
  });
}

// --- 6. TANVIR'S SPIN THE WHEEL OF FORTUNE ---
const wheelOptions = [
  { text: "🍕 Grand Pizza Party", color: "#ff0080" },
  { text: "💸 $50 Salami Treat", color: "#7928ca" },
  { text: "🏃‍♂️ Escapes From Treat", color: "#f59e0b" },
  { text: "💍 Wedding Proposal!", color: "#10b981" },
  { text: "☕ Coffee & Snacks", color: "#00f2fe" },
  { text: "🛌 24-Hour Nap Pass", color: "#ef4444" },
  { text: "👑 King of the Day", color: "#ec4899" },
  { text: "🎁 Jackpot: VIP Feast", color: "#eab308" }
];

let currentWheelAngle = 0;
let isSpinning = false;

function drawWheel() {
  const canvas = document.getElementById('wheelCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = canvas.width;
  const center = size / 2;
  const radius = center - 8;
  const arcSize = (2 * Math.PI) / wheelOptions.length;

  ctx.clearRect(0, 0, size, size);

  wheelOptions.forEach((opt, i) => {
    const angle = i * arcSize;
    ctx.beginPath();
    ctx.fillStyle = opt.color;
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, angle, angle + arcSize);
    ctx.lineTo(center, center);
    ctx.fill();
    ctx.stroke();

    // Segment text
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(angle + arcSize / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Outfit, sans-serif';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 4;
    ctx.fillText(opt.text, radius - 20, 5);
    ctx.restore();
  });
}

function spinWheel() {
  if (isSpinning) return;
  isSpinning = true;
  sounds.init();

  const spinBtn = document.getElementById('spinWheelBtn');
  spinBtn.disabled = true;

  const extraSpins = 5 + Math.floor(Math.random() * 4); // 5-8 full spins
  const randomSegment = Math.floor(Math.random() * wheelOptions.length);
  const segmentDegree = 360 / wheelOptions.length;
  
  // Calculate target rotation so arrow (top) points to randomSegment
  const targetDeg = (extraSpins * 360) + (360 - (randomSegment * segmentDegree + segmentDegree / 2) + 270) % 360;
  currentWheelAngle += targetDeg;

  const canvas = document.getElementById('wheelCanvas');
  canvas.style.transform = `rotate(${currentWheelAngle}deg)`;

  // Tick sound during rotation
  let tickCount = 0;
  const tickInterval = setInterval(() => {
    sounds.playTone(600 + (tickCount % 5) * 50, 'sine', 0.05, 0.1);
    tickCount++;
    if (tickCount > 25) clearInterval(tickInterval);
  }, 120);

  setTimeout(() => {
    isSpinning = false;
    spinBtn.disabled = false;
    const resultBox = document.getElementById('wheelResultText');
    const selected = wheelOptions[randomSegment];
    resultBox.innerHTML = `🎉 Destiny Decided: <strong>${selected.text}</strong>! Tanvir, arrange this immediately!`;
    sounds.playSuccess();
    fx.blast(window.innerWidth / 2, window.innerHeight * 0.6, 90);
  }, 4100);
}

// --- 7. RUNAWAY TREAT BUTTON (FUNNY INTERACTIVE) ---
let runawayAttempts = 0;
const runawayExcuses = [
  "Haha! My wallet is in airplane mode! 🏃💨",
  "No cash right now, only pure love! ❤️",
  "Treat will be served at my wedding! 💍",
  "First pass all your exams, then treat! 📚",
  "Catch me if you can, rookie! 😜",
  "Error 404: Treat balance not found! ⚠️"
];

function initRunawayButton() {
  const btn = document.getElementById('runawayTreatBtn');
  const box = document.getElementById('runawayBox');
  const bubble = document.getElementById('runawayBubble');

  const escapeButton = () => {
    runawayAttempts++;
    sounds.playTone(350 + runawayAttempts * 40, 'sine', 0.1, 0.2);

    if (runawayAttempts >= 6) {
      // Caught!
      bubble.style.opacity = '1';
      bubble.innerText = "Damn! You actually caught me! Take a screenshot and demand a treat from Tanvir! 🍕🎉";
      btn.innerText = "🎉 Congratulations! You caught Tanvir!";
      btn.style.left = '50%';
      btn.style.top = '50%';
      btn.style.transform = 'translate(-50%, -50%)';
      fx.blast(window.innerWidth / 2, window.innerHeight / 2, 80);
      return;
    }

    const boxRect = box.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    const maxLeft = boxRect.width - btnRect.width - 20;
    const maxTop = boxRect.height - btnRect.height - 20;

    const randomX = Math.max(10, Math.floor(Math.random() * maxLeft));
    const randomY = Math.max(10, Math.floor(Math.random() * maxTop));

    btn.style.left = `${randomX}px`;
    btn.style.top = `${randomY}px`;
    btn.style.transform = 'none';

    bubble.style.opacity = '1';
    bubble.innerText = runawayExcuses[runawayAttempts % runawayExcuses.length];
  };

  btn.addEventListener('mouseenter', escapeButton);
  btn.addEventListener('touchstart', (e) => {
    if (runawayAttempts < 6) {
      e.preventDefault();
      escapeButton();
    }
  });

  btn.addEventListener('click', () => {
    if (runawayAttempts >= 6) {
      showModal("🎉 Treat Alert!", "Tanvir, you have officially been caught! There is no escape now — grand treat is confirmed!");
    } else {
      escapeButton();
    }
  });
}

// --- 8. BALLOON POPPING MINI-GAME ---
let gameActive = false;
let gameScore = 0;
let gameTimer = 30;
let gameInterval;
let balloonSpawnInterval;

function startGame() {
  const arena = document.getElementById('gameArena');
  const overlay = document.getElementById('gameStartOverlay');
  const scoreDisplay = document.getElementById('gameScore');
  const timerDisplay = document.getElementById('gameTimer');

  gameActive = true;
  gameScore = 0;
  gameTimer = 30;
  scoreDisplay.innerText = gameScore;
  timerDisplay.innerText = gameTimer;
  overlay.style.display = 'none';

  // Remove existing balloons
  document.querySelectorAll('.game-balloon').forEach(b => b.remove());

  sounds.playSuccess();

  gameInterval = setInterval(() => {
    gameTimer--;
    timerDisplay.innerText = gameTimer;
    if (gameTimer <= 0) {
      endGame();
    }
  }, 1000);

  balloonSpawnInterval = setInterval(() => {
    if (!gameActive) return;
    spawnGameBalloon(arena);
  }, 450);
}

function spawnGameBalloon(arena) {
  const b = document.createElement('div');
  b.className = 'game-balloon';
  
  const isGolden = Math.random() < 0.15;
  const colors = ['#ff3366', '#00f2fe', '#7928ca', '#10b981', '#f59e0b', '#ec4899'];
  const color = isGolden ? '#ffd700' : colors[Math.floor(Math.random() * colors.length)];

  b.style.backgroundColor = color;
  if (isGolden) {
    b.innerText = '⭐';
    b.style.boxShadow = '0 0 15px #ffd700';
  }

  const startX = Math.random() * (arena.clientWidth - 70);
  b.style.left = `${startX}px`;
  b.style.bottom = '-80px';

  arena.appendChild(b);

  const speed = Math.random() * 2 + 2.5;
  let currentBottom = -80;

  const floatTimer = setInterval(() => {
    if (!gameActive || !b.parentElement) {
      clearInterval(floatTimer);
      return;
    }
    currentBottom += speed;
    b.style.bottom = `${currentBottom}px`;

    if (currentBottom > arena.clientHeight + 80) {
      clearInterval(floatTimer);
      b.remove();
    }
  }, 20);

  b.addEventListener('pointerdown', () => {
    if (!gameActive) return;
    clearInterval(floatTimer);
    sounds.playPop();

    const points = isGolden ? 5 : 1;
    gameScore += points;
    document.getElementById('gameScore').innerText = gameScore;

    const rect = b.getBoundingClientRect();
    fx.blast(rect.left + 25, rect.top + 25, isGolden ? 35 : 15);

    b.remove();
  });
}

function endGame() {
  gameActive = false;
  clearInterval(gameInterval);
  clearInterval(balloonSpawnInterval);

  const overlay = document.getElementById('gameStartOverlay');
  overlay.style.display = 'flex';
  overlay.innerHTML = `
    <h2>⏱️ Time's Up!</h2>
    <p style="font-size: 1.3rem;">Your Total Score: <strong style="color: #ffd700;">${gameScore}</strong></p>
    <p>${gameScore > 20 ? '🔥 Incredible! You set the birthday dance floor on fire!' : '😉 Great effort! Play again to beat your high score!'}</p>
    <button class="btn-primary" onclick="startGame()">🔄 Play Again</button>
  `;

  sounds.playCheer();
  fx.blast(window.innerWidth / 2, window.innerHeight * 0.5, 100);
}

// --- 9. "HOW WELL DO YOU KNOW TANVIR?" QUIZ (ENGLISH) ---
const quizQuestions = [
  {
    q: "1. What is Tanvir's absolute favorite daily hobby?",
    options: ["Scrolling reels on his phone till 3 AM 📱", "Sleeping like a hibernating panda 🛌", "Pretending not to hear when asked for a treat 🙉", "All of the above (100% verified) 😂"],
    correct: 3
  },
  {
    q: "2. What is Tanvir's ultimate future dream?",
    options: ["Becoming a multi-billionaire tech mogul 💰", "Passing through life with zero stress 🎓", "Throwing a grand luxury banquet for friends 🍛", "Watching anime non-stop without sleep 🎬"],
    correct: 0
  },
  {
    q: "3. Who is the most stylish and charismatic person today?",
    options: ["Tanvir 😎", "Tanvir the Boss 👑", "Birthday Boy Tanvir 🎂", "All of the above are Tanvir 🔥"],
    correct: 3
  },
  {
    q: "4. When is Tanvir finally paying for the grand dinner treat?",
    options: ["Tonight at 8 PM sharp ⏰", "Next century maybe 📅", "At his royal wedding 👰", "When extraterrestrials visit Earth 🌙"],
    correct: 0
  }
];

let quizIndex = 0;
let quizScore = 0;

function renderQuiz() {
  const container = document.getElementById('quizContainer');
  if (!container) return;

  if (quizIndex >= quizQuestions.length) {
    // Quiz finished
    container.innerHTML = `
      <div class="quiz-result-card glass-card">
        <div style="font-size: 3.5rem; margin-bottom: 10px;">🏆</div>
        <h3 style="font-size: 1.8rem; color: #ffd700; margin-bottom: 12px;">Quiz Completed!</h3>
        <p style="font-size: 1.25rem; margin-bottom: 20px;">
          You scored <strong>${quizScore} out of ${quizQuestions.length}</strong>! Verified: You are one of Tanvir's truest and closest pals! ❤️
        </p>
        <button class="btn-gold" onclick="restartQuiz()">🔄 Retake Quiz</button>
      </div>
    `;
    fx.blast(window.innerWidth / 2, window.innerHeight * 0.5, 120);
    sounds.playSuccess();
    return;
  }

  const cur = quizQuestions[quizIndex];
  const progressPercent = ((quizIndex + 1) / quizQuestions.length) * 100;

  container.innerHTML = `
    <div class="glass-card quiz-box">
      <div class="quiz-progress-bar">
        <div class="quiz-progress-fill" style="width: ${progressPercent}%;"></div>
      </div>
      <h3 class="quiz-question-title">${cur.q}</h3>
      <div class="quiz-options-list">
        ${cur.options.map((opt, i) => `
          <button class="quiz-option-btn" onclick="answerQuiz(${i})">
            <span>🔹</span> ${opt}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function answerQuiz(optionIdx) {
  const cur = quizQuestions[quizIndex];
  if (optionIdx === cur.correct) {
    quizScore++;
    sounds.playSuccess();
  } else {
    sounds.playTone(250, 'sawtooth', 0.2);
  }

  quizIndex++;
  renderQuiz();
}

function restartQuiz() {
  quizIndex = 0;
  quizScore = 0;
  renderQuiz();
}

// --- 10. ROAST & COMPLIMENT GENERATOR (ENGLISH) ---
const roasts = [
  "Happy Birthday Tanvir! Another year older, but your WhatsApp reply speed is still stuck on 2G! 📱🐢",
  "Tanvir, your age went up, but when will your willingness to pay for dinner go up? 🍕😂",
  "Happy Birthday bro! Whenever you open your wallet, even spiders come out saying 'nothing here'! 💸🕸️",
  "Congratulations Tanvir! You are officially one year closer to full uncle status! 👴🎉",
  "We decided to forgive all your debts today... provided you feed us a luxury pizza tonight! 😜",
  "Tanvir's secret superpower: Vanishing into thin air the second the restaurant bill arrives! 🏃‍♂️💨"
];

const compliments = [
  "Happy Birthday Tanvir! Having a loyal, witty, and kind-hearted friend like you is a genuine blessing! ❤️",
  "To the undisputed vibe-maker and life of every party — Happy Birthday Tanvir! 💎✨",
  "May this year unlock massive success, wealth, health, and unmatched happiness for you! 🚀👑",
  "Never change who you are — generous, hilarious, and an absolute legend! Cheers to you, Tanvir! 🥂🎉",
  "Wishing you a year ahead filled with unforgettable wins and boundless joy! Stay blessed bro! 🌟🎂"
];

function generateRoast() {
  const display = document.getElementById('roastDisplay');
  const quote = roasts[Math.floor(Math.random() * roasts.length)];
  display.innerText = quote;
  sounds.playBuzzer();
}

function generateCompliment() {
  const display = document.getElementById('roastDisplay');
  const quote = compliments[Math.floor(Math.random() * compliments.length)];
  display.innerText = quote;
  sounds.playSuccess();
  fx.blast(window.innerWidth / 2, window.innerHeight * 0.6, 50);
}

// --- 11. VIRTUAL GIFT UNBOXING (ENGLISH) ---
const giftsData = [
  {
    title: "The Royal Box 👑",
    content: "You received: A lifetime supply of warm prayers, eternal good vibes, pure joy, and a Golden Crown! 👑✨"
  },
  {
    title: "The Tech Mystery 📱",
    content: "You received: A virtual iPhone 16 Pro Max! (Disclaimer: Battery at 1% and charger sold separately 😂)"
  },
  {
    title: "Foodie Delight 🍗",
    content: "You received: A VIP Feast with Unlimited Burgers, Pizza & Fries! (Billed directly to Birthday Boy Tanvir 😋)"
  }
];

function openGift(index) {
  const gift = giftsData[index];
  showModal(gift.title, gift.content);
  sounds.playSuccess();
  fx.blast(window.innerWidth / 2, window.innerHeight / 2, 110);
}

// --- 12. MODAL HELPER ---
function showModal(title, text) {
  const modal = document.getElementById('generalModal');
  document.getElementById('modalTitle').innerText = title;
  document.getElementById('modalContent').innerText = text;
  modal.classList.add('active');
}

function closeModal() {
  document.getElementById('generalModal').classList.remove('active');
}

// --- 13. WISHES WALL & LOCALSTORAGE (ENGLISH) ---
const defaultWishes = [
  { name: "The Besties Squad", tag: "Squad", text: "Happy Birthday Tanvir! Life is never boring with you around. Tonight's party is 100% on you! 🎉" },
  { name: "Bro for Life", tag: "Best Bro", text: "Happy Birthday to the most reliable and hilarious brother ever! Keep shining bright, bro!" },
  { name: "Secret Admirer", tag: "Friend", text: "Happy Birthday Tanvir! Your smile brightens up any room. Stay awesome always! 🌸" },
  { name: "The College Gang", tag: "Homies", text: "To the man, the myth, the legend — Tanvir! May this year be your biggest and most successful yet! 🚀" }
];

function loadWishes() {
  const saved = localStorage.getItem('tanvir_birthday_wishes_en');
  const list = saved ? JSON.parse(saved) : defaultWishes;
  const container = document.getElementById('wishesContainer');
  if (!container) return;

  container.innerHTML = list.map(w => `
    <div class="wish-sticky-note">
      <div class="wish-header">
        <div class="wish-avatar">💌</div>
        <div class="wish-author-info">
          <span class="wish-author-name">${w.name}</span>
          <span class="wish-tag">${w.tag || 'Friend'}</span>
        </div>
      </div>
      <p class="wish-body-text">${w.text}</p>
    </div>
  `).join('');
}

function addWish(e) {
  e.preventDefault();
  const nameInput = document.getElementById('wishNameInput');
  const textInput = document.getElementById('wishTextInput');

  const name = nameInput.value.trim() || 'Well-wisher';
  const text = textInput.value.trim();

  if (!text) return;

  const saved = localStorage.getItem('tanvir_birthday_wishes_en');
  const list = saved ? JSON.parse(saved) : defaultWishes;

  list.unshift({ name, tag: 'Guest', text });
  localStorage.setItem('tanvir_birthday_wishes_en', JSON.stringify(list));

  nameInput.value = '';
  textInput.value = '';

  loadWishes();
  sounds.playSuccess();
  fx.blast(window.innerWidth / 2, window.innerHeight * 0.8, 60);
  showModal("Thank You! 🎉", "Your birthday wish has been posted to Tanvir's celebration wall!");
}

// --- 14. POLAROID PHOTO UPLOAD ---
function initPhotoUpload() {
  const input = document.getElementById('photoUploadInput');
  if (!input) return;

  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const customImg = document.getElementById('customPolaroidImg');
      if (customImg) {
        customImg.src = event.target.result;
        sounds.playSuccess();
        fx.blast(window.innerWidth / 2, window.innerHeight * 0.7, 70);
      }
    };
    reader.readAsDataURL(file);
  });
}

// --- 15. INITIALIZATION ON DOM READY ---
document.addEventListener('DOMContentLoaded', () => {
  fx = new CelebrationFX();
  initFloatingBackground();
  handleTypewriter();
  initCakeCeremony();
  drawWheel();
  initRunawayButton();
  renderQuiz();
  loadWishes();
  initPhotoUpload();

  // Top control bar events
  document.getElementById('musicToggleBtn').addEventListener('click', () => {
    sounds.toggleHappyBirthday();
  });

  document.getElementById('confettiBlastBtn').addEventListener('click', () => {
    fx.blast(window.innerWidth / 2, window.innerHeight / 2, 120);
    sounds.playCheer();
  });

  // Wheel spin button
  document.getElementById('spinWheelBtn').addEventListener('click', spinWheel);

  // Wish form
  document.getElementById('newWishForm').addEventListener('submit', addWish);

  // Close modal on click outside
  document.getElementById('generalModal').addEventListener('click', (e) => {
    if (e.target.id === 'generalModal') closeModal();
  });

  // Initial greeting blast
  setTimeout(() => {
    fx.blast(window.innerWidth / 2, window.innerHeight * 0.35, 100);
  }, 1000);
});
