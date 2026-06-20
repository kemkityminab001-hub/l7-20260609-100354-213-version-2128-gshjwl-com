(() => {
  const playerCard = document.querySelector('[data-player]');

  if (!playerCard) {
    return;
  }

  const video = playerCard.querySelector('video');
  const playButton = playerCard.querySelector('[data-play]');
  let hls = null;

  const loadSource = () => {
    if (!video || video.dataset.loaded === 'true') {
      return;
    }

    const source = video.dataset.src;

    if (!source) {
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.ERROR, (_event, data) => {
        if (data && data.fatal && hls) {
          hls.destroy();
          hls = null;
          video.src = source;
        }
      });
    } else {
      video.src = source;
    }

    video.dataset.loaded = 'true';
  };

  const startPlay = async () => {
    loadSource();

    if (playButton) {
      playButton.classList.add('is-hidden');
    }

    try {
      await video.play();
    } catch (_error) {
      if (playButton) {
        playButton.classList.remove('is-hidden');
      }
    }
  };

  if (playButton) {
    playButton.addEventListener('click', startPlay);
  }

  playerCard.addEventListener('click', (event) => {
    if (event.target === video) {
      return;
    }

    if (video.dataset.loaded !== 'true') {
      startPlay();
    }
  });

  video.addEventListener('play', () => {
    if (playButton) {
      playButton.classList.add('is-hidden');
    }
  });

  video.addEventListener('pause', () => {
    if (playButton && video.currentTime === 0) {
      playButton.classList.remove('is-hidden');
    }
  });
})();
