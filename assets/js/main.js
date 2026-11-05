/* =========================================================
   广财羽动未来俱乐部 · 官网脚本
   所有功能都做了空值保护，各页面共用同一份文件。
   ========================================================= */
(function () {
  'use strict';

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. 移动端导航 ---------- */
  var nav = $('#nav');
  var toggle = $('#navToggle');
  if (nav && toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('a', nav).forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('open')) return;
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- 2. 顶栏吸顶 + 滚动进度 ---------- */
  var head = $('#siteHead');
  var bar  = $('#scrollProgress');
  var toTop = $('#toTop');
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (head) head.classList.toggle('is-stuck', y > 8);
    if (bar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? Math.min(100, (y / h) * 100) : 0) + '%';
    }
    if (toTop) toTop.classList.toggle('show', y > 560);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- 3. 入场动效 ---------- */
  var reveals = $$('.reveal');
  if (reveals.length) {
    if (!('IntersectionObserver' in window) || reduceMotion) {
      reveals.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('is-in');
            io.unobserve(en.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      reveals.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- 4. 数字滚动 ---------- */
  var counters = $$('[data-count]');
  if (counters.length) {
    var runCount = function (el) {
      var target = parseFloat(el.getAttribute('data-count')) || 0;
      var dec = (el.getAttribute('data-dec') | 0);
      if (reduceMotion) { el.textContent = target.toFixed(dec); return; }
      var start = performance.now(), dur = 900;
      var tick = function (now) {
        var p = Math.min(1, (now - start) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(dec);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toFixed(dec);
      };
      requestAnimationFrame(tick);
    };
    if (!('IntersectionObserver' in window)) {
      counters.forEach(runCount);
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { runCount(en.target); cio.unobserve(en.target); }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  /* ---------- 5. 放场倒计时（每天 12:00 北京时间） ---------- */
  var cd = $('#countdown');
  if (cd) {
    var SHANGHAI = 8 * 3600 * 1000;
    var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
    var nextDrop = function () {
      var now = Date.now();
      var sh = new Date(now + SHANGHAI);
      var t = Date.UTC(sh.getUTCFullYear(), sh.getUTCMonth(), sh.getUTCDate(), 12, 0, 0) - SHANGHAI;
      if (t <= now) t += 86400000;
      return t;
    };
    var dropAt = nextDrop();
    var label = $('#countdownNote');
    var tickCd = function () {
      var now = Date.now();
      if (now >= dropAt) { dropAt = nextDrop(); }
      var left = Math.max(0, dropAt - now);
      var h = Math.floor(left / 3600000);
      var m = Math.floor(left / 60000) % 60;
      var s = Math.floor(left / 1000) % 60;
      cd.textContent = pad(h) + ':' + pad(m) + ':' + pad(s);
      if (label && !label.dataset.fixed) {
        var d = new Date(dropAt + SHANGHAI);
        label.textContent = '下次放场：' + (d.getUTCMonth() + 1) + ' 月 ' + d.getUTCDate() + ' 日 12:00';
      }
    };
    tickCd();
    setInterval(tickCd, 1000);
  }

  /* ---------- 6. 复制 QQ 号 ---------- */
  $$('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function (ok) {
        var old = btn.textContent;
        btn.textContent = ok ? '已复制' : '请手动复制';
        setTimeout(function () { btn.textContent = old; }, 1500);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
        document.body.removeChild(ta);
        done(ok);
      }
    });
  });

  /* ---------- 7. 筛选 + 搜索（资源页 / 推荐页） ---------- */
  var filterButtons = $$('[data-filter]');
  var items = $$('[data-cat]');
  var searchInput = $('#searchInput');
  var emptyState = $('#emptyState');
  if (filterButtons.length && items.length) {
    var activeCat = 'all';
    var applyFilter = function () {
      var q = (searchInput && searchInput.value || '').trim().toLowerCase();
      var shown = 0;
      items.forEach(function (el) {
        var cats = (el.getAttribute('data-cat') || '').split(/\s+/);
        var catOK = activeCat === 'all' || cats.indexOf(activeCat) !== -1;
        var textOK = !q || el.textContent.toLowerCase().indexOf(q) !== -1;
        var ok = catOK && textOK;
        el.style.display = ok ? '' : 'none';
        if (ok) shown++;
      });
      if (emptyState) emptyState.classList.toggle('show', shown === 0);
    };
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeCat = btn.getAttribute('data-filter');
        filterButtons.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        applyFilter();
      });
    });
    if (searchInput) searchInput.addEventListener('input', applyFilter);
    applyFilter();
  }

  /* ---------- 8. 页脚年份 ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
