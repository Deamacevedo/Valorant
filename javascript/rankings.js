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