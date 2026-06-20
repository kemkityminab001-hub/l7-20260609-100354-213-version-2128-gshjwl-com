(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobileMenu = document.querySelector('.mobile-menu');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      var opened = mobileMenu.classList.toggle('is-open');
      document.body.classList.toggle('menu-open', opened);
      menuButton.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });
  }

  var slider = document.getElementById('heroSlider');

  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
    var previous = slider.querySelector('.hero-prev');
    var next = slider.querySelector('.hero-next');
    var index = 0;
    var timer = null;

    function showSlide(target) {
      index = (target + slides.length) % slides.length;
      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle('is-active', itemIndex === index);
      });
      dots.forEach(function (dot, itemIndex) {
        dot.classList.toggle('is-active', itemIndex === index);
      });
    }

    function startTimer() {
      stopTimer();
      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    function stopTimer() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, itemIndex) {
      dot.addEventListener('click', function () {
        showSlide(itemIndex);
        startTimer();
      });
    });

    if (previous) {
      previous.addEventListener('click', function () {
        showSlide(index - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(index + 1);
        startTimer();
      });
    }

    slider.addEventListener('mouseenter', stopTimer);
    slider.addEventListener('mouseleave', startTimer);
    startTimer();
  }

  var searches = Array.prototype.slice.call(document.querySelectorAll('.movie-search'));

  searches.forEach(function (input) {
    var parentSection = input.closest('.section') || document;
    var cards = Array.prototype.slice.call(parentSection.querySelectorAll('.movie-card'));

    input.addEventListener('input', function () {
      var keyword = input.value.trim().toLowerCase();

      cards.forEach(function (card) {
        var text = ((card.getAttribute('data-title') || '') + ' ' + (card.getAttribute('data-meta') || '')).toLowerCase();
        card.classList.toggle('is-hidden', keyword && text.indexOf(keyword) === -1);
      });
    });
  });
})();
