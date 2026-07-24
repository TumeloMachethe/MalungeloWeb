// =========================================
// MALUNGELO PROPERTIES — MAIN SCRIPT
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    // ── THEME TOGGLE ──────────────────────
    const toggleBtn = document.getElementById("theme-toggle");

    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-mode");
        if (toggleBtn) toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }

    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");
            const isLight = document.body.classList.contains("light-mode");
            localStorage.setItem("theme", isLight ? "light" : "dark");
            toggleBtn.innerHTML = isLight
                ? '<i class="fas fa-sun"></i>'
                : '<i class="fas fa-moon"></i>';
        });
    }

    // ── NAVBAR SCROLL EFFECT ──────────────
    const navbar = document.getElementById("navbar");
    if (navbar) {
        window.addEventListener("scroll", () => {
            navbar.classList.toggle("scrolled", window.scrollY > 60);
        });
    }

    // ── MOBILE MENU TOGGLE ────────────────
    const menuBtn = document.getElementById("menu-btn");
    const navLinks = document.getElementById("nav-links");

    if (menuBtn && navLinks) {
        menuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            navLinks.classList.toggle("active");
        });

        // Close on outside click
        document.addEventListener("click", (e) => {
            if (!navLinks.contains(e.target) && e.target !== menuBtn) {
                navLinks.classList.remove("active");
            }
        });

        // Close when a link is clicked
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
            });
        });
    }

    // ── SMOOTH SCROLL ─────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", function (e) {
            const href = this.getAttribute("href");
            if (href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    window.scrollTo({
                        top: target.offsetTop - 90,
                        behavior: "smooth"
                    });
                }
            }
        });
    });

    // ── SCROLL REVEAL ANIMATION ───────────
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".feature-box, .property-card, .gallery-container img, .gallery-item, .stat-box, .support-card, .manager, .about-box, .contact-item, .property-amenities, .property-price-row, .reviews-section").forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(32px)";
        el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(el);
    });

    // ── IMAGE SLIDER ──────────────────────
    const slides = document.querySelectorAll(".slide");
    const dotsContainer = document.getElementById("slider-dots");

    if (slides.length > 0) {
        let currentSlide = 0;

        // Build dots
        if (dotsContainer) {
            slides.forEach((_, i) => {
                const dot = document.createElement("div");
                dot.classList.add("dot");
                if (i === 0) dot.classList.add("active");
                dot.addEventListener("click", () => goToSlide(i));
                dotsContainer.appendChild(dot);
            });
        }

        function goToSlide(index) {
            slides[currentSlide].classList.remove("active");
            if (dotsContainer) dotsContainer.children[currentSlide].classList.remove("active");
            currentSlide = index;
            slides[currentSlide].classList.add("active");
            if (dotsContainer) dotsContainer.children[currentSlide].classList.add("active");
        }

        function nextSlide() {
            goToSlide((currentSlide + 1) % slides.length);
        }

        setInterval(nextSlide, 4500);
    }

    // ── REDUCED MOTION CHECK ──────────────
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;

    // ── BACK TO TOP BUTTON ─────────────────
    const backToTop = document.getElementById("back-to-top");
    if (backToTop) {
        window.addEventListener("scroll", () => {
            backToTop.classList.toggle("visible", window.scrollY > 400);
        });
        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // ── TILT + SPOTLIGHT ON CARDS ──────────
    if (!isTouchDevice && !prefersReducedMotion) {
        const tiltCards = document.querySelectorAll(".property-card, .feature-box, .manager, .support-card, .stat-box");
        tiltCards.forEach((card) => {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -4;
                const rotateY = ((x - centerX) / centerX) * 4;

                card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
                card.style.setProperty("--spot-x", `${(x / rect.width) * 100}%`);
                card.style.setProperty("--spot-y", `${(y / rect.height) * 100}%`);
            });

            card.addEventListener("mouseleave", () => {
                card.style.transform = "";
            });
        });
    }

    // ── BUTTON RIPPLE EFFECT ───────────────
    const rippleTargets = document.querySelectorAll(".btn-primary, button, .hero-btn, .apply-btn, .apply-float-btn");
    rippleTargets.forEach((btn) => {
        btn.addEventListener("click", function (e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement("span");
            const size = Math.max(rect.width, rect.height);
            ripple.classList.add("ripple");
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 650);
        });
    });

    // ── TYPEWRITER HERO EYEBROW ────────────
    if (!prefersReducedMotion) {
        document.querySelectorAll(".hero-eyebrow").forEach((el) => {
            const fullText = el.textContent.trim();
            el.textContent = "";
            el.classList.add("typing");
            let i = 0;
            const type = () => {
                if (i <= fullText.length) {
                    el.textContent = fullText.slice(0, i);
                    i++;
                    setTimeout(type, 35);
                } else {
                    setTimeout(() => el.classList.remove("typing"), 1200);
                }
            };
            type();
        });
    }

    // ── ANIMATED STAT COUNTERS ─────────────
    const statBoxes = document.querySelectorAll(".stat-box h3");
    if (statBoxes.length) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const raw = el.textContent.trim();
                const match = raw.match(/^(\d+)(.*)$/);
                if (!match) return;
                const target = parseInt(match[1], 10);
                const suffix = match[2];
                let current = 0;
                const duration = 1200;
                const steps = 40;
                const increment = target / steps;
                const stepTime = duration / steps;

                const tick = () => {
                    current += increment;
                    if (current >= target) {
                        el.textContent = target + suffix;
                    } else {
                        el.textContent = Math.floor(current) + suffix;
                        setTimeout(tick, stepTime);
                    }
                };
                tick();
                counterObserver.unobserve(el);
            });
        }, { threshold: 0.4 });

        statBoxes.forEach((el) => counterObserver.observe(el));
    }

    // ── CONFETTI ON THANK-YOU PAGE ─────────
    if (document.querySelector(".thankyou-section") && !prefersReducedMotion) {
        const canvas = document.createElement("canvas");
        canvas.id = "confetti-canvas";
        document.body.appendChild(canvas);
        const ctx = canvas.getContext("2d");

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        const colors = ["#d4a437", "#ffffff", "#f4f6fb", "#4caf50"];
        const pieces = Array.from({ length: 140 }, () => ({
            x: Math.random() * canvas.width,
            y: -20 - Math.random() * canvas.height * 0.5,
            size: 6 + Math.random() * 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: 2 + Math.random() * 3,
            speedX: (Math.random() - 0.5) * 2,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 8
        }));

        let elapsed = 0;
        const totalDuration = 3200;

        function drawConfetti(timestamp) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pieces.forEach((p) => {
                p.y += p.speedY;
                p.x += p.speedX;
                p.rotation += p.rotationSpeed;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
                ctx.restore();
            });

            elapsed += 16;
            if (elapsed < totalDuration) {
                requestAnimationFrame(drawConfetti);
            } else {
                canvas.style.transition = "opacity 0.6s ease";
                canvas.style.opacity = "0";
                setTimeout(() => canvas.remove(), 700);
            }
        }

        requestAnimationFrame(drawConfetti);
    }

    console.log("Malungelo Properties — Website Loaded ✓");
});

