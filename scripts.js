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

  const toggleTextContent = function(el, condition, a, b) {
    if (condition) {
      el.textContent = a;
    } else {
      el.textContent = b;
    }
    el.setAttribute('aria-pressed', condition);
  };

  const addToggleVisibleTitle = function(el) {
    const title = el.getAttribute('title');
    if (!title) {
      return;
    }
    const original = el.textContent;
    let display = false;
    el.style.cursor = 'pointer';
    el.setAttribute('tabindex', 0);
    el.setAttribute('role', 'button');
    el.setAttribute('aria-pressed', false);
    el.addEventListener('click', function() {
      toggleTextContent(el, display = !display, title, original);
    });
    el.addEventListener('keydown', function(event) {
      if (event.code === 'Enter') {
        toggleTextContent(el, display = !display, title, original);
      }
    });
  };

  const processTitledElements = function() {
    asArray(document.querySelectorAll('[title]'))
      .forEach(addToggleVisibleTitle);
  };

  const scrollToAnchor = function() {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView();
      }
    }
  };

  const printGreeting = function() {
    console.log(
      'Hello there!\n\n' +
      'Since you\'re lurking here you may have noticed that my portfolio page',
      'is all static content and its files lack minification and fancy newer',
      'CSS and JavaScript features. This is because I\'ve kept the hosting and',
      'updating process of my portfolio simple and easy. So don\'t be alarmed,',
      'I\'m more than familiar with JavaScript\'s newest features, different',
      'transpiling processes as well as modern web application development and',
      'all the usual that comes with it.\n\n' +
      'So I might be just the kind of geek you\'re looking for, send me a',
      'message!\n\n' +
      '- Joonas'
    );
  };

  initializeNavigations();
  processTitledElements();
  // Timeout seems to be necessary to have this work reliably.
  window.setTimeout(scrollToAnchor);
  printGreeting();

});

