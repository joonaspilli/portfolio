window.addEventListener('DOMContentLoaded', function() {

  const GLOBALS = {
    NAVIGATION: {
      HIDE_CSS_CLASS: 'vhidden'
    },
    ANCHOR_LINKS: {
      SCROLL_Y_OFFSET: 96
    }
  };

  const asArray = function(e) {
    return Array.prototype.slice.call(e);
  };

  const onAnchorLinkClick = function(event, link) {
    const href = link.getAttribute('href');
    event.preventDefault();
    window.history.pushState(null, '', href);
    // setTimeout to allow navigation to hide before scrolling.
    window.setTimeout(function() {
      const anchoredEl = document.querySelector(href);
      const anchoredElTabIndex = anchoredEl.getAttribute('tabindex');
      window.scrollTo({
        top: anchoredEl.getBoundingClientRect().y + window.scrollY
          - GLOBALS.ANCHOR_LINKS.SCROLL_Y_OFFSET,
        left: anchoredEl.getBoundingClientRect().x + window.scrollX,
        behavior: 'smooth'
      });
      if (!anchoredElTabIndex) {
        anchoredEl.setAttribute('tabindex', '-1');
      }
      anchoredEl.focus({ preventScroll: true });
      if (!anchoredElTabIndex) {
        anchoredEl.removeAttribute('tabindex');
      }
    });
  };

  const initializeSmoothAnchorLinks = function() {
    asArray(document.querySelectorAll('a[href^="#"]'))
      .filter(function(link) {
        return link.getAttribute('href').length > 1;
      })
      .forEach(function(link) {
        link.addEventListener('click', function(event) {
          onAnchorLinkClick(event, link);
        });
      });
  };

  const displayNavigation = function(nav) {
    nav.classList.remove(GLOBALS.NAVIGATION.HIDE_CSS_CLASS);
    nav.dataset.navOpen = true;
  };

  const hideNavigation = function(nav) {
    nav.classList.add(GLOBALS.NAVIGATION.HIDE_CSS_CLASS);
    nav.dataset.navOpen = false;
  };

  const toggleNavigation = function(nav) {
    nav.dataset.navOpen =
      !nav.classList.toggle(GLOBALS.NAVIGATION.HIDE_CSS_CLASS);
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

  initializeSmoothAnchorLinks();
  initializeNavigations();
});

