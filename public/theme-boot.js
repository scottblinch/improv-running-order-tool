(function () {
  var storageKey = 'improv-theme';
  var theme = localStorage.getItem(storageKey) || 'system';
  var root = document.documentElement;
  var resolved =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;
  root.classList.add(resolved);
  root.style.colorScheme = resolved;
})();
