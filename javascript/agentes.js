const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const body = document.body;
let scrollPosition = 0;

menuToggle.addEventListener('click', () => {
    if (mobileMenu.classList.contains('active')) {
        // Cerrar menú - restaurar posición
        mobileMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        body.classList.remove('no-scroll');
        body.style.removeProperty('overflow');
        body.style.removeProperty('position');
        body.style.removeProperty('top');
        body.style.removeProperty('width');
        window.scrollTo(0, scrollPosition);
    } else {
        // Abrir menú - guardar posición actual
        scrollPosition = window.scrollY;
        mobileMenu.classList.add('active');
        menuToggle.classList.add('active');
        body.classList.add('no-scroll');
        body.style.overflow = 'hidden';
        body.style.position = 'fixed';
        body.style.top = `-${scrollPosition}px`;
        body.style.width = '100%';
    }
});

// Cerrar menú al hacer click en enlaces
// JavaScript corregido para manejar los enlaces
document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
        // Solo prevenir el comportamiento por defecto si es un enlace interno (#)
        if (link.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            
            // Restaurar body primero
            body.classList.remove('no-scroll');
            body.style.removeProperty('overflow');
            body.style.removeProperty('position');
            body.style.removeProperty('top');
            body.style.removeProperty('width');

            // Cerrar menú
            mobileMenu.classList.remove('active');
            menuToggle.classList.remove('active');

            // Scroll suave al destino después de restaurar el body
            setTimeout(() => {
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    history.pushState(null, null, targetId);
                }
            }, 20);
        }
        // Si no es un fragmento (#), dejar que el enlace funcione normalmente
    });
});
// Efecto scroll del header
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    // Solo activar en desktop (ejemplo: ancho mínimo 768px)
    if (window.innerWidth >= 768) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled-header');
        } else {
            header.classList.remove('scrolled-header');
        }
    } else {
        // En móviles, asegurarse de quitar la clase si existe
        header.classList.remove('scrolled-header');
    }
});

const API_URL = "https://valorant-api.com/v1/agents?isPlayableCharacter=true";

        async function cargarAgentes() {
            const res = await fetch(API_URL);
            const data = await res.json();
            const agentes = data.data;

            const grid = document.getElementById("agentes-grid");

            // Crear contenedor para mostrar detalles
            const detalleContainer = document.createElement("div");
            detalleContainer.id = "agente-detalle";
            detalleContainer.className = "fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 hidden";
            detalleContainer.innerHTML = `
                <div class="bg-gray-800 rounded-lg p-8 flex flex-col md:flex-row items-center gap-8 max-w-3xl relative">
                    <button id="cerrar-detalle" class="absolute top-2 right-2 text-white text-2xl">&times;</button>
                    <img id="detalle-img" src="" alt="" class="w-64 h-96 object-contain rounded-lg shadow-lg">
                    <div class="text-white">
                        <h3 id="detalle-nombre" class="text-3xl font-bold mb-2"></h3>
                        <p id="detalle-rol" class="mb-2"></p>
                        <p id="detalle-descripcion" class="mb-4"></p>
                        <div id="detalle-habilidades"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(detalleContainer);

            // Cerrar detalle
            detalleContainer.querySelector("#cerrar-detalle").onclick = () => {
                detalleContainer.classList.add("hidden");
            };

            agentes.forEach(agent => {
                const card = document.createElement("div");
                card.className = "agent-card text-center w-auto h-[300px] mx-auto cursor-pointer flex flex-col items-center";

                // Fondo y retrato en stack
                card.innerHTML = `
                    <div class="relative w-48 h-64 flex items-center justify-center">
                        ${agent.background ? `<img src="${agent.background}" alt="background" class="absolute inset-0 w-full h-full object-cover rounded-lg opacity-80 z-0">` : ""}
                        <img src="${agent.fullPortraitV2}" alt="${agent.displayName}" class="relative z-10 w-full h-full object-cover mx-auto">
                    </div>
                    <p class="text-white mt-2 text-lg font-bold">${agent.displayName}</p>
                `;
                card.onclick = () => {
                    // Mostrar detalle
                    document.getElementById("detalle-img").src = agent.fullPortraitV2;
                    document.getElementById("detalle-img").alt = agent.displayName;
                    document.getElementById("detalle-nombre").textContent = agent.displayName;
                    document.getElementById("detalle-rol").textContent = agent.role ? `Rol: ${agent.role.displayName}` : "";
                    document.getElementById("detalle-descripcion").textContent = agent.description || "";
                    // Habilidades
                    // const habilidadesDiv = document.getElementById("detalle-habilidades");
                    // habilidadesDiv.innerHTML = "<h4 class='font-semibold mb-1'>Habilidades:</h4>";
                    // agent.abilities.forEach(hab => {
                    //     if (hab.displayName && hab.description) {
                    //         habilidadesDiv.innerHTML += `
                    //             <div class="mb-2">
                    //                 <span class="font-bold">${hab.displayName}:</span>
                    //                 <span>${hab.description}</span>
                    //             </div>
                    //         `;
                    //     }
                    // });
                    detalleContainer.classList.remove("hidden");
                };
                grid.appendChild(card);
            });
        }

        document.addEventListener("DOMContentLoaded", cargarAgentes);