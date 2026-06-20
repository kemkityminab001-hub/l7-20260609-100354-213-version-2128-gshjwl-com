(function () {
  function esc(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function param(name) {
    return new URLSearchParams(window.location.search).get(name) || '';
  }

  function render(items, query) {
    var box = document.querySelector('[data-search-results]');
    if (!box) {
      return;
    }

    if (!query) {
      box.innerHTML = '<div class="empty-state">输入片名、地区、年份、类型或关键词，快速查找想看的影视作品。</div>';
      return;
    }

    var q = query.toLowerCase();
    var matched = items.filter(function (item) {
      return [item.title, item.region, item.type, item.year, item.genre, item.tags, item.oneLine].join(' ').toLowerCase().indexOf(q) !== -1;
    }).slice(0, 120);

    if (!matched.length) {
      box.innerHTML = '<div class="empty-state">没有找到匹配内容，可以尝试更短的片名或类型词。</div>';
      return;
    }

    box.innerHTML = matched.map(function (item) {
      return '<article class="search-result-card">'
        + '<a href="' + esc(item.url) + '"><img src="' + esc(item.cover) + '" alt="' + esc(item.title) + '"></a>'
        + '<div>'
        + '<h2><a href="' + esc(item.url) + '">' + esc(item.title) + '</a></h2>'
        + '<p>' + esc(item.oneLine) + '</p>'
        + '<div class="rank-meta">' + esc(item.year) + ' · ' + esc(item.region) + ' · ' + esc(item.type) + ' · ' + esc(item.genre) + '</div>'
        + '</div>'
        + '</article>';
    }).join('');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var input = document.querySelector('[data-search-input]');
    var form = document.querySelector('[data-search-form]');
    var query = param('q').trim();

    if (input) {
      input.value = query;
    }

    render(window.siteSearchItems || [], query);

    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var value = input.value.trim();
        history.replaceState(null, '', value ? 'search.html?q=' + encodeURIComponent(value) : 'search.html');
        render(window.siteSearchItems || [], value);
      });
    }
  });
})();
