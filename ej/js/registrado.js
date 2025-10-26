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
  // Nombre a guardar como autor de los consejos
  const AUTOR_ACTUAL = (`${datos.nombre || ""} ${datos.apellidos || ""}`.trim()) || "Usuario";


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

   // -----------------------------
  // NUEVO: Lógica "Últimos consejos"
  // -----------------------------
  const STORAGE_KEY_CONSEJOS = "consejosMSF";
  const listaConsejosEl = document.getElementById("lista-consejos");
  const formConsejos = document.getElementById("form-consejos");
  const inputTitulo = document.getElementById("titulo-consejo");
  const inputDescripcion = document.getElementById("descripcion-consejo");

  function cargarConsejos() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_CONSEJOS)) || [];
    } catch {
      return [];
    }
  }

  function guardarConsejos(arr) {
    localStorage.setItem(STORAGE_KEY_CONSEJOS, JSON.stringify(arr));
  }

  function renderConsejos() {
    const consejos = cargarConsejos()
      .sort((a, b) => b.createdAt - a.createdAt) // más recientes primero
      .slice(0, 3);

    listaConsejosEl.innerHTML = "";

    if (consejos.length === 0) {
      // (Opcional) texto vacío si no hay consejos aún
      const li = document.createElement("li");
      li.textContent = "Aún no hay consejos. ¡Sé el primero en compartir uno!";
      listaConsejosEl.appendChild(li);
      return;
    }

    for (const c of consejos) {
      const li = document.createElement("li");

      // enlace al consejo
      const a = document.createElement("a");
      a.href = `consejo.html?id=${encodeURIComponent(c.id)}`;
      a.textContent = c.titulo;
      a.className = "consejo-link";
      li.appendChild(a);

      // ← NUEVO: mostrar " por {autor}"
      const spanAutor = document.createElement("span");
      spanAutor.className = "autor-consejo";
      spanAutor.textContent = ` por ${c.autor || "Usuario"}`;
      li.appendChild(spanAutor);

      listaConsejosEl.appendChild(li);
    }

  }

  // Pintar al cargar
  renderConsejos();

  // Validación + alta de consejos
  formConsejos.addEventListener("submit", (e) => {
    e.preventDefault();

    const titulo = (inputTitulo.value || "").trim();
    const descripcion = (inputDescripcion.value || "").trim();

    // Reset de mensajes nativos para evitar arrastre
    inputTitulo.setCustomValidity("");
    inputDescripcion.setCustomValidity("");

    let valido = true;

    if (titulo.length < 15) {
      inputTitulo.setCustomValidity("El título debe tener al menos 15 caracteres.");
      valido = false;
    }
    if (descripcion.length < 30) {
      inputDescripcion.setCustomValidity("La descripción debe tener al menos 30 caracteres.");
      valido = false;
    }

    // Si algo falla, mostramos los mensajes nativos del navegador
    if (!valido) {
      // Fuerza a que el navegador muestre los mensajes en los campos con error
      inputTitulo.reportValidity();
      inputDescripcion.reportValidity();
      return;
    }

    // Crear el objeto consejo
    // Crear el objeto consejo (ahora con autor)
    const nuevo = {
      id: crypto.randomUUID ? crypto.randomUUID() : (Date.now() + "-" + Math.random().toString(16).slice(2)),
      titulo,
      descripcion,
      createdAt: Date.now(),
      autor: AUTOR_ACTUAL
    };


    const lista = cargarConsejos();
    // Añadir al comienzo (más reciente primero)
    lista.unshift(nuevo);
    guardarConsejos(lista);

    // Actualizar UI
    renderConsejos();

    // Limpiar formulario
    formConsejos.reset();
  });


});
