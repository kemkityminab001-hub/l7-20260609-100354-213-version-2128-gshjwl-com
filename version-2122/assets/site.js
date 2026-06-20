(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var menuButton = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');
    if (menuButton && mobileNav) {
      menuButton.addEventListener('click', function () {
        mobileNav.classList.toggle('open');
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var prev = document.querySelector('.hero-prev');
    var next = document.querySelector('.hero-next');
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    function move(step) {
      showSlide(current + step);
    }

    function startTimer() {
      if (!slides.length) {
        return;
      }
      timer = window.setInterval(function () {
        move(1);
      }, 5200);
    }

    function resetTimer() {
      if (timer) {
        window.clearInterval(timer);
      }
      startTimer();
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
        resetTimer();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        move(-1);
        resetTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        move(1);
        resetTimer();
      });
    }

    showSlide(0);
    startTimer();

    var filterInput = document.querySelector('.local-filter');
    var filterMessage = document.querySelector('.filter-message');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));

    function applyFilter(value) {
      var keyword = String(value || '').trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (card) {
        var text = String(card.getAttribute('data-search') || card.textContent || '').toLowerCase();
        var matched = !keyword || text.indexOf(keyword) !== -1;
        card.classList.toggle('is-hidden', !matched);
        if (matched) {
          visible += 1;
        }
      });
      if (filterMessage) {
        filterMessage.textContent = keyword ? (visible ? '匹配内容已更新' : '暂无匹配影片') : '';
      }
    }

    if (filterInput) {
      var params = new URLSearchParams(window.location.search);
      var q = params.get('q') || '';
      if (q) {
        filterInput.value = q;
        applyFilter(q);
      }
      filterInput.addEventListener('input', function () {
        applyFilter(filterInput.value);
      });
    }
  });
})();

function initMoviePlayer(source) {
  var video = document.getElementById('movieVideo');
  var overlay = document.getElementById('playOverlay');
  var hlsInstance = null;

  if (!video || !overlay || !source) {
    return;
  }

  function attachSource() {
    if (video.getAttribute('data-ready') === '1') {
      return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
    } else {
      video.src = source;
    }
    video.setAttribute('data-ready', '1');
  }

  function playVideo() {
    attachSource();
    overlay.classList.add('hidden');
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        overlay.classList.remove('hidden');
      });
    }
  }

  overlay.addEventListener('click', playVideo);
  video.addEventListener('click', function () {
    if (video.paused) {
      playVideo();
    }
  });
  video.addEventListener('play', function () {
    overlay.classList.add('hidden');
  });
  video.addEventListener('pause', function () {
    if (!video.ended) {
      overlay.classList.remove('hidden');
    }
  });
  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
