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

let allWeapons = [];
let currentWeapon = null;
let allSkins = [];
let currentWeaponsDisplay = [];
let currentSkinsDisplay = [];

async function loadWeapons() {
    try {
        const res = await fetch("https://valorant-api.com/v1/weapons");
        const data = await res.json();

        allWeapons = data.data;
        currentWeaponsDisplay = [...allWeapons];
        setupWeaponFilters();
        renderWeapons(allWeapons);
        setupWeaponSearch();
    } catch (error) {
        console.error("Error loading weapons:", error);
    }
}

async function loadSkins() {
    try {
        const res = await fetch("https://valorant-api.com/v1/weapons/skins");
        const data = await res.json();
        allSkins = data.data;
    } catch (error) {
        console.error("Error loading skins:", error);
    }
}

function setupWeaponFilters() {
    const filters = document.getElementById("weapon-filters");
    // Filtrar categorías válidas (excluir Misc y categorías vacías)
    const types = [...new Set(allWeapons
        .map(w => w.shopData?.category)
        .filter(cat => cat && cat !== "Misc" && cat !== "EEquippableCategory::Misc")
    )];

    // Botón "Todas"
    const allBtn = document.createElement("button");
    allBtn.textContent = "ALL";
    allBtn.className = "bg-gray-700 px-4 py-2 rounded-full text-white hover:bg-gray-600 transition-all duration-300 transform hover:scale-105";
    allBtn.addEventListener("click", () => {
        currentWeaponsDisplay = [...allWeapons];
        renderWeapons(currentWeaponsDisplay);
    });
    filters.appendChild(allBtn);

    types.forEach(type => {
        const btn = document.createElement("button");
        btn.textContent = type.replace("EEquippableCategory::", "").toUpperCase();
        btn.className = "bg-red-600 px-4 py-2 rounded-full text-white hover:bg-red-500 transition-all duration-300 transform hover:scale-105";
        btn.addEventListener("click", () => {
            const filtered = allWeapons.filter(w => w.shopData?.category === type);
            currentWeaponsDisplay = filtered;
            renderWeapons(filtered);
        });
        filters.appendChild(btn);
    });
}

function showSkinModal(skin) {
    const modal = document.getElementById("skin-modal");
    const modalImage = document.getElementById("modal-skin-image");
    const modalSkinName = document.getElementById("modal-skin-name");
    const modalWeaponName = document.getElementById("modal-weapon-name");
    const modalSkinRarity = document.getElementById("modal-skin-rarity");
    const modalSkinTheme = document.getElementById("modal-skin-theme");

    // Llenar información del modal
    modalImage.src = skin.displayIcon;
    modalImage.alt = skin.displayName;
    modalSkinName.textContent = skin.displayName;
    modalWeaponName.textContent = currentWeapon.displayName;

    const rarity = skin.contentTierUuid ? "Premium" : "Standard";
    modalSkinRarity.textContent = rarity;
    modalSkinRarity.className = skin.contentTierUuid ? "text-yellow-400" : "text-gray-400";

    const theme = skin.themeUuid ? "Themed Collection" : "Standard Collection";
    modalSkinTheme.textContent = theme;

    // Mostrar modal
    modal.classList.remove("hidden");
    modal.classList.add("flex");

    // Prevenir scroll del body
    document.body.style.overflow = "hidden";
}

function hideSkinModal() {
    const modal = document.getElementById("skin-modal");
    modal.classList.add("hidden");
    modal.classList.remove("flex");

    // Restaurar scroll del body
    document.body.style.overflow = "auto";
}

function setupWeaponSearch() {
    const search = document.getElementById("search-weapon");
    const sortSelect = document.getElementById("sort-weapons");

    search.addEventListener("input", e => {
        const value = e.target.value.toLowerCase();
        const filtered = allWeapons.filter(w =>
            w.displayName.toLowerCase().includes(value)
        );
        currentWeaponsDisplay = filtered;
        applySortingWeapons();
    });

    sortSelect.addEventListener("change", e => {
        applySortingWeapons();
    });
}

function applySortingWeapons() {
    const sortValue = document.getElementById("sort-weapons").value;
    let sorted = [...currentWeaponsDisplay];

    switch (sortValue) {
        case "alphabetical":
            sorted.sort((a, b) => a.displayName.localeCompare(b.displayName));
            break;
        case "alphabetical-desc":
            sorted.sort((a, b) => b.displayName.localeCompare(a.displayName));
            break;
        case "category":
            sorted.sort((a, b) => {
                const catA = a.shopData?.category?.replace("EEquippableCategory::", "") || "";
                const catB = b.shopData?.category?.replace("EEquippableCategory::", "") || "";
                return catA.localeCompare(catB);
            });
            break;
    }

    renderWeapons(sorted);
}

