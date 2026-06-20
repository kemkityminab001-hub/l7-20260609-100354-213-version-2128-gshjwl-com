(() => {
  const nav = document.querySelector('[data-nav]');
  const navToggle = document.querySelector('[data-nav-toggle]');

  if (nav && navToggle) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('is-open');
      document.body.classList.toggle('is-locked', nav.classList.contains('is-open'));
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const prev = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let active = 0;
    let timer = null;

    const show = (index) => {
      if (!slides.length) {
        return;
      }

      active = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === active));
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === active));
    };

    const start = () => {
      stop();
      timer = window.setInterval(() => show(active + 1), 5000);
    };

    const stop = () => {
      if (timer) {
        window.clearInterval(timer);
      }
    };

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        show(Number(dot.dataset.heroDot || 0));
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', () => {
        show(active - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', () => {
        show(active + 1);
        start();
      });
    }

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  const normalize = (value) => String(value || '').trim().toLowerCase();

  document.querySelectorAll('[data-filter-area]').forEach((area) => {
    const section = area.closest('.content-section') || document;
    const cards = Array.from(section.querySelectorAll('[data-movie-card]'));
    const keyword = area.querySelector('[data-filter-keyword]');
    const category = area.querySelector('[data-filter-category]');
    const type = area.querySelector('[data-filter-type]');
    const year = area.querySelector('[data-filter-year]');

    const apply = () => {
      const keywordValue = normalize(keyword && keyword.value);
      const categoryValue = normalize(category && category.value);
      const typeValue = normalize(type && type.value);
      const yearValue = normalize(year && year.value);

      cards.forEach((card) => {
        const haystack = normalize([
          card.dataset.title,
          card.dataset.region,
          card.dataset.type,
          card.dataset.genre,
          card.dataset.category,
          card.dataset.year
        ].join(' '));
        const matchedKeyword = !keywordValue || haystack.includes(keywordValue);
        const matchedCategory = !categoryValue || normalize(card.dataset.category) === categoryValue;
        const matchedType = !typeValue || normalize(card.dataset.type).includes(typeValue);
        const matchedYear = !yearValue || normalize(card.dataset.year).includes(yearValue);
        card.hidden = !(matchedKeyword && matchedCategory && matchedType && matchedYear);
      });
    };

    [keyword, category, type, year].forEach((item) => {
      if (item) {
        item.addEventListener('input', apply);
        item.addEventListener('change', apply);
      }
    });

    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    if (query && keyword) {
      keyword.value = query;
      apply();
    }
  });

  const backTop = document.querySelector('[data-back-top]');

  if (backTop) {
    const toggleBackTop = () => {
      backTop.classList.toggle('is-visible', window.scrollY > 480);
    };

    window.addEventListener('scroll', toggleBackTop, { passive: true });
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    toggleBackTop();
  }
})();
