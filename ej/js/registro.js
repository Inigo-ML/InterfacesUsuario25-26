const formulario = document.querySelector(".formulario-registro");
const checkboxPrivacidad = document.getElementById("checkbox-privacidad");
const botonAcceder = document.querySelector(".boton-acceder");

// Obtener elementos del formulario
const inputNombre = document.getElementById("nombre");
const inputApellidos = document.getElementById("apellidos");
const inputFechaNacimiento = document.getElementById("fecha-nacimiento");
const inputPassword = document.getElementById("contraseña");
const inputRepetirPassword = document.getElementById("repetir-contraseña");
const inputEmail = document.getElementById("email");
const inputConfirmarEmail = document.getElementById("confirmar-email");
const inputImagenPerfil = document.getElementById("imagen-perfil");

// Función para validar el nombre
function validarNombre() {
  const nombre = inputNombre.value.trim();

  if (nombre.length < 3) {
    inputNombre.setCustomValidity("El nombre debe tener al menos 3 caracteres");
    return false;
  }

  inputNombre.setCustomValidity("");
  return true;
}

// Función para validar apellidos
function validarApellidos() {
  const apellidos = inputApellidos.value.trim();

  // Dividir por espacios y filtrar elementos vacíos
  const palabras = apellidos
    .split(/\s+/)
    .filter((palabra) => palabra.length > 0);

  if (palabras.length < 2) {
    inputApellidos.setCustomValidity("Debes introducir al menos dos apellidos");
    return false;
  }

  // Verificar que cada palabra tenga al menos 3 caracteres
  for (let palabra of palabras) {
    if (palabra.length < 3) {
      inputApellidos.setCustomValidity(
        "Cada apellido debe tener al menos 3 caracteres"
      );
      return false;
    }
  }

  inputApellidos.setCustomValidity("");
  return true;
}

// Función para validar fecha de nacimiento
function validarFechaNacimiento() {
  const fechaNacimiento = new Date(inputFechaNacimiento.value);
  const fechaActual = new Date();

  // Calcular la fecha hace 120 años (edad máxima realista)
  const fechaMinima = new Date();
  fechaMinima.setFullYear(fechaActual.getFullYear() - 120);

  // Calcular la fecha de hace 18 años (mayoría de edad)
  const fechaMaxima = new Date();
  fechaMaxima.setFullYear(fechaActual.getFullYear() - 18);

  if (fechaNacimiento > fechaActual) {
    inputFechaNacimiento.setCustomValidity(
      "La fecha de nacimiento no puede ser futura"
    );
    return false;
  }

  if (fechaNacimiento > fechaMaxima) {
    inputFechaNacimiento.setCustomValidity(
      "Debes ser mayor de 18 años para registrarte"
    );
    return false;
  }

  if (fechaNacimiento < fechaMinima) {
    inputFechaNacimiento.setCustomValidity("La fecha introducida no es válida");
    return false;
  }

  inputFechaNacimiento.setCustomValidity("");
  return true;
}

// Función para validar contraseña (8 caracteres, con mayúsculas, minúsculas y números)
function validarPassword() {
  const password = inputPassword.value;

  if (password.length < 8) {
    inputPassword.setCustomValidity(
      "La contraseña debe tener al menos 8 caracteres"
    );
    return false;
  }

  // Verificar que contenga al menos una mayúscula
  if (!/[A-Z]/.test(password)) {
    inputPassword.setCustomValidity(
      "La contraseña debe contener al menos una letra mayúscula"
    );
    return false;
  }

  // Verificar que contenga al menos una minúscula
  if (!/[a-z]/.test(password)) {
    inputPassword.setCustomValidity(
      "La contraseña debe contener al menos una letra minúscula"
    );
    return false;
  }

  // Verificar que contenga al menos un número
  if (!/[0-9]/.test(password)) {
    inputPassword.setCustomValidity(
      "La contraseña debe contener al menos un número"
    );
    return false;
  }

  inputPassword.setCustomValidity("");
  return true;
}

// Función para validar que las contraseñas coincidan
function validarRepetirPassword() {
  if (inputPassword.value !== inputRepetirPassword.value) {
    inputRepetirPassword.setCustomValidity("Las contraseñas no coinciden");
    return false;
  }

  inputRepetirPassword.setCustomValidity("");
  return true;
}

// Función para validar el formato del email
function validarEmail() {
  const email = inputEmail.value.trim();

  // Expresión regular para validar formato nombre@dominio.extensión
  const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!regexEmail.test(email)) {
    inputEmail.setCustomValidity(
      "El correo debe tener el formato nombre@dominio.extensión"
    );
    return false;
  }

  inputEmail.setCustomValidity("");
  return true;
}

