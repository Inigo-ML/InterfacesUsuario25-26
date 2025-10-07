// js/compra.js
document.addEventListener("DOMContentLoaded", () => {
    // Lee ?pack=... (sudeste | sri-lanka | nepal); por defecto 'sudeste'
    const params = new URLSearchParams(location.search);
    const slug = (params.get("pack") || "sudeste").toLowerCase();
  
    const vistas = Array.from(document.querySelectorAll("#compra-packs .vista-pack"));
    if (!vistas.length) return;
  
    // Oculta todas
    vistas.forEach(v => {
      v.classList.remove("activa");
      v.setAttribute("aria-hidden", "true");
    });
  
    // Muestra la que coincide con data-pack, o la primera si no existe
    const objetivo = vistas.find(v => v.dataset.pack === slug) || vistas[0];
    objetivo.classList.add("activa");
    objetivo.setAttribute("aria-hidden", "false");
  });
  