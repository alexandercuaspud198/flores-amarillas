(() => {
  const stage = document.querySelector('.bouquet-stage');
  const fitBouquet = () => {
    const viewportUnit = Math.min(window.innerWidth, window.innerHeight) / 100;
    const scale = Math.min(stage.clientWidth / (120 * viewportUnit), stage.clientHeight / (140 * viewportUnit));
    stage.style.setProperty('--bouquet-scale', scale);
  };

  if (stage) {
    fitBouquet();
    new ResizeObserver(fitBouquet).observe(stage);
    window.addEventListener('resize', fitBouquet);
  }
  // Let the bouquet bloom without waiting for fonts or media downloads.
  requestAnimationFrame(() => document.body.classList.remove('container'));
})();
