(function () {
    var toggle = document.querySelector('.menu-toggle');
    var menu = document.querySelector('#navMenu');

    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            var open = menu.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    var carousel = document.querySelector('[data-carousel]');

    if (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dot'));
        var current = 0;
        var timer;

        function showSlide(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === current);
            });
        }

        function startCarousel() {
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                window.clearInterval(timer);
                showSlide(index);
                startCarousel();
            });
        });

        if (slides.length > 1) {
            startCarousel();
        }
    }

    var filterForm = document.querySelector('[data-filter-form]');
    var filterList = document.querySelector('[data-filter-list]');

    if (filterForm && filterList) {
        var input = filterForm.querySelector('[data-filter-input]');
        var year = filterForm.querySelector('[data-filter-year]');
        var category = filterForm.querySelector('[data-filter-category]');
        var items = Array.prototype.slice.call(filterList.children);
        var emptyState = document.querySelector('[data-empty-state]');
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q') || '';

        if (input && initialQuery) {
            input.value = initialQuery;
        }

        function normalize(value) {
            return String(value || '').toLowerCase().trim();
        }

        function applyFilter() {
            var query = normalize(input ? input.value : '');
            var selectedYear = year ? year.value : '';
            var selectedCategory = category ? category.value : '';
            var visible = 0;

            items.forEach(function (item) {
                var haystack = normalize([
                    item.getAttribute('data-title'),
                    item.getAttribute('data-region'),
                    item.getAttribute('data-year'),
                    item.getAttribute('data-type'),
                    item.getAttribute('data-genre')
                ].join(' '));
                var matchesQuery = !query || haystack.indexOf(query) !== -1;
                var matchesYear = !selectedYear || item.getAttribute('data-year') === selectedYear;
                var matchesCategory = !selectedCategory || item.getAttribute('data-category') === selectedCategory;
                var show = matchesQuery && matchesYear && matchesCategory;

                item.hidden = !show;
                if (show) {
                    visible += 1;
                }
            });

            if (emptyState) {
                emptyState.hidden = visible !== 0;
            }
        }

        filterForm.addEventListener('submit', function (event) {
            event.preventDefault();
            applyFilter();
        });

        [input, year, category].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilter);
                control.addEventListener('change', applyFilter);
            }
        });

        applyFilter();
    }
})();
