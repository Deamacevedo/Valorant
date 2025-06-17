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

async function loadRanks() {
            const res = await fetch('https://valorant-api.com/v1/competitivetiers');
            const data = await res.json();

            // Selecciona el último episodio (el de mayor número)
            const episodes = data.data;
            const lastEpisode = episodes[episodes.length - 1];

            const container = document.getElementById('rank-icons');
            const rankInfo = document.getElementById('rank-info');

            lastEpisode.tiers.forEach(tier => {
                if (!tier.largeIcon || tier.tierName === "Unrated") return;

                const img = document.createElement('img');
                img.src = tier.largeIcon;
                img.alt = tier.tierName;
                img.className = "w-20 md:w-24 cursor-pointer hover:scale-110 transition-transform duration-200";

                // Evento de hover o click
                img.addEventListener('click', () => {
                    rankInfo.innerHTML = `
          <h3 class="text-5xl font-bold text-white mb-2">${tier.tierName}</h3>
          <p class="text-base">${tier.divisionName || "No description provided."}</p>
        `;
                });

                container.appendChild(img);
            });
        }

        loadRanks();