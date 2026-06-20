(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector('.mobile-toggle');
    var panel = document.querySelector('.mobile-panel');

    if (toggle && panel) {
      toggle.addEventListener('click', function () {
        var open = panel.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    document.querySelectorAll('.search-redirect').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        var input = form.querySelector('input[name="q"]');
        if (!input || !input.value.trim()) {
          event.preventDefault();
          return;
        }
      });
    });

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    if (slides.length) {
      dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
          showSlide(index);
        });
      });
      showSlide(0);
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    var filter = document.querySelector('[data-filter-input]');
    if (filter) {
      var cards = Array.prototype.slice.call(document.querySelectorAll('[data-title]'));
      filter.addEventListener('input', function () {
        var query = filter.value.trim().toLowerCase();
        cards.forEach(function (card) {
          var value = [
            card.getAttribute('data-title') || '',
            card.getAttribute('data-region') || '',
            card.getAttribute('data-genre') || '',
            card.getAttribute('data-year') || ''
          ].join(' ').toLowerCase();
          card.style.display = value.indexOf(query) === -1 ? 'none' : '';
        });
      });
    }

    document.querySelectorAll('img').forEach(function (image) {
      image.addEventListener('error', function () {
        image.classList.add('is-hidden');
      });
    });
  });
})();
