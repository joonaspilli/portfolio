window.addEventListener('DOMContentLoaded', function() {

  const GLOBALS = {
    ACCESSIBILITY: {
      VISUALLY_HIDDEN_CSS: 'vhidden'
    }
  };

  const asArray = function(e) {
    return Array.prototype.slice.call(e);
  };

  const displayNavigation = function(nav) {
    nav.classList.remove(GLOBALS.ACCESSIBILITY.VISUALLY_HIDDEN_CSS);
    nav.dataset.navOpen = true;
  };

  const hideNavigation = function(nav) {
    nav.classList.add(GLOBALS.ACCESSIBILITY.VISUALLY_HIDDEN_CSS);
    nav.dataset.navOpen = false;
  };

  const toggleNavigation = function(nav) {
    nav.dataset.navOpen =
      !nav.classList.toggle(GLOBALS.ACCESSIBILITY.VISUALLY_HIDDEN_CSS);
  };

  const initNavigation = function(nav) {
    if (nav.dataset.navOpen !== 'true') {
      hideNavigation(nav);
    }
    document.addEventListener('focus', function(event) {
      if (nav.contains(event.target)) {
        displayNavigation(nav);
      } else {
        hideNavigation(nav);
      }
    }, true);
    document.addEventListener('click', function(event) {
      const target = event.target;
      if (nav.contains(target)) {
        if (typeof target.dataset.navLink !== 'undefined') {
          hideNavigation(nav);
        } else {
          displayNavigation(nav);
        }
      } else {
        hideNavigation(nav);
      }
    });
  };

  const initNavigationButtons = function(btn) {
    const navs = asArray(document.querySelectorAll(btn.dataset.navTarget));
    btn.addEventListener('click', function(event) {
      event.stopPropagation();
      navs.forEach(toggleNavigation);
    });
  };

  const initializeNavigations = function() {
    asArray(document.querySelectorAll('[data-nav]'))
      .forEach(initNavigation);
    asArray(document.querySelectorAll('[data-nav-toggle]'))
      .forEach(initNavigationButtons);
  };

  const processTitledElements = function() {
    const elements = asArray(document.querySelectorAll('[title]'));
    elements.forEach(function(el) {
      const title = el.getAttribute('title');
      if (title) {
        const titleEl = document.createElement('span');
        const vhidden = GLOBALS.ACCESSIBILITY.VISUALLY_HIDDEN_CSS;
        titleEl.textContent = ' (' + title + ')';
        titleEl.classList.add(vhidden);
        el.appendChild(titleEl);
        el.style.cursor = 'pointer';
        el.setAttribute('tabindex', '-1');
        el.addEventListener('click', function() {
          titleEl.classList.toggle(vhidden);
        });
      }
    });
  };

  initializeNavigations();
  processTitledElements();

});

