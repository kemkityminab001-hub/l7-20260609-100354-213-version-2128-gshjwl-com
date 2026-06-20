function initMoviePlayer(source) {
  var player = document.querySelector('.player-box');
  if (!player) {
    return;
  }

  var video = player.querySelector('video');
  var overlay = player.querySelector('.player-overlay');
  var button = player.querySelector('.play-button');
  var ready = false;
  var hlsPlayer = null;

  function attach() {
    if (ready || !video || !source) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      ready = true;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsPlayer = new window.Hls({ enableWorker: true });
      hlsPlayer.loadSource(source);
      hlsPlayer.attachMedia(video);
      ready = true;
      return;
    }

    video.src = source;
    ready = true;
  }

  function start() {
    attach();
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
    if (video) {
      video.controls = true;
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    }
  }

  if (button) {
    button.addEventListener('click', start);
  }
  if (overlay) {
    overlay.addEventListener('click', start);
  }
  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });
    video.addEventListener('error', function () {
      if (hlsPlayer) {
        hlsPlayer.destroy();
        hlsPlayer = null;
      }
      ready = false;
    });
  }
}
