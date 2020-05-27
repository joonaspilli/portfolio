const debounce = (callback, time) => {
    let timeout;

    return () => {
        window.clearTimeout(timeout);
        timeout = window.setTimeout(callback, time);
    };
};

const getInViewElements = ({ elements = [], threshold = 20, ofViewport }) => {
    const { innerHeight } = window;

    return elements.reduce((acc, cur) => {
        const { top, bottom } = cur.getBoundingClientRect();

        if (top > innerHeight || bottom < 0) {
            return acc;
        }

        const elementHeight = bottom - top;
        const topSubtract = top < 0 ? -top : 0;
        const bottomSubtract = bottom > innerHeight ? bottom - innerHeight : 0;
        const percentageOf = ofViewport ? innerHeight : elementHeight;
        const visiblePercentage =
            ((elementHeight - topSubtract - bottomSubtract) / percentageOf) *
            100;

        if (visiblePercentage > threshold) {
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
    ofViewport,
}) => {
    let currentInViewElements = [];

    const update = () => {
        const newInViewElements = getInViewElements({
            elements,
            threshold,
            ofViewport,
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
        })
    );
};

window.addEventListener('DOMContentLoaded', () => {
    const navLinks = Array.prototype.slice.call(
        document.querySelectorAll('nav a')
    );

    const handleArticleEnterView = (element) => {
        element.classList.add('in-view');
    };

    const handleArticleExitView = (element) => {
        element.classList.remove('in-view');
    };

    const handleArticleNavLinkEnterView = (element) => {
        const id = element.getAttribute('id');
        const correspondingNavLink = navLinks.find(
            (link) => id === link.getAttribute('href').slice(1)
        );

        if (correspondingNavLink) {
            correspondingNavLink.classList.add('in-view');
        }
    };

    const handleArticleNavLinkExitView = (element) => {
        const id = element.getAttribute('id');
        const correspondingNavLink = navLinks.find(
            (link) => id === link.getAttribute('href').slice(1)
        );

        if (correspondingNavLink) {
            correspondingNavLink.classList.remove('in-view');
        }
    };

    initInView({
        selector: 'main > article',
        threshold: 20,
        ofViewport: true,
        onEnterView: handleArticleEnterView,
        onExitView: handleArticleExitView,
    });

    initInView({
        selector: 'main > article',
        threshold: 20,
        ofViewport: true,
        onEnterView: handleArticleNavLinkEnterView,
        onExitView: handleArticleNavLinkExitView,
    });

    initInView({
        selector: 'aside > article',
        threshold: 20,
        onEnterView: handleArticleEnterView,
        onExitView: handleArticleExitView,
    });

    initInView({
        selector: 'aside > article',
        threshold: 20,
        onEnterView: handleArticleNavLinkEnterView,
        onExitView: handleArticleNavLinkExitView,
    });

    document.querySelectorAll('main > article').forEach((article) => {
        const img = article.querySelector('img');

        if (img) {
            const imgSrc = img.getAttribute('src');
            const bgElement = document.createElement('div');
            bgElement.style.backgroundImage = 'url(' + imgSrc + ')';
            bgElement.classList.add('background');
            article.appendChild(bgElement);
        }
    });
});
