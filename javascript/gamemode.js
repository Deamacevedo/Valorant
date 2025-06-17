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