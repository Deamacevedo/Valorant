// 1. Verificar si la API está disponible
        async function checkApi() {
            try {
                const test = await fetch('https://valorant-api.com/v1/maps');
                return test.ok;
            } catch {
                return false;
            }
        }

        // 2. Función principal mejorada
        async function loadPlayableMaps() {
            document.getElementById('loading').classList.remove('hidden');
            document.getElementById('error').classList.add('hidden');

            // Verificar conexión primero
            if (!(await checkApi())) {
                showError("No se pudo conectar a la API de Valorant");
                return;
            }

            try {
                const response = await fetch('https://valorant-api.com/v1/maps?language=es-MX');

                if (!response.ok) {
                    showError(`Error HTTP: ${response.status}`);
                    return;
                }

                const { data } = await response.json();
                // Filtrado más flexible
                const playableMaps = data.filter(map =>
                    map.displayName &&
                    map.splash &&
                    map.displayIcon &&
                    !map.displayName.toLowerCase().includes('range') &&
                    !map.displayName.toLowerCase().includes('practice')
                );

                if (playableMaps.length === 0) {
                    showError("No se encontraron mapas jugables");
                    return;
                }

                renderMaps(playableMaps);

            } catch (error) {
                showError(error.message);
            }
        }

        function showError(message) {
            document.getElementById('loading').classList.add('hidden');
            const errorDiv = document.getElementById('error');
            errorDiv.classList.remove('hidden');
            errorDiv.innerHTML = `Error: ${message}. <button onclick="loadPlayableMaps()" class="ml-2 text-blue-400 underline">Reintentar</button>`;
        }

        function renderMaps(maps) {
            const container = document.getElementById('maps-container');
            container.innerHTML = '';

            maps.forEach(map => {
                const card = document.createElement('div');
                card.className = 'map-card h-full bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.03] flex flex-col';

                card.innerHTML = `
                    <div class="map-inner h-full">
                        <div class="map-front flex flex-col">
                            <img src="${map.splash}" alt="${map.displayName}" 
                                 class="w-full h-48 object-cover rounded-t-lg">
                            <p class="bg-gray-800 text-white text-5xl font-thin text-center py-2 font-bold rounded-b-lg flex-1 flex items-center justify-center">
                                ${map.displayName}
                            </p>
                        </div>
                        <div class="map-back flex items-center justify-center p-2">
                            <img src="${map.displayIcon}" alt="Mapa táctico" 
                                 class="max-w-full max-h-40 object-contain">
                        </div>
                    </div>
                `;

                // Evento click para voltear la card
                card.addEventListener('click', function () {
                    this.classList.toggle('flipped');
                });

                container.appendChild(card);
            });

            document.getElementById('loading').classList.add('hidden');
        }

        // Iniciar carga cuando el DOM esté listo
        document.addEventListener('DOMContentLoaded', loadPlayableMaps);