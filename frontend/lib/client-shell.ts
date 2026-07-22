import { THEME_STORAGE_KEY } from '@/lib/theme'

export const clientShellScript = `
(function () {
  var storageKey = '${THEME_STORAGE_KEY}';
  var cycle = ['system', 'light', 'dark'];
  var labels = {
    system: 'System theme',
    light: 'Light theme',
    dark: 'Dark theme',
  };

  function readMode() {
    try {
      var stored = localStorage.getItem(storageKey);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch (e) {}
    return 'system';
  }

  function applyMode(mode) {
    var root = document.documentElement;
    try {
      if (mode === 'system') {
        root.removeAttribute('data-theme');
        localStorage.removeItem(storageKey);
        return;
      }
      root.setAttribute('data-theme', mode);
      localStorage.setItem(storageKey, mode);
    } catch (e) {}
  }

  function nextMode(mode) {
    var index = cycle.indexOf(mode);
    return cycle[(index + 1) % cycle.length];
  }

  function syncToggle(button, mode) {
    button.setAttribute('data-theme-mode', mode);
    button.setAttribute('aria-label', labels[mode]);
    button.title = labels[mode];

    button.querySelectorAll('[data-theme-icon]').forEach(function (icon) {
      var active = icon.getAttribute('data-theme-icon') === mode;
      icon.classList.toggle('hidden', !active);
    });
  }

  function initThemeToggles() {
    var mode = readMode();
    applyMode(mode);
    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      syncToggle(button, mode);
    });
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-theme-toggle]');
    if (!button) {
      return;
    }

    event.preventDefault();
    var next = nextMode(readMode());
    applyMode(next);
    document.querySelectorAll('[data-theme-toggle]').forEach(function (toggle) {
      syncToggle(toggle, next);
    });
  });

  initThemeToggles();
  document.addEventListener('DOMContentLoaded', initThemeToggles);
})();
`
