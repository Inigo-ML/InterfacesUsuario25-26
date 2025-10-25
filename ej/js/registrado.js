function leerCookie(nombre) {
  const pref = nombre + "=";
  return document.cookie
    .split(";")
    .map(c => c.trim())
    .find(c => c.indexOf(pref) === 0)?.substring(pref.length) || null;
}

function borrarCookie(nombre) {
  document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

document.addEventListener("DOMContentLoaded", () => {
  // 1) Preferir localStorage (funciona en file://)
  if (!sessionStorage.getItem("sesionActiva")) {
    window.location.href = "inicio.html";
    return;
  }
  let datos = null;
  const rawLS = localStorage.getItem("usuarioDatos");
  if (rawLS) {
    try { datos = JSON.parse(rawLS); } catch {}
  }

  // 2) Si no hay en LS y no estamos en file://, intenta cookie
  if (!datos && location.protocol !== "file:") {
    const raw = leerCookie("usuarioRegistrado");
    if (raw) {
      try { datos = JSON.parse(decodeURIComponent(raw)); } catch {}
    }
  }

  if (!datos) {
    // sin datos en ningún sitio → a registrar
    window.location.href = "registro.html";
    return;
  }

  // Pintar nombre completo
  const h4 = document.getElementById("nombre-usuario");
  if (h4) h4.textContent = `${datos.nombre || ""} ${datos.apellidos || ""}`.trim() || "Usuario";

  // Pintar imagen (dataURL en localStorage)
  const img = document.getElementById("img-usuario");
  const imgLS = localStorage.getItem("usuarioImagen");
  if (img) {
    if (imgLS) img.src = imgLS;
    img.alt = `Foto de perfil de ${datos.nombre || "usuario"}`;
  }

  // Logout
  // Logout
  const btnLogout = document.getElementById("btn-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
        // ← NUEVO: cerrar solo la sesión, no credenciales
        sessionStorage.removeItem("sesionActiva");

        // Si estás en http(s), opcionalmente borra la cookie de sesión
        if (location.protocol !== "file:") {
        borrarCookie("usuarioRegistrado");
        }

        // ¡Importante! NO tocamos:
        // localStorage.removeItem("usuarioDatos");
        // localStorage.removeItem("usuario");
        // localStorage.removeItem("usuarioPass");
        // localStorage.removeItem("usuarioImagen");

        window.location.href = "inicio.html";
    });
 }

});
