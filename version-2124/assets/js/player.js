function initMoviePlayer(streamUrl) {
  var video = document.getElementById('moviePlayer');
  var overlay = document.getElementById('playOverlay');
  var hlsInstance = null;
  var prepared = false;

  if (!video || !streamUrl) {
    return;
  }

  function prepare() {
    if (prepared) {
      return;
    }

    prepared = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90
      });
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
    } else {
      video.src = streamUrl;
    }
  }

  function start() {
    prepare();

    if (overlay) {
      overlay.classList.add('is-hidden');
    }

    var result = video.play();

    if (result && typeof result.catch === 'function') {
      result.catch(function () {
        if (overlay) {
          overlay.classList.remove('is-hidden');
        }
      });
    }
  }

  if (overlay) {
    overlay.addEventListener('click', start);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      start();
    }
  });

  video.addEventListener('play', function () {
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
}
