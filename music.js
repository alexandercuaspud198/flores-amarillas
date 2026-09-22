(() => {
  const audio = document.getElementById('background-music');
  const toggle = document.getElementById('music-toggle');
  const label = document.getElementById('music-label');
  const status = document.getElementById('music-status');
  const link = document.getElementById('song-link');

  // The direct audio file is set on the audio element when it is provided.
  if (!audio.getAttribute('src')) return;

  link.hidden = true;
  toggle.hidden = false;
  audio.volume = 0.45;

  const startMusic = async () => {
    toggle.disabled = true;
    label.textContent = 'Cargando canción…';
    try {
      await audio.play();
    } catch (error) {
      if (error.name === 'NotAllowedError') {
        status.textContent = 'Toca el botón para escuchar nuestra canción.';
      } else {
        status.textContent = 'No se pudo cargar la canción. Puedes intentarlo otra vez.';
        link.hidden = false;
      }
      label.textContent = 'Reproducir canción';
    } finally {
      toggle.disabled = false;
    }
  };

  audio.addEventListener('playing', () => {
    label.textContent = 'Pausar canción';
    toggle.setAttribute('aria-label', 'Pausar nuestra canción');
    status.textContent = '';
  });
  audio.addEventListener('pause', () => {
    label.textContent = 'Reproducir canción';
    toggle.setAttribute('aria-label', 'Reproducir nuestra canción');
  });
  audio.addEventListener('error', () => {
    toggle.disabled = false;
    label.textContent = 'Reintentar canción';
    status.textContent = 'No se pudo cargar la canción. Puedes intentarlo otra vez.';
    link.hidden = false;
  });
  toggle.addEventListener('click', () => {
    if (audio.paused) startMusic();
    else audio.pause();
  });
  startMusic();
})();
