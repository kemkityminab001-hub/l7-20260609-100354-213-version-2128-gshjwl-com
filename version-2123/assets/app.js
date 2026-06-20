document.addEventListener("DOMContentLoaded", function () {
    bindMobileMenu();
    bindHeroCarousel();
    bindFilters();
    bindPlayers();
});

function bindMobileMenu() {
    var button = document.querySelector(".menu-toggle");
    var nav = document.getElementById("mobileNav");

    if (!button || !nav) {
        return;
    }

    button.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        button.setAttribute("aria-expanded", open ? "true" : "false");
    });
}

function bindHeroCarousel() {
    var hero = document.querySelector("[data-hero]");

    if (!hero) {
        return;
    }

    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var current = 0;
    var timer = null;

    if (slides.length <= 1) {
        return;
    }

    function show(index) {
        current = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle("is-active", slideIndex === current);
        });

        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle("is-active", dotIndex === current);
        });
    }

    function start() {
        stop();
        timer = window.setInterval(function () {
            show(current + 1);
        }, 5000);
    }

    function stop() {
        if (timer) {
            window.clearInterval(timer);
        }
    }

    if (prev) {
        prev.addEventListener("click", function () {
            show(current - 1);
            start();
        });
    }

    if (next) {
        next.addEventListener("click", function () {
            show(current + 1);
            start();
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            show(index);
            start();
        });
    });

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
}

function normalizeText(value) {
    return String(value || "").toLowerCase().trim();
}

function bindFilters() {
    var lists = Array.prototype.slice.call(document.querySelectorAll("[data-filter-list]"));

    lists.forEach(function (list) {
        var scope = list.closest(".content-section") || document;
        var input = scope.querySelector("[data-filter-input]");
        var yearSelect = scope.querySelector("[data-filter-year]");
        var regionSelect = scope.querySelector("[data-filter-region]");
        var emptyState = scope.querySelector("[data-empty-state]");
        var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));

        if (!cards.length) {
            return;
        }

        hydrateSelect(yearSelect, uniqueValues(cards, "year").sort(function (a, b) {
            return Number(b) - Number(a);
        }));
        hydrateSelect(regionSelect, uniqueValues(cards, "region").sort());

        if (input && window.location.search) {
            var params = new URLSearchParams(window.location.search);
            var query = params.get("q");

            if (query) {
                input.value = query;
            }
        }

        function applyFilter() {
            var query = normalizeText(input ? input.value : "");
            var year = normalizeText(yearSelect ? yearSelect.value : "");
            var region = normalizeText(regionSelect ? regionSelect.value : "");
            var visible = 0;

            cards.forEach(function (card) {
                var text = normalizeText([
                    card.dataset.title,
                    card.dataset.region,
                    card.dataset.year,
                    card.dataset.genre,
                    card.dataset.tags
                ].join(" "));
                var matchQuery = !query || text.indexOf(query) !== -1;
                var matchYear = !year || normalizeText(card.dataset.year) === year;
                var matchRegion = !region || normalizeText(card.dataset.region) === region;
                var show = matchQuery && matchYear && matchRegion;

                card.style.display = show ? "" : "none";

                if (show) {
                    visible += 1;
                }
            });

            if (emptyState) {
                emptyState.classList.toggle("is-visible", visible === 0);
            }
        }

        if (input) {
            input.addEventListener("input", applyFilter);
        }

        if (yearSelect) {
            yearSelect.addEventListener("change", applyFilter);
        }

        if (regionSelect) {
            regionSelect.addEventListener("change", applyFilter);
        }

        applyFilter();
    });
}

function uniqueValues(cards, key) {
    var values = [];

    cards.forEach(function (card) {
        var value = card.dataset[key];

        if (value && values.indexOf(value) === -1) {
            values.push(value);
        }
    });

    return values;
}

function hydrateSelect(select, values) {
    if (!select || select.dataset.ready === "true") {
        return;
    }

    values.forEach(function (value) {
        var option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
    });

    select.dataset.ready = "true";
}

function bindPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));

    players.forEach(function (player) {
        var video = player.querySelector("video");
        var overlay = player.querySelector(".player-overlay");
        var hls = null;
        var source = video ? video.getAttribute("src") : "";

        if (!video || !source) {
            return;
        }

        function beginPlayback() {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.play().catch(function () {});
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                if (!hls) {
                    hls = new Hls({
                        enableWorker: true,
                        lowLatencyMode: false
                    });
                    hls.loadSource(source);
                    hls.attachMedia(video);
                    hls.on(Hls.Events.MANIFEST_PARSED, function () {
                        video.play().catch(function () {});
                    });
                    hls.on(Hls.Events.ERROR, function (event, data) {
                        if (!data || !data.fatal) {
                            return;
                        }

                        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                            hls.startLoad();
                        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                            hls.recoverMediaError();
                        } else {
                            hls.destroy();
                            hls = null;
                        }
                    });
                } else {
                    video.play().catch(function () {});
                }
                return;
            }

            video.play().catch(function () {});
        }

        if (overlay) {
            overlay.addEventListener("click", beginPlayback);
        }

        Array.prototype.slice.call(document.querySelectorAll("[data-trigger-player]")).forEach(function (trigger) {
            trigger.addEventListener("click", function () {
                player.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
                beginPlayback();
            });
        });

        video.addEventListener("click", function () {
            if (video.paused) {
                beginPlayback();
            }
        });
    });
}
