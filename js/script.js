document.addEventListener("DOMContentLoaded", () => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const header = document.querySelector(".site-header");
    const revealElements = document.querySelectorAll(".reveal, .media-reveal");

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
        element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 90}ms`);
        observer.observe(element);
    });

    // Do not leave media cropped if observer delivery is delayed or interrupted.
    window.setTimeout(() => {
        revealElements.forEach((element) => element.classList.add("is-visible"));
    }, 1800);

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
