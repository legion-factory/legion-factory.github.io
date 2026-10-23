/* Light/dark toggle. The inline <head> script paints data-theme before first render;
   this file wires the header button. Choice is kept in localStorage ('legion-theme');
   with nothing stored the page follows prefers-color-scheme. */
(function () {
  var KEY = 'legion-theme';
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function stored() { try { var t = localStorage.getItem(KEY); return t === 'light' || t === 'dark' ? t : null; } catch (e) { return null; } }
  function system() { return mq && mq.matches ? 'dark' : 'light'; }
  function current() { return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
  function sync() {
    var dark = current() === 'dark';
    var btns = document.querySelectorAll('.theme-toggle');
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute('aria-pressed', dark ? 'true' : 'false');
      btns[i].title = dark ? 'Switch to light theme' : 'Switch to dark theme';
    }
  }
  function paint(t) { root.setAttribute('data-theme', t); sync(); }
  paint(stored() || system());
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.theme-toggle');
    if (!btn) return;
    var next = current() === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(KEY, next); } catch (err) { /* private mode: still flip for this page */ }
    paint(next);
  });
  if (mq) {
    var onSys = function () { if (!stored()) paint(system()); };
    if (mq.addEventListener) mq.addEventListener('change', onSys); else if (mq.addListener) mq.addListener(onSys);
  }
  window.addEventListener('storage', function (e) { if (e.key === KEY) paint(stored() || system()); });
})();
