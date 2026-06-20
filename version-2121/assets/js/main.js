(function () {
  var header = document.querySelector('[data-site-header]');
  var menuToggle = document.querySelector('[data-menu-toggle]');

  function syncHeader() {
    if (!header) {
      return;
    }
    if (window.scrollY > 28) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  if (menuToggle && header) {
    menuToggle.addEventListener('click', function () {
      header.classList.toggle('is-open');
    });
  }

  var backTop = document.querySelector('[data-back-top]');
  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  document.querySelectorAll('[data-hero]').forEach(function (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function start() {
      if (slides.length < 2) {
        return;
      }
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        window.clearInterval(timer);
        show(index);
        start();
      });
    });

    start();
  });

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function applyFilter(scope, query) {
    var cards = scope.querySelectorAll('[data-title]');
    var text = normalize(query);
    cards.forEach(function (card) {
      var haystack = normalize([
        card.dataset.title,
        card.dataset.year,
        card.dataset.region,
        card.dataset.type,
        card.dataset.genre,
        card.dataset.category,
        card.dataset.tags
      ].join(' '));
      card.classList.toggle('is-hidden', text && haystack.indexOf(text) === -1);
    });
  }

  function getFilterScope(element) {
    var scope = element.closest('section') || document;
    if (!scope.querySelector('[data-title]')) {
      scope = element.closest('main') || document;
    }
    return scope;
  }

  document.querySelectorAll('[data-filter-input]').forEach(function (input) {
    var section = getFilterScope(input);
    input.addEventListener('input', function () {
      applyFilter(section, input.value);
    });
  });

  document.querySelectorAll('[data-filter-chips]').forEach(function (chips) {
    var section = getFilterScope(chips);
    chips.querySelectorAll('[data-filter-value]').forEach(function (button) {
      button.addEventListener('click', function () {
        chips.querySelectorAll('[data-filter-value]').forEach(function (item) {
          item.classList.remove('is-active');
        });
        button.classList.add('is-active');
        applyFilter(section, button.dataset.filterValue || '');
      });
    });
  });
})();
