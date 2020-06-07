const debounce = (callback, time) => {
    let timeout;

    return () => {
        window.clearTimeout(timeout);
        timeout = window.setTimeout(callback, time);
    };
};

const getInViewElements = ({
    elements = [],
    threshold = 20,
    ofViewport,
    single,
}) => {
    const { innerHeight } = window;
    let inViewElements = [];
    let index = elements.length;

    while (index--) {
        const currentEl = elements[index];
        const { top, bottom } = currentEl.getBoundingClientRect();

        if (top > innerHeight || bottom < 0) {
            continue;
        }

        const elementHeight = bottom - top;
        const topSubtract = top < 0 ? -top : 0;
        const bottomSubtract = bottom > innerHeight ? bottom - innerHeight : 0;
        const percentageOf = ofViewport ? innerHeight : elementHeight;
        const visiblePercentage =
            ((elementHeight - topSubtract - bottomSubtract) / percentageOf) *
            100;

        if (visiblePercentage > threshold) {
            inViewElements = [...inViewElements, currentEl];

            if (single) {
                break;
            }
        }
    }

    return inViewElements;
};

const updateInView = ({
    elements,
    onEnterView,
    onExitView,
    debounceTime = 0,
    threshold,
    ofViewport,
    single,
}) => {
    let currentInViewElements = [];

    const update = () => {
        const newInViewElements = getInViewElements({
            elements,
            threshold,
            ofViewport,
            single,
        });

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
    ofViewport,
    single,
}) => {
    const elements = Array.prototype.slice.call(
        document.querySelectorAll(selector)
    );

    window.addEventListener(
        'scroll',
        updateInView({
            elements,
            onEnterView,
            onExitView,
            debounceTime: scrollDebounceTime,
            threshold,
            ofViewport,
            single,
        })
    );

    window.addEventListener(
        'resize',
        updateInView({
            elements,
            onEnterView,
            onExitView,
            debounceTime: resizeDebounceTime,
            threshold,
            ofViewport,
            single,
        })
    );
};

window.addEventListener('DOMContentLoaded', () => {
    const navLinks = Array.prototype.slice.call(
        document.querySelectorAll('.main-nav__link')
    );

    const handleArticleEnterView = (element) => {
        element.classList.add('in-view');
    };

    const handleArticleExitView = (element) => {
        element.classList.remove('in-view');
    };

    const handleLinkArticleEnterView = (element) => {
        const id = element.getAttribute('id');
        const correspondingNavLink = navLinks.find(
            (link) => id === link.getAttribute('href').slice(1)
        );

        if (correspondingNavLink) {
            correspondingNavLink.classList.add('in-view');
        }
    };

    const handleLinkArticleExitView = (element) => {
        const id = element.getAttribute('id');
        const correspondingNavLink = navLinks.find(
            (link) => id === link.getAttribute('href').slice(1)
        );

        if (correspondingNavLink) {
            correspondingNavLink.classList.remove('in-view');
        }
    };

    initInView({
        selector: '.main-article',
        threshold: 20,
        ofViewport: true,
        onEnterView: handleArticleEnterView,
        onExitView: handleArticleExitView,
    });

    initInView({
        selector: '.main-article',
        threshold: 50,
        ofViewport: true,
        single: true,
        onEnterView: handleLinkArticleEnterView,
        onExitView: handleLinkArticleExitView,
    });

    // initInView({
    //     selector: '.secondary-article',
    //     threshold: 20,
    //     onEnterView: handleArticleEnterView,
    //     onExitView: handleArticleExitView,
    //     single: true,
    // });

    document.querySelectorAll('.main-article').forEach((article) => {
        const img = article.querySelector('img');

        if (img) {
            const imgSrc = img.getAttribute('src');
            const bgElement = document.createElement('div');
            bgElement.style.backgroundImage = `url(${imgSrc})`;
            bgElement.classList.add('main-article__background');
            article.appendChild(bgElement);
        }
    });
});
