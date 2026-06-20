function initMoviePlayer(source) {
    var video = document.getElementById('movie-player');
    var overlay = document.getElementById('player-overlay');
    var attached = false;
    var hlsInstance = null;

    if (!video || !source) {
        return;
    }

    function attachSource() {
        if (attached) {
            return Promise.resolve();
        }

        attached = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            return Promise.resolve();
        }

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
            return Promise.resolve();
        }

        video.src = source;
        return Promise.resolve();
    }

    function beginPlay() {
        attachSource().then(function () {
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {
                    if (overlay) {
                        overlay.classList.remove('is-hidden');
                    }
                });
            }
        });
    }

    if (overlay) {
        overlay.addEventListener('click', beginPlay);
    }

    var sideButton = document.querySelector('.side-play-button');
    if (sideButton) {
        sideButton.addEventListener('click', beginPlay);
    }

    video.addEventListener('click', function () {
        if (video.paused) {
            beginPlay();
        }
    });

    video.addEventListener('play', function () {
        if (overlay) {
            overlay.classList.add('is-hidden');
        }
    });

    video.addEventListener('pause', function () {
        if (overlay && video.currentTime === 0) {
            overlay.classList.remove('is-hidden');
        }
    });

    window.addEventListener('pagehide', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
            hlsInstance = null;
        }
    });
}
