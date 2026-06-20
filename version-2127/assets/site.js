(function () {
  var menuButton = document.querySelector('.menu-button');
  var mobilePanel = document.querySelector('.mobile-panel');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      var opened = mobilePanel.hasAttribute('hidden');
      if (opened) {
        mobilePanel.removeAttribute('hidden');
        menuButton.setAttribute('aria-expanded', 'true');
      } else {
        mobilePanel.setAttribute('hidden', '');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var thumbs = Array.prototype.slice.call(document.querySelectorAll('.hero-thumb'));
  var current = 0;

  function setSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, itemIndex) {
      slide.classList.toggle('is-active', itemIndex === current);
    });
    thumbs.forEach(function (thumb, itemIndex) {
      thumb.classList.toggle('is-active', itemIndex === current);
    });
  }

  thumbs.forEach(function (thumb, index) {
    thumb.addEventListener('click', function () {
      setSlide(index);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      setSlide(current + 1);
    }, 5200);
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var categorySelect = document.querySelector('[data-filter-category]');
  var yearSelect = document.querySelector('[data-filter-year]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-title][data-text]'));
  var emptyState = document.querySelector('.empty-state');
  var resultCount = document.querySelector('[data-result-count]');

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function getQueryParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name) || '';
  }

  if (filterInput && !filterInput.value) {
    filterInput.value = getQueryParam('q');
  }

  function filterCards() {
    if (!cards.length) {
      return;
    }

    var q = normalize(filterInput ? filterInput.value : '');
    var category = normalize(categorySelect ? categorySelect.value : '');
    var year = normalize(yearSelect ? yearSelect.value : '');
    var visible = 0;

    cards.forEach(function (card) {
      var text = normalize(card.getAttribute('data-text'));
      var cardCategory = normalize(card.getAttribute('data-category'));
      var cardYear = normalize(card.querySelector('.card-meta span:last-child') ? card.querySelector('.card-meta span:last-child').textContent : '');
      var matched = (!q || text.indexOf(q) !== -1) && (!category || cardCategory === category) && (!year || cardYear === year);
      card.style.display = matched ? '' : 'none';
      if (matched) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle('is-visible', visible === 0);
    }
    if (resultCount) {
      resultCount.textContent = String(visible);
    }
  }

  if (filterInput) {
    filterInput.addEventListener('input', filterCards);
  }
  if (categorySelect) {
    categorySelect.addEventListener('change', filterCards);
  }
  if (yearSelect) {
    yearSelect.addEventListener('change', filterCards);
  }
  filterCards();
})();
