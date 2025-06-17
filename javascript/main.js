// Javascript del index
// Control del menú mobile
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
document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
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

// Animaciones
// Observador de intersección para animaciones de scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observar todos los elementos con animaciones
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in, .slide-in-bottom, .title-reveal');
    animatedElements.forEach(el => observer.observe(el));
});

// Registrar ScrollTrigger
gsap.registerPlugin(ScrollTrigger);
// Animaciones GSAP para imágenes
document.addEventListener('DOMContentLoaded', () => {

    // Animación para imágenes que aparecen desde arriba (antes slide-right)
    gsap.utils.toArray('.image-slide-right').forEach((img, index) => {
        gsap.fromTo(img, {
            y: -100,
            scale: 0.95,
            opacity: 0
        }, {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: img.closest('section'),
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // Animación para imágenes que aparecen desde arriba (antes slide-left)
    gsap.utils.toArray('.image-slide-left').forEach((img, index) => {
        gsap.fromTo(img, {
            y: -100,
            scale: 0.95,
            opacity: 0
        }, {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: img.closest('section'),
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // Animación para imágenes con efecto de revelación desde arriba
    gsap.utils.toArray('.image-reveal').forEach((img, index) => {
        gsap.fromTo(img, {
            y: -80,
            scale: 1.1,
            opacity: 0
        }, {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
                trigger: img.closest('section'),
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // Animación para imágenes móviles desde arriba
    gsap.utils.toArray('.image-fade-scale').forEach((img, index) => {
        gsap.fromTo(img, {
            y: -60,
            scale: 0.8,
            opacity: 0
        }, {
            y: 0,
            scale: 1,
            opacity: 0.3, // Mantiene la opacidad baja para móvil
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: img.closest('section'),
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // Animación para overlays (efecto de cortina desde arriba)
    gsap.utils.toArray('.image-overlay').forEach((overlay, index) => {
        gsap.fromTo(overlay, {
            scaleY: 0,
            transformOrigin: "top center"
        }, {
            scaleY: 1,
            duration: 0.8,
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: overlay.closest('section'),
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            },
            onComplete: () => {
                // Ocultar overlay después de la animación
                gsap.to(overlay, {
                    scaleY: 0,
                    transformOrigin: "bottom center",
                    duration: 0.8,
                    delay: 0.3,
                    ease: "power2.inOut"
                });
            }
        });
    });
});

