const m3uURL = '1.m3u8';

// Función para cargar los canales
function loadChannels() {
    fetch(m3uURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('La solicitud falló: ' + response.status);
            }
            return response.text();
        })
        .then(data => {
            const channelsList = document.getElementById("channels-list");
            channelsList.innerHTML = ""; // Limpiar lista antes de cargar nuevos canales

            // Obtener líneas de la lista m3u8
            const lines = data.split('\n');

            // Filtrar y ordenar los canales de ESPAÑA alfabéticamente
            const spanishChannels = lines.filter(line => line.startsWith("#EXTINF:-1,ESPAÑA"))
                                         .map(line => line.split(',').slice(1).join(',').trim())
                                         .sort();

            // Mostrar los canales ordenados
            spanishChannels.forEach(channelName => {
                const channelItem = document.createElement("div");
                channelItem.className = "list-group-item d-flex justify-content-between align-items-center";
                
                // Título del canal
                const title = document.createElement("span");
                title.textContent = channelName;
                
                // Icono de descarga
                const downloadIcon = document.createElement("i");
                downloadIcon.className = "fas fa-download";

                // Enlace para descargar con extensión .ts
                const downloadLink = document.createElement("a");
                const channelLine = lines.find(line => line.includes(channelName));
                const channelURL = lines[lines.indexOf(channelLine) + 1];
                const tsChannelURL = channelURL.replace('.m3u8', '.ts');
                downloadLink.href = tsChannelURL;
                downloadLink.appendChild(downloadIcon);

                // Evento de clic para la descarga
                downloadLink.addEventListener("click", (event) => {
                    event.stopPropagation(); // Evitar que se reproduzca el canal al hacer clic en el enlace
                });

                // Agregar elementos al canal
                channelItem.appendChild(title);
                channelItem.appendChild(downloadLink);

                // Evento de clic para reproducir el canal
                channelItem.addEventListener("click", () => {
                    playChannel(channelName, lines);
                });

                channelsList.appendChild(channelItem);
            });
        })
        .catch(error => {
            console.error("Error al cargar la lista m3u8:", error);
        });
}

// Reproducir el canal seleccionado
function playChannel(channelName, lines) {
    const channelLine = lines.find(line => line.includes(channelName));
    const channelURL = lines[lines.indexOf(channelLine) + 1];

    const player = new Plyr('#player', {
        controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen']
    });

    const hls = new Hls();
    hls.loadSource(channelURL);
    hls.attachMedia(player.media);

    player.play();
}

// Cargar los canales al cargar la página
window.onload = loadChannels;