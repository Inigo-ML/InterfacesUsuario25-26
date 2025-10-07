// js/carrusel.js
document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("packs-carousel");
  const slides = Array.from(document.querySelectorAll("#packs-carousel .slide"));
  const prevBtn = document.getElementById("pack-prev");
  const nextBtn = document.getElementById("pack-next");

  if (!contenedor || !slides.length || !prevBtn || !nextBtn) return;

  let i = slides.findIndex(s => s.classList.contains("activa"));
  if (i === -1) { i = 0; slides[0].classList.add("activa"); slides[0].setAttribute("aria-hidden","false"); }

  function show(index) {
    slides[i].classList.remove("activa");
    slides[i].setAttribute("aria-hidden","true");
    i = (index + slides.length) % slides.length;
    slides[i].classList.add("activa");
    slides[i].setAttribute("aria-hidden","false");

    const titulo = slides[i].querySelector(".pack-titulo h2")?.textContent?.trim() || "Pack";
    prevBtn.setAttribute("aria-label", `Ver pack anterior (actual: ${titulo})`);
    nextBtn.setAttribute("aria-label", `Ver pack siguiente (actual: ${titulo})`);
  }

  function anterior(){ show(i - 1); maybeRestartAuto(); }
  function siguiente(){ show(i + 1); maybeRestartAuto(); }

  prevBtn.addEventListener("click", anterior);
  nextBtn.addEventListener("click", siguiente);

  // Teclado
  contenedor.setAttribute("tabindex","0");
  contenedor.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") anterior();
    if (e.key === "ArrowRight") siguiente();
  });

  // ---------- AUTO-PLAY ----------
  const AUTO_MS = 2000; // <-- cambia aquí la velocidad si quieres (ms)
  let autoTimer = null;

  function isPausedByUser() {
    // Pausa si el ratón está encima o si hay foco dentro del carrusel
    return contenedor.matches(":hover") || contenedor.contains(document.activeElement);
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => {
      if (!isPausedByUser() && !document.hidden) {
        siguiente();
      }
    }, AUTO_MS);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function maybeRestartAuto() {
    // Si el usuario no está “pausando” el carrusel, reinicia el temporizador para que
    // no cambie inmediatamente después de una pulsación manual.
    if (!isPausedByUser() && !document.hidden) {
      startAuto();
    }
  }

  // Pausar / reanudar en interacción del usuario
  contenedor.addEventListener("mouseenter", stopAuto);
  contenedor.addEventListener("mouseleave", startAuto);
  contenedor.addEventListener("focusin", stopAuto);
  contenedor.addEventListener("focusout", startAuto);

  // Pausar si la pestaña se oculta (ahorro de recursos)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAuto(); else startAuto();
  });

  // Inicializa
  show(i);
  startAuto();
});
