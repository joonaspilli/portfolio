const debounce = (callback, time) => {
  let timeout;

  return () => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(callback, time);
  };
};

const getInViewElements = ({ elements = [], threshold = 20 }) => {
  const { innerHeight } = window;

  return elements.reduce((acc, cur) => {
    const { top, bottom } = cur.getBoundingClientRect();

    if (top > innerHeight || bottom < 0) {
      return acc;
    }

    const elementHeight = bottom - top;
    const topSubtract = top < 0 ? -top : 0;
    const bottomSubtract = bottom > innerHeight ? bottom - innerHeight : 0;
    const screenShare =
      (elementHeight - topSubtract - bottomSubtract) / innerHeight;

    if (screenShare * 100 > threshold) {
      return [...acc, cur];
    }

    return acc;
  }, []);
};

const updateInView = ({
  elements,
  onEnterView,
  onExitView,
  debounceTime = 0,
  threshold,
}) => {
  let currentInViewElements = [];

  const update = () => {
    const newInViewElements = getInViewElements({ elements, threshold });

    const exitingElements = currentInViewElements.filter((element) => {
      return !newInViewElements.includes(element);
    });

    if (onExitView) {
      exitingElements.forEach(onExitView);
    }

    currentInViewElements = newInViewElements.map((element) => {
      if (onEnterView && !currentInViewElements.includes(element)) {
        onEnterView(element);
      }

      return element;
    });
  };

  update();

  return debounce(update, debounceTime);
};

const initInView = ({
  selector,
  onEnterView,
  onExitView,
  scrollDebounceTime,
  resizeDebounceTime = 200,
  threshold,
}) => {
  const elements = Array.prototype.slice.call(
    document.querySelectorAll(selector)
  );

  window.addEventListener(
    "scroll",
    updateInView({
      elements,
      onEnterView,
      onExitView,
      debounceTime: scrollDebounceTime,
      threshold,
    })
  );

  window.addEventListener(
    "resize",
    updateInView({
      elements,
      onEnterView,
      onExitView,
      debounceTime: resizeDebounceTime,
      threshold,
    })
  );
};

window.addEventListener("DOMContentLoaded", () => {
  const onEnterView = (element) => {
    element.classList.add("in-view");
  };

  const onExitView = (element) => {
    element.classList.remove("in-view");
  };

  initInView({ selector: "article", onEnterView, onExitView });

  document.querySelectorAll("main > article").forEach((article) => {
    const img = article.querySelector("img");

    if (img) {
      const imgSrc = img.getAttribute("src");
      const bgElement = document.createElement("div");
      bgElement.style.backgroundImage = "url(" + imgSrc + ")";
      bgElement.classList.add("background");
      article.appendChild(bgElement);
    }
  });
});
