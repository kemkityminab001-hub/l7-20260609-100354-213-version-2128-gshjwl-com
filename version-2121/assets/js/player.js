(function () {
  function loadVideo(frame) {
    var video = frame.querySelector('video');
    var cover = frame.querySelector('.player-cover');
    var url = frame.getAttribute('data-play');

    if (!video || !url) {
      return;
    }

    function begin() {
      frame.classList.add('is-playing');
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    }

    if (!video.dataset.ready) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.addEventListener('loadedmetadata', begin, { once: true });
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, begin);
      } else {
        video.src = url;
        begin();
      }
      video.dataset.ready = '1';
    } else {
      begin();
    }

    if (cover) {
      cover.setAttribute('aria-hidden', 'true');
    }
  }

  document.querySelectorAll('[data-player]').forEach(function (frame) {
    var cover = frame.querySelector('.player-cover');
    var video = frame.querySelector('video');

    if (cover) {
      cover.addEventListener('click', function () {
        loadVideo(frame);
      });
    }

    if (video) {
      video.addEventListener('click', function () {
        if (!video.dataset.ready || video.paused) {
          loadVideo(frame);
        }
      });
    }
  });
})();
