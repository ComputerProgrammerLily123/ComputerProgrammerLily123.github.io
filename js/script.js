document.addEventListener("DOMContentLoaded", () => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const header = document.querySelector(".site-header");
    const revealElements = document.querySelectorAll(".reveal, .media-reveal");
    const themeToggle = document.querySelector(".theme-toggle");
    const navigation = header?.querySelector("nav");

    if (themeToggle) {
        const themeRoot = document.documentElement;
        const themeColor = document.querySelector('meta[name="theme-color"]');
        const applyTheme = (theme) => {
            themeRoot.dataset.theme = theme;
            themeRoot.style.colorScheme = theme;
            themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
            if (themeColor) themeColor.content = theme === "dark" ? "#17191c" : "#f3f6fa";
        };

        applyTheme(themeRoot.dataset.theme || "light");
        themeToggle.addEventListener("click", () => {
            const nextTheme = themeRoot.dataset.theme === "dark" ? "light" : "dark";
            applyTheme(nextTheme);
            try {
                localStorage.setItem("site-theme", nextTheme);
            } catch {
                // The visual state still works when storage is unavailable.
            }
        });
    }

    if (navigation) {
        const navigationLinks = [...navigation.querySelectorAll("a")];
        let navigationTimer;

        navigationLinks.forEach((link, index) => {
            link.addEventListener("click", (event) => {
                const destination = new URL(link.href, window.location.href);
                const isModifiedClick = event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

                if (event.defaultPrevented || isModifiedClick || destination.origin !== window.location.origin) return;
                if (destination.href === window.location.href) {
                    event.preventDefault();
                    return;
                }
                if (reducedMotion || event.detail === 0) return;

                event.preventDefault();
                window.clearTimeout(navigationTimer);
                navigation.style.setProperty("--active-index", String(index));
                navigationTimer = window.setTimeout(() => window.location.assign(destination.href), 180);
            });
        });

        window.addEventListener("pageshow", () => {
            window.clearTimeout(navigationTimer);
            navigation.style.removeProperty("--active-index");
        });
    }

    if (reducedMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach((element) => element.classList.add("is-visible"));
        return;
    }

    document.body.classList.add("motion-ready");
    requestAnimationFrame(() => document.body.classList.add("page-ready"));

    const observer = new IntersectionObserver((entries, activeObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            activeObserver.unobserve(entry.target);
        });
    }, { rootMargin: "0px 0px -8%", threshold: 0.12 });

    revealElements.forEach((element, index) => {
        element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 40}ms`);
        observer.observe(element);
    });

    // Do not leave media cropped if observer delivery is delayed or interrupted.
    window.setTimeout(() => {
        revealElements.forEach((element) => element.classList.add("is-visible"));
    }, 500);

    if (!header) return;

    let previousScroll = window.scrollY;
    let ticking = false;

    const updateHeader = () => {
        const currentScroll = window.scrollY;
        header.classList.toggle("is-scrolled", currentScroll > 24);
        header.classList.toggle("is-hidden", currentScroll > 160 && currentScroll > previousScroll);
        previousScroll = currentScroll;
        ticking = false;
    };

    window.addEventListener("scroll", () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(updateHeader);
    }, { passive: true });

});