function setupSkinSearch() {
    const search = document.getElementById("search-skin");
    const sortSelect = document.getElementById("sort-skins");

    search.addEventListener("input", e => {
        const value = e.target.value.toLowerCase();
        const filtered = currentWeapon.skins.filter(skin =>
            skin.displayName.toLowerCase().includes(value) && skin.displayIcon
        );
        currentSkinsDisplay = filtered;
        applySortingSkins();
    });

    sortSelect.addEventListener("change", e => {
        applySortingSkins();
    });
}

function applySortingSkins() {
    const sortValue = document.getElementById("sort-skins").value;
    let sorted = [...currentSkinsDisplay];

    switch (sortValue) {
        case "alphabetical":
            sorted.sort((a, b) => a.displayName.localeCompare(b.displayName));
            break;
        case "alphabetical-desc":
            sorted.sort((a, b) => b.displayName.localeCompare(a.displayName));
            break;
        case "rarity":
            sorted.sort((a, b) => {
                // Premium skins first (with contentTierUuid), then standard
                const rarityA = a.contentTierUuid ? 1 : 0;
                const rarityB = b.contentTierUuid ? 1 : 0;
                return rarityB - rarityA;
            });
            break;
    }

    renderSkins(sorted);
}

function renderWeapons(weapons) {
    const grid = document.getElementById("weapon-grid");
    grid.innerHTML = "";

    weapons.forEach(weapon => {
        const card = document.createElement("div");
        card.className = "weapon-card rounded-xl p-6 hover:scale-105 hover:glow-effect transition-all duration-300 transform cursor-pointer";
        card.innerHTML = `
                    <img src="${weapon.displayIcon}" alt="${weapon.displayName}" class="h-32 mx-auto object-contain mb-4">
                    <p class="font-bold text-lg text-white">${weapon.displayName}</p>
                    <p class="text-sm text-gray-300 mt-2">${weapon.shopData?.category?.replace("EEquippableCategory::", "") || "Standard"}</p>
                `;

        card.addEventListener("click", () => showWeaponSkins(weapon));
        grid.appendChild(card);
    });
}

async function showWeaponSkins(weapon) {
    currentWeapon = weapon;

    // Cambiar vista
    document.getElementById("weapons-view").classList.add("hidden");
    document.getElementById("skins-view").classList.remove("hidden");

    // Actualizar título
    document.getElementById("weapon-title").textContent = `${weapon.displayName.toUpperCase()} SKINS`;

    // Filtrar skins válidas y configurar display actual
    const validSkins = weapon.skins.filter(skin => skin.displayIcon);
    currentSkinsDisplay = validSkins;

    // Configurar búsqueda de skins
    setupSkinSearch();

    // Resetear select de ordenamiento
    document.getElementById("sort-skins").value = "default";

    // Mostrar skins del arma
    renderSkins(validSkins);

    // Configurar botón de regreso
    document.getElementById("back-btn").addEventListener("click", showWeaponsView);
}

function showWeaponsView() {
    document.getElementById("skins-view").classList.add("hidden");
    document.getElementById("weapons-view").classList.remove("hidden");

    // Resetear select de ordenamiento
    document.getElementById("sort-weapons").value = "default";

    currentWeapon = null;
}

function renderSkins(skins) {
    const grid = document.getElementById("skin-grid");
    grid.innerHTML = "";

    // Filtrar skins que tengan icono
    const validSkins = skins.filter(skin => skin.displayIcon);

    if (validSkins.length === 0) {
        grid.innerHTML = `
                    <div class="col-span-full text-center text-gray-400">
                        <p class="text-xl">No skins available for this weapon</p>
                    </div>
                `;
        return;
    }

    validSkins.forEach(skin => {
        const card = document.createElement("div");
        card.className = "skin-card rounded-xl p-6 hover:scale-105 hover:skin-glow transition-all duration-300 transform cursor-pointer";

        const rarity = skin.contentTierUuid ? "Premium" : "Standard";
        const rarityColor = skin.contentTierUuid ? "text-yellow-400" : "text-gray-400";

        card.innerHTML = `
                    <img src="${skin.displayIcon}" alt="${skin.displayName}" class="h-32 mx-auto object-contain mb-4">
                    <p class="font-bold text-lg text-white">${skin.displayName}</p>
                    <p class="text-sm ${rarityColor} mt-2">${rarity}</p>
                `;

        // Agregar evento de clic para mostrar modal
        card.addEventListener("click", () => showSkinModal(skin));

        grid.appendChild(card);
    });
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
    loadWeapons();
    loadSkins();

    // Event listeners para el modal
    document.getElementById("close-modal").addEventListener("click", hideSkinModal);
    document.getElementById("modal-close-btn").addEventListener("click", hideSkinModal);

    // Cerrar modal al hacer clic fuera de él
    document.getElementById("skin-modal").addEventListener("click", (e) => {
        if (e.target.id === "skin-modal") {
            hideSkinModal();
        }
    });

    // Cerrar modal con tecla ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            hideSkinModal();
        }
    });
});