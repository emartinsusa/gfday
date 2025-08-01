document.addEventListener("DOMContentLoaded", () => {
  const slides      = Array.from(document.querySelectorAll(".slide"));
  const audioEl     = document.getElementById("letter-audio");
  const imgEl       = document.getElementById("letter-img");
  const audioBtn    = document.getElementById("audio-btn");
  const playSvg     = document.getElementById("audio-icon-play");
  const pauseSvg    = document.getElementById("audio-icon-pause");
  const prevBtn     = document.getElementById("prev-btn");
  const nextBtn     = document.getElementById("next-btn");
  const slidePause  = document.getElementById("slide-pause-btn");
  const ctrlPlay    = document.getElementById("ctrl-play");
  const ctrlPause   = document.getElementById("ctrl-pause");

  let current      = 0;
  let slideTimer   = null;
  const SLIDE_DELAY = 8000; // 8 segundos

  function clearSlideTimer() {
    if (slideTimer) {
      clearInterval(slideTimer);
      slideTimer = null;
    }
  }

  function resetSlides() {
    slides.forEach(slide => {
      slide.classList.remove("active");
      slide.querySelectorAll(".fade-text").forEach(el => el.classList.remove("visible"));
    });
    // pausa e reseta áudio
    audioEl.pause();
    audioEl.currentTime = 0;
    playSvg.classList.add("hidden");
    pauseSvg.classList.remove("hidden");
    ctrlPlay.classList.add("hidden");
    ctrlPause.classList.remove("hidden");
    if (imgEl) imgEl.style.opacity = "0";
  }

  function showSlide(i) {
    if (i < 0 || i >= slides.length) return;
    clearSlideTimer();
    resetSlides();
    current = i;
    const slide = slides[current];
    slide.classList.add("active");

    // fade-in de todos os .fade-text em cascata
    const fadeEls = slide.querySelectorAll(".fade-text");
    fadeEls.forEach((el, idx) => {
      setTimeout(() => el.classList.add("visible"), idx * 200);
    });

    // slide-specific
    if (current === 1) {
      // mostra imagem depois do texto
      setTimeout(() => {
        if (imgEl) imgEl.style.opacity = "1";
      }, 800);
      // mostra controle de áudio
      setTimeout(() => {
        const ctrl = document.getElementById("audio-control");
        if (ctrl) ctrl.style.opacity = "1";
      }, 1400);

      // toca o áudio automaticamente
      audioEl.play().catch(() => {
        // pode falhar se não houver interação, mas tentamos
      });
      // avança somente quando o áudio terminar
      audioEl.onended = () => {
        showSlide(2);
      };
      // não reiniciamos o slideTimer; ele será reiniciado no próximo slide
      return;
    }

    // autoplay normal só para slides 0 e 2
    slideTimer = setInterval(() => {
      showSlide((current + 1) % slides.length);
    }, SLIDE_DELAY);

    if (current === 2) {
      // nada extra, apenas o autoplay
    }
  }

  // navegação manual
  prevBtn.onclick = () => showSlide(current - 1);
  nextBtn.onclick = () => showSlide(current + 1);

  // pause/play do autoplay de slides
  slidePause.onclick = () => {
    if (slideTimer) {
      clearSlideTimer();
      ctrlPlay.classList.remove("hidden");
      ctrlPause.classList.add("hidden");
    } else {
      ctrlPlay.classList.add("hidden");
      ctrlPause.classList.remove("hidden");
      slideTimer = setInterval(() => {
        showSlide((current + 1) % slides.length);
      }, SLIDE_DELAY);
    }
  };

  // controle de áudio manual
  audioBtn.onclick = () => {
    if (audioEl.paused) {
      audioEl.play().catch(() => {});
      playSvg.classList.add("hidden");
      pauseSvg.classList.remove("hidden");
    } else {
      audioEl.pause();
      playSvg.classList.remove("hidden");
      pauseSvg.classList.add("hidden");
    }
  };

  // inicia no slide 0
  showSlide(0);
});
