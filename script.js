document.addEventListener("DOMContentLoaded", function () {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Theme toggle: an explicit choice is saved, otherwise follow the system setting
    const themeToggle = document.getElementById("themeToggle");

    function currentTheme() {
        return root.getAttribute("data-theme") || (darkQuery.matches ? "dark" : "light");
    }

    function updateToggleLabel() {
        const next = currentTheme() === "dark" ? "light" : "dark";
        themeToggle.setAttribute("aria-label", "Switch to " + next + " theme");
    }

    if (themeToggle) {
        updateToggleLabel();
        themeToggle.addEventListener("click", () => {
            const next = currentTheme() === "dark" ? "light" : "dark";
            root.setAttribute("data-theme", next);
            try {
                localStorage.setItem("theme", next);
            } catch (e) { }
            updateToggleLabel();
        });
        darkQuery.addEventListener("change", updateToggleLabel);
    }

    // Typewriter effect (the full text stays available to screen readers)
    const element = document.getElementById("typewriter");
    if (element && !reduceMotion) {
        const text = element.textContent.trim().replace(/\s+/g, " ");
        const srCopy = document.createElement("span");
        srCopy.className = "sr-only";
        srCopy.textContent = text;
        element.parentNode.insertBefore(srCopy, element);
        element.setAttribute("aria-hidden", "true");
        element.textContent = "";
        element.classList.add("typing");

        let index = 0;
        (function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, 55);
            } else {
                setTimeout(() => element.classList.remove("typing"), 2500);
            }
        })();
    }

    // Fade-in sections on scroll
    const fadeElements = document.querySelectorAll(".fade-in");
    if ("IntersectionObserver" in window) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });
        fadeElements.forEach((el) => fadeObserver.observe(el));
    } else {
        fadeElements.forEach((el) => el.classList.add("visible"));
    }

    // Highlight the nav link for the section in view
    const navLinks = document.querySelectorAll(".nav-links a");
    const sections = Array.from(navLinks)
        .map((link) => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    function setActiveLink() {
        const offset = window.innerHeight * 0.35;
        let activeId = null;
        sections.forEach((section) => {
            if (section.getBoundingClientRect().top - offset <= 0) activeId = section.id;
        });
        navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === "#" + activeId);
        });
    }

    // Back to top button
    const backToTopBtn = document.getElementById("backToTop");
    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
        });
    }

    function onScroll() {
        setActiveLink();
        if (backToTopBtn) backToTopBtn.classList.toggle("show", window.scrollY > 600);
    }

    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Footer year
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
});
