// js/checkout-validate.js
(() => {
    const form = document.getElementById("form-compra");
    if (!form) return; // No interfiere en nada si no encuentra el formulario
  
    const $ = (s) => form.querySelector(s);
    const nombre = $("#nombre");
    const correo = $("#correo");
    const tipoTarjeta = $("#tipo-tarjeta");
    const numeroTarjeta = $("#numero-tarjeta");
    const titular = $("#titular");
    const caducidad = $("#caducidad");
    const cvv = $("#cvv");
    const msgError = document.getElementById("form-error");
  
    // Utilidades locales (sin globals)
    const hoyYYYYMM = () => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    };
  
    const limpiarErrores = () => {
      if (msgError) {
        msgError.hidden = true;
        msgError.textContent = "";
      }
      form.querySelectorAll(".campo-invalido").forEach((el) => {
        el.classList.remove("campo-invalido");
        el.removeAttribute("aria-invalid");
      });
    };
  
    const marcarError = (campo, mensaje) => {
      campo.classList.add("campo-invalido");
      campo.setAttribute("aria-invalid", "true");
      if (msgError && msgError.hidden) msgError.hidden = false;
      if (msgError && !msgError.textContent) msgError.textContent = mensaje;
    };
  
    // Preconfiguración segura
    document.addEventListener("DOMContentLoaded", () => {
      // Fuerza mínimo de caducidad al mes actual
      caducidad.min = hoyYYYYMM();
  
      // Normaliza número (solo dígitos)
      numeroTarjeta.addEventListener("input", () => {
        numeroTarjeta.value = numeroTarjeta.value.replace(/\D+/g, "");
      });
  
      // Normaliza CVV (solo 3 dígitos)
      cvv.addEventListener("input", () => {
        cvv.value = cvv.value.replace(/\D+/g, "").slice(0, 3);
      });
    });
  
    // Validaciones (solo del formulario)
    const validaNombre = () => (nombre.value || "").trim().length >= 3;
    const validaEmail = () => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((correo.value || "").trim());
    const validaTipoTarjeta = () => ["visa","mastercard","amex"].includes(tipoTarjeta.value);
    const validaNumeroTarjeta = () => /^(?:\d{13}|\d{15}|\d{16}|\d{19})$/.test((numeroTarjeta.value || "").trim());
    const validaTitular = () => (titular.value || "").trim().length >= 3;
    const validaCaducidad = () => /^\d{4}-\d{2}$/.test(caducidad.value) && caducidad.value >= hoyYYYYMM();
    const validaCVV = () => /^\d{3}$/.test((cvv.value || "").trim());
  
    const validar = () => {
      limpiarErrores();
      if (!validaNombre()) { marcarError(nombre, "El nombre completo debe tener al menos 3 caracteres."); return false; }
      if (!validaEmail()) { marcarError(correo, "Introduce un correo válido (nombre@dominio.ext)."); return false; }
      if (!validaTipoTarjeta()) { marcarError(tipoTarjeta, "Selecciona Visa, Mastercard o American Express."); return false; }
      if (!validaNumeroTarjeta()) { marcarError(numeroTarjeta, "Número de tarjeta: 13, 15, 16 o 19 dígitos."); return false; }
      if (!validaTitular()) { marcarError(titular, "El titular debe tener al menos 3 caracteres."); return false; }
      if (!validaCaducidad()) { marcarError(caducidad, "La fecha de caducidad no puede estar expirada."); return false; }
      if (!validaCVV()) { marcarError(cvv, "El CVV debe tener exactamente 3 dígitos."); return false; }
      return true;
    };
  
    // Eventos: solo sobre #form-compra (no toca nada más de la página)
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (validar()) {
        alert("Compra realizada");
        form.reset();
        limpiarErrores();
        caducidad.min = hoyYYYYMM();
        // Resetea el select a vacío
        tipoTarjeta.value = "";
      } else {
        alert("Hay errores en el formulario. Revisa los campos marcados.");
        const primero = form.querySelector(".campo-invalido");
        if (primero) primero.focus();
      }
    });
  
    form.addEventListener("reset", () => {
      setTimeout(() => {
        limpiarErrores();
        caducidad.min = hoyYYYYMM();
        tipoTarjeta.value = "";
      }, 0);
    });
  })();
  