// Función para validar que los emails coincidan
function validarConfirmarEmail() {
  // Primero validar que el email principal tenga el formato correcto
  if (!validarEmail()) {
    return false;
  }

  if (inputEmail.value !== inputConfirmarEmail.value) {
    inputConfirmarEmail.setCustomValidity(
      "Los correos electrónicos no coinciden"
    );
    return false;
  }

  inputConfirmarEmail.setCustomValidity("");
  return true;
}

// Agregar eventos de validación en tiempo real
inputNombre.addEventListener("input", validarNombre);
inputApellidos.addEventListener("input", validarApellidos);
inputFechaNacimiento.addEventListener("change", validarFechaNacimiento);
inputPassword.addEventListener("input", () => {
  validarPassword();
  if (inputRepetirPassword.value) {
    validarRepetirPassword();
  }
});
inputRepetirPassword.addEventListener("input", validarRepetirPassword);
inputEmail.addEventListener("input", () => {
  validarEmail();
  if (inputConfirmarEmail.value) {
    validarConfirmarEmail();
  }
});
inputConfirmarEmail.addEventListener("input", validarConfirmarEmail);

// Función para guardar datos en cookie
function guardarDatosEnCookie() {
  // Leer el archivo de imagen y convertirlo a Base64
  const archivoImagen = inputImagenPerfil.files[0];

  if (!archivoImagen) {
    alert("Por favor, selecciona una imagen de perfil");
    return false;
  }

  // Usar FileReader para convertir la imagen a Base64
  const reader = new FileReader();
  reader.onload = function (e) {
    const isFile = location.protocol === "file:";

    // 1) Datos de usuario (sin imagen) → SIEMPRE a localStorage
    const datosUsuario = {
      nombre: inputNombre.value.trim(),
      apellidos: inputApellidos.value.trim(),
      email: inputEmail.value.trim(),
      fechaNacimiento: inputFechaNacimiento.value
    };
    localStorage.setItem("usuarioDatos", JSON.stringify(datosUsuario));

    // 2) Cookie SOLO si no estamos en file:// (para cuando lo sirvas por http)
    if (!isFile) {
      const datosJSON = JSON.stringify(datosUsuario);
      const datosEncoded = encodeURIComponent(datosJSON);
      const fechaExpiracion = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = `usuarioRegistrado=${datosEncoded}; expires=${fechaExpiracion}; path=/; SameSite=Lax`;
    }

    // 3) Imagen y credenciales a localStorage
    localStorage.setItem("usuarioImagen", e.target.result);                // dataURL
    localStorage.setItem("usuario", datosUsuario.email);                   // comodidad
    localStorage.setItem("usuarioPass", inputPassword.value.trim());       // en claro (solo clase)
    sessionStorage.setItem("sesionActiva", "1");
    alert("¡Registro completado con éxito! Tus datos han sido guardados.");
    window.location.href = "registrado.html";
  };


  // Leer el archivo como Data URL (Base64)
  reader.readAsDataURL(archivoImagen);

  return true;
}

// Función para leer datos de la cookie
function leerDatosDeCookie() {
  const nombre = "usuarioRegistrado=";
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(nombre) === 0) {
      const datosEncoded = cookie.substring(nombre.length);
      const datosJSON = decodeURIComponent(datosEncoded);
      return JSON.parse(datosJSON);
    }
  }
  return null;
}

// Validar el formulario al enviarlo
formulario.addEventListener("submit", (event) => {
  event.preventDefault();

  // Ejecutar todas las validaciones
  const nombreValido = validarNombre();
  const apellidosValidos = validarApellidos();
  const fechaValida = validarFechaNacimiento();
  const passwordValida = validarPassword();
  const repetirPasswordValida = validarRepetirPassword();
  const emailValido = validarEmail();
  const confirmarEmailValido = validarConfirmarEmail();

  // Si todas las validaciones son correctas
  if (
    nombreValido &&
    apellidosValidos &&
    fechaValida &&
    passwordValida &&
    repetirPasswordValida &&
    emailValido &&
    confirmarEmailValido &&
    checkboxPrivacidad.checked
  ) {
    // Verificar que se haya seleccionado una imagen
    if (!inputImagenPerfil.files || !inputImagenPerfil.files[0]) {
      alert("Por favor, selecciona una imagen de perfil");
      inputImagenPerfil.focus();
      return;
    }

    // Guardar datos en cookie (incluye la redirección dentro de la función)
    guardarDatosEnCookie();
  } else {
    // Mostrar los mensajes de error
    formulario.reportValidity();
  }
});

checkboxPrivacidad.addEventListener("change", () => {
  if (!checkboxPrivacidad.checked) botonAcceder.disabled = true;
  else botonAcceder.disabled = false;
});
