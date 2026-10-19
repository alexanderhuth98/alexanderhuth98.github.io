document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("#mainNav");
    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector("#primary-nav");
    const navLinks = [...document.querySelectorAll("#primary-nav a")];
    const mobileNavigation = window.matchMedia("(max-width: 820px)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const isMenuOpen = () => menuToggle?.getAttribute("aria-expanded") === "true";

    const setMenuOpen = (open) => {
        const nextOpen = mobileNavigation.matches && open;
        menuToggle?.setAttribute("aria-expanded", String(nextOpen));
        menuToggle?.setAttribute(
            "aria-label",
            nextOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación",
        );
        navigation?.classList.toggle("is-open", nextOpen);
        document.body.classList.toggle("menu-open", nextOpen);

        if (navigation) {
            const closedMobileMenu = mobileNavigation.matches && !nextOpen;
            navigation.toggleAttribute("inert", closedMobileMenu);
            if (mobileNavigation.matches) {
                navigation.setAttribute("aria-hidden", String(!nextOpen));
            } else {
                navigation.removeAttribute("aria-hidden");
            }
        }
    };

    menuToggle?.addEventListener("click", () => {
        setMenuOpen(!isMenuOpen());
    });

    navLinks.forEach((link) => link.addEventListener("click", () => {
        if (isMenuOpen()) link.blur();
        setMenuOpen(false);
    }));

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && isMenuOpen()) {
            menuToggle?.focus({ preventScroll: true });
            setMenuOpen(false);
        }
    });

    const syncMenuToViewport = () => {
        if (mobileNavigation.matches && navigation?.contains(document.activeElement)) {
            menuToggle?.focus({ preventScroll: true });
        }
        setMenuOpen(false);
    };
    if (typeof mobileNavigation.addEventListener === "function") {
        mobileNavigation.addEventListener("change", syncMenuToViewport);
    } else {
        mobileNavigation.addListener(syncMenuToViewport);
    }
    setMenuOpen(false);

    const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 12);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    const sections = [...document.querySelectorAll("main section[id]")];
    if ("IntersectionObserver" in window) {
        const activeSectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                navLinks.forEach((link) => {
                    const isActive = link.getAttribute("href") === `#${entry.target.id}`;
                    link.classList.toggle("active", isActive);
                    if (isActive) {
                        link.setAttribute("aria-current", "location");
                    } else {
                        link.removeAttribute("aria-current");
                    }
                });
            });
        }, { rootMargin: "-35% 0px -55%", threshold: 0 });

        sections.forEach((section) => activeSectionObserver.observe(section));
    }

    const revealElements = [...document.querySelectorAll(".reveal")];
    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach((element) => element.classList.add("is-visible"));
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, { rootMargin: "0px 0px -8%", threshold: 0.08 });

        revealElements.forEach((element) => revealObserver.observe(element));
    }

    const year = document.querySelector("#current-year");
    if (year) year.textContent = new Date().getFullYear();
});