// =========================================
// APPLICATION FORM — VALIDATION + EMAILJS
// =========================================

const applicationForm = document.querySelector(".application-form");

if (applicationForm) {

    const formFields = applicationForm.querySelectorAll("input, select, textarea");

    // Live validation as the user types/leaves a field
    formFields.forEach((field) => {
        field.addEventListener("input", () => validateField(field));
        field.addEventListener("blur", () => validateField(field));
    });

    function validateField(field) {
        const errorSpan = field.parentElement.querySelector(".error-message");
        if (!errorSpan) return true;

        if (!field.checkValidity()) {
            errorSpan.textContent = field.validationMessage;
            field.classList.add("invalid");
            return false;
        } else {
            errorSpan.textContent = "";
            field.classList.remove("invalid");
            return true;
        }
    }

    function validateAllFields() {
        let allValid = true;
        formFields.forEach((field) => {
            if (!validateField(field)) {
                allValid = false;
            }
        });
        return allValid;
    }

    applicationForm.addEventListener("submit", function (e) {

        // Always prevent the default submit first — we control it manually below
        e.preventDefault();

        // Run validation. If anything fails, stop here and show the errors.
        if (!validateAllFields()) {
            const firstInvalid = applicationForm.querySelector(".invalid");
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
                firstInvalid.focus();
            }
            return;
        }

        // Validation passed — send the auto-reply email, then submit the form
        emailjs.send(
            "service_b0y6eai",
            "template_4mczepm",
            {
                first_name: document.getElementById("firstName").value,
                email: document.getElementById("email").value
            }
        )
        .then(function () {
            applicationForm.submit();
        })
        .catch(function (error) {
            console.log(error);
            applicationForm.submit();
        });

    });

}
