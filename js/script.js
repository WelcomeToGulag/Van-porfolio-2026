const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");

const cursorDot = document.getElementById("cursorDot");
const cursorRing = document.getElementById("cursorRing");

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

const soundToggle = document.getElementById("soundToggle");
const backTop = document.getElementById("backTop");

const resumeModal = document.getElementById("resumeModal");
const openResumeBtn = document.getElementById("openResumeBtn");
const openResumeBtn2 = document.getElementById("openResumeBtn2");

const hologramCard = document.getElementById("hologramCard");

const typingText = document.getElementById("typingText");

let stars = [];
let soundEnabled = false;
let audioContext = null;

/* Typing Effect */

const typingWords = [
  "Flutter mobile apps.",
  "Firebase-powered systems.",
  "Python automation tools.",
  "interactive dashboards.",
  "modern web experiences.",
  "Play Store-ready projects."
];

let typingWordIndex = 0;
let typingCharIndex = 0;
let isDeleting = false;

function runTypingEffect() {
  if (!typingText) return;

  const currentWord = typingWords[typingWordIndex];

  if (isDeleting) {
    typingCharIndex--;
  } else {
    typingCharIndex++;
  }

  typingText.textContent = currentWord.substring(0, typingCharIndex);

  let typingSpeed = isDeleting ? 45 : 85;

  if (!isDeleting && typingCharIndex === currentWord.length) {
    typingSpeed = 1400;
    isDeleting = true;
  }

  if (isDeleting && typingCharIndex === 0) {
    isDeleting = false;
    typingWordIndex = (typingWordIndex + 1) % typingWords.length;
    typingSpeed = 400;
  }

  setTimeout(runTypingEffect, typingSpeed);
}

runTypingEffect();

/* Background Stars */

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  createStars();
}

function createStars() {
  const count = Math.floor((canvas.width * canvas.height) / 9500);

  stars = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    z: Math.random() * 1 + 0.25,
    size: Math.random() * 2 + 0.5,
    speed: Math.random() * 0.55 + 0.15
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach((star) => {
    star.y += star.speed * star.z;

    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size * star.z, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${0.25 + star.z * 0.5})`;
    ctx.fill();
  });

  requestAnimationFrame(drawStars);
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
drawStars();

/* SFX */

function playSfx(type = "click") {
  if (!soundEnabled) return;

  audioContext =
    audioContext || new (window.AudioContext || window.webkitAudioContext)();

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  const now = audioContext.currentTime;

  oscillator.type = type === "hover" ? "sine" : "triangle";

  oscillator.frequency.setValueAtTime(type === "hover" ? 520 : 260, now);

  oscillator.frequency.exponentialRampToValueAtTime(
    type === "hover" ? 840 : 120,
    now + 0.08
  );

  gain.gain.setValueAtTime(0.0001, now);

  gain.gain.exponentialRampToValueAtTime(
    type === "hover" ? 0.035 : 0.07,
    now + 0.015
  );

  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

  oscillator.start(now);
  oscillator.stop(now + 0.13);
}

/* Custom Cursor */

document.addEventListener("mousemove", (event) => {
  if (!cursorDot || !cursorRing) return;

  cursorDot.style.left = `${event.clientX}px`;
  cursorDot.style.top = `${event.clientY}px`;

  cursorRing.animate(
    {
      left: `${event.clientX}px`,
      top: `${event.clientY}px`
    },
    {
      duration: 450,
      fill: "forwards",
      easing: "ease-out"
    }
  );
});

document.querySelectorAll("a, button, .tilt-card").forEach((item) => {
  item.addEventListener("mouseenter", () => {
    if (cursorRing) {
      cursorRing.classList.add("active");
    }

    playSfx("hover");
  });

  item.addEventListener("mouseleave", () => {
    if (cursorRing) {
      cursorRing.classList.remove("active");
    }
  });

  item.addEventListener("click", () => {
    playSfx("click");
  });
});

/* Mobile Menu */

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("show");
  });
}

document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("show");
  });
});

/* Sound Toggle */

if (soundToggle) {
  soundToggle.addEventListener("click", () => {
    soundEnabled = !soundEnabled;

    soundToggle.textContent = soundEnabled ? "SFX: ON" : "SFX: OFF";

    playSfx("click");
  });
}

/* Back To Top */

window.addEventListener("scroll", () => {
  backTop.classList.toggle("show", window.scrollY > 450);
});

if (backTop) {
  backTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

/* Scroll Reveal */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.16
  }
);

document.querySelectorAll(".reveal").forEach((item) => {
  revealObserver.observe(item);
});

/* Resume Modal */

function openResumeModal() {
  if (!resumeModal) return;

  resumeModal.classList.add("show");
  resumeModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

function closeResumeModal() {
  if (!resumeModal) return;

  resumeModal.classList.remove("show");
  resumeModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

if (openResumeBtn) {
  openResumeBtn.addEventListener("click", openResumeModal);
}

if (openResumeBtn2) {
  openResumeBtn2.addEventListener("click", openResumeModal);
}

document.querySelectorAll("[data-close-resume]").forEach((element) => {
  element.addEventListener("click", closeResumeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeResumeModal();
  }
});

/* 3D Project Tilt */

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateY = (x / rect.width - 0.5) * 12;
    const rotateX = (y / rect.height - 0.5) * -12;

    card.style.transform = `
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-6px)
    `;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0)";
  });
});

/* 3D Hero Tilt */

if (hologramCard) {
  hologramCard.addEventListener("mousemove", (event) => {
    const rect = hologramCard.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateY = (x / rect.width - 0.5) * 18;
    const rotateX = (y / rect.height - 0.5) * -18;

    hologramCard.style.transform = `
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
    `;
  });

  hologramCard.addEventListener("mouseleave", () => {
    hologramCard.style.transform = "rotateX(0deg) rotateY(0deg)";
  });
}

/* Video Safety */

document.querySelectorAll("video").forEach((video) => {
  video.addEventListener("loadedmetadata", () => {
    video.currentTime = 0;
  });
});