(function () {
    function normalize(value) {
        return (value || '').toString().trim().toLowerCase();
    }

    function setupMobileNav() {
        var button = document.querySelector('[data-menu-button]');
        var nav = document.querySelector('[data-mobile-nav]');

        if (!button || !nav) {
            return;
        }

        button.addEventListener('click', function () {
            var isOpen = nav.classList.toggle('is-open');
            button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    }

    function setupHeaderSearch() {
        document.querySelectorAll('[data-site-search]').forEach(function (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                var input = form.querySelector('input');
                var query = input ? input.value.trim() : '';
                var prefix = form.getAttribute('data-prefix') || '';
                var target = prefix + 'search.html';

                if (query) {
                    target += '?q=' + encodeURIComponent(query);
                }

                window.location.href = target;
            });
        });
    }

    function setupHero() {
        var hero = document.querySelector('[data-hero]');

        if (!hero) {
            return;
        }

        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
        var title = hero.querySelector('[data-hero-title]');
        var summary = hero.querySelector('[data-hero-summary]');
        var meta = hero.querySelector('[data-hero-meta]');
        var link = hero.querySelector('[data-hero-link]');
        var index = 0;

        function activate(nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });

            var active = slides[index];
            if (title) {
                title.textContent = active.getAttribute('data-title') || '';
            }
            if (summary) {
                summary.textContent = active.getAttribute('data-summary') || '';
            }
            if (meta) {
                meta.textContent = active.getAttribute('data-meta') || '';
            }
            if (link) {
                link.href = active.getAttribute('data-link') || '#';
            }
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                activate(dotIndex);
            });
        });

        activate(0);

        if (slides.length > 1) {
            window.setInterval(function () {
                activate(index + 1);
            }, 6500);
        }
    }

    function setupFilters() {
        var filterRoot = document.querySelector('[data-filter-root]');

        if (!filterRoot) {
            return;
        }

        var cards = Array.prototype.slice.call(filterRoot.querySelectorAll('[data-movie-card]'));
        var keyword = document.querySelector('[data-filter-keyword]');
        var category = document.querySelector('[data-filter-category]');
        var type = document.querySelector('[data-filter-type]');
        var year = document.querySelector('[data-filter-year]');
        var resultCount = document.querySelector('[data-result-count]');
        var empty = document.querySelector('[data-no-results]');
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q');

        if (keyword && initialQuery) {
            keyword.value = initialQuery;
        }

        function matches(card) {
            var haystack = normalize(card.getAttribute('data-title') + ' ' + card.getAttribute('data-genre') + ' ' + card.getAttribute('data-tags') + ' ' + card.getAttribute('data-region'));
            var keywordValue = keyword ? normalize(keyword.value) : '';
            var categoryValue = category ? normalize(category.value) : '';
            var typeValue = type ? normalize(type.value) : '';
            var yearValue = year ? normalize(year.value) : '';

            if (keywordValue && haystack.indexOf(keywordValue) === -1) {
                return false;
            }
            if (categoryValue && categoryValue !== 'all' && normalize(card.getAttribute('data-category')) !== categoryValue) {
                return false;
            }
            if (typeValue && typeValue !== 'all' && normalize(card.getAttribute('data-type')) !== typeValue) {
                return false;
            }
            if (yearValue && yearValue !== 'all' && normalize(card.getAttribute('data-year')) !== yearValue) {
                return false;
            }
            return true;
        }

        function applyFilters() {
            var visible = 0;
            cards.forEach(function (card) {
                var ok = matches(card);
                card.classList.toggle('hidden-card', !ok);
                if (ok) {
                    visible += 1;
                }
            });

            if (resultCount) {
                resultCount.textContent = visible.toString();
            }
            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        }

        [keyword, category, type, year].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilters);
                control.addEventListener('change', applyFilters);
            }
        });

        applyFilters();
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupMobileNav();
        setupHeaderSearch();
        setupHero();
        setupFilters();
    });
})();
