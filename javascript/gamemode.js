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
    if (window.scrollY > 50) {
        header.classList.add('scrolled-header');
    } else {
        header.classList.remove('scrolled-header');
    }
});
async function loadGamemodes() {
    const res = await fetch('https://valorant-api.com/v1/gamemodes');
    const data = await res.json();

    const container = document.getElementById('gamemode-icons');
    const modal = document.getElementById('gamemode-modal');
    const title = document.getElementById('modal-title');
    const description = document.getElementById('modal-description');
    const duration = document.getElementById('modal-duration');
    const closeModal = document.getElementById('close-modal');

    data.data.forEach(mode => {
        if (!mode.displayIcon || mode.displayName === "Bot Match") return;

        // Contenedor del icono + nombre
        const item = document.createElement('div');
        item.className = "flex flex-col items-center";

        const img = document.createElement('img');
        img.src = mode.displayIcon;
        img.alt = mode.displayName;
        img.className = " w-40 p-2 rounded-xl shadow-2xl cursor-pointer hover:scale-110 transition-transform duration-200";

        // Nombre del modo
        const name = document.createElement('p');
        name.textContent = mode.displayName;
        name.className = "mt-2 text-lg font-semibold text-white";

        // Evento para mostrar modal
        img.addEventListener('click', () => {
            title.textContent = mode.displayName;
            duration.textContent = mode.duration ? `Duration: ${mode.duration}` : '';
            description.textContent = mode.description || 'No description available.';
            modal.classList.remove("hidden");
            modal.classList.add("flex");
        });
        // Añadir imagen + nombre al contenedor
        item.appendChild(img);
        item.appendChild(name);

        // Añadir a la grilla principal
        container.appendChild(item);
    });

    closeModal.addEventListener('click', () => {
        modal.classList.add("hidden");
        modal.classList.remove("flex"); // 🔄 Y quitamos 'flex' al ocultar
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add("hidden");
            modal.classList.remove("flex");
        }
    });
}


loadGamemodes();