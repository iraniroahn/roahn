document.addEventListener("DOMContentLoaded", function () {
    // Typewriter effect
    const element = document.getElementById("typewriter");
    const text = "University of Melbourne MIS '28";
    let index = 0;

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, 80);
        }
    }

    type();

    // Fade-in animation on scroll
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    });

    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });

    // Staggered reveal for achievement list items
    document.querySelectorAll('.achievements').forEach((ul) => {
        ul.querySelectorAll('li').forEach((li) => {
            li.style.opacity = '0';
            li.style.transform = 'translateY(12px)';
        });
    });

    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;

                // Add visible class for existing CSS rules
                el.classList.add('visible');

                // Stagger children if this element has achievements
                const children = el.querySelectorAll('.achievements li');
                if (children.length) {
                    children.forEach((child, i) => {
                        child.style.transition = `opacity 420ms ease ${i * 120}ms, transform 420ms cubic-bezier(.2,.9,.2,1) ${i * 120}ms`;
                        // Force a reflow so transition applies
                        void child.offsetWidth;
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    });
                }

                // Unobserve once animated
                staggerObserver.unobserve(el);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.experience-item, .project-item').forEach((el) => staggerObserver.observe(el));

    // Back to top button
    const backToTopBtn = document.getElementById("backToTop");
    if (backToTopBtn) {
        document.addEventListener("scroll", () => {
            backToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
        });
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }


});
