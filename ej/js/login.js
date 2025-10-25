function leerCookie(nombre) {
  const pref = nombre + "=";
  return document.cookie
    .split(";")
    .map(c => c.trim())
    .find(c => c.indexOf(pref) === 0)?.substring(pref.length) || null;
}

const form = document.querySelector(".formulario-acceso");
const btnIniciar = document.querySelector("#btn-iniciar-sesion");

if (form && btnIniciar) {
  btnIniciar.addEventListener("click", (event) => {
    event.preventDefault();

    const inputs = form.querySelectorAll("input");
    const emailInput = inputs[0];
    const passInput  = inputs[1];
    const email = (emailInput?.value || "").trim();
    const pass  = passInput?.value || "";

    // 1) Intentar leer datos desde localStorage (soporta file://)
    let datos = null;
    const rawLS = localStorage.getItem("usuarioDatos");
    if (rawLS) {
      try { datos = JSON.parse(rawLS); } catch {}
    }

    // 2) Si no hay en LS y estamos en http, intentar cookie
    if (!datos && location.protocol !== "file:") {
      const raw = leerCookie("usuarioRegistrado");
      if (raw) {
        try { datos = JSON.parse(decodeURIComponent(raw)); } catch {}
      }
    }

    if (!datos) {
      alert("No hay ningún usuario registrado. Regístrate primero.");
      window.location.href = "registro.html";
      return;
    }

    // 3) Comprobar email
    if (!email || email.toLowerCase() !== String(datos.email || "").toLowerCase()) {
      alert("El email no coincide con el registrado.");
      return;
    }

    // 4) Comprobar contraseña (en claro para la práctica)
    const passGuardada = localStorage.getItem("usuarioPass");
    if (!passGuardada) {
      alert("No hay contraseña guardada. Vuelve a registrarte.");
      window.location.href = "registro.html";
      return;
    }

    if (pass === passGuardada) {
      const recordar = form.querySelector("#recordar")?.checked;
      if (recordar) localStorage.setItem("usuario", email);

      // ← NUEVO: marcar sesión activa solo al iniciar sesión correctamente
      sessionStorage.setItem("sesionActiva", "1");

      window.location.href = "registrado.html";
    } else {
      alert("Contraseña incorrecta.");
    }

  });
}
