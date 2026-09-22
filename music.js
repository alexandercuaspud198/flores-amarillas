(() => {
  const frame = document.getElementById("music-player");
  const status = document.getElementById("music-status");
  const play = document.getElementById("music-play");

  // A file:// page cannot send the HTTP referrer required by YouTube.
  if (!["http:", "https:"].includes(window.location.protocol)) {
    frame.hidden = true;
    status.textContent = "Para escuchar la canción, abre iniciar.cmd en la carpeta del proyecto. Luego usa la página que se abrirá en el navegador.";
    return;
  }

  const source = new URL(frame.dataset.src);
  source.searchParams.set("origin", window.location.origin);
  source.searchParams.set("enablejsapi", "1");
  frame.src = source.href;

  let player;
  const loadingTimeout = setTimeout(() => {
    status.textContent = "YouTube está tardando en cargar. Revisa tu conexión o usa el enlace para abrir la canción.";
  }, 15000);

  window.onYouTubeIframeAPIReady = () => {
    player = new YT.Player(frame.id, {
      events: {
        onReady: () => {
          clearTimeout(loadingTimeout);
          status.textContent = "Pulsa reproducir si la música no comienza sola.";
          play.hidden = false;
        },
        onAutoplayBlocked: () => {
          clearTimeout(loadingTimeout);
          status.textContent = "Pulsa reproducir para escuchar nuestra canción.";
          play.hidden = false;
        },
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.PLAYING) {
            clearTimeout(loadingTimeout);
            status.textContent = "Sonando para ti 💛";
            play.hidden = true;
          } else if (event.data === YT.PlayerState.PAUSED) {
            status.textContent = "La canción está en pausa.";
            play.hidden = false;
          }
        },
        onError: (event) => {
          clearTimeout(loadingTimeout);
          play.hidden = true;
          status.textContent = event.data === 153
            ? "YouTube no pudo identificar esta página. Prueba abrir este mismo enlace en otro navegador o usa el enlace de abajo."
            : "YouTube no pudo reproducir la canción aquí. Puedes escucharla con el enlace de abajo.";
        },
      },
    });
  };

  play.addEventListener("click", () => {
    if (player && typeof player.playVideo === "function") {
      player.unMute();
      player.playVideo();
    }
  });

  const api = document.createElement("script");
  api.src = "https://www.youtube.com/iframe_api";
  api.onerror = () => {
    clearTimeout(loadingTimeout);
    status.textContent = "No se pudo conectar con YouTube. Revisa tu conexión o abre la canción con el enlace.";
  };
  document.head.appendChild(api);
})();
