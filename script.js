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

    document.querySelectorAll(".feature-box, .property-card, .gallery-container img, .gallery-item, .stat-box, .support-card, .manager, .about-box, .contact-item, .property-amenities, .property-price-row, .reviews-section, .people-slider").forEach(el => {
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

    // ── MEET THE STUDENTS SLIDESHOW ───────
    // Slide order: 0 = Palesa Tumane (Property Manager), 1 = Lisa Matu, 2 = Misokuhle Sogiba.
    // The manager's slide (index 0) is always what plays first — both on page load
    // and every time the visitor scrolls this section into view.
    const peopleSlides = document.querySelectorAll(".people-slide");
    const peopleDotsContainer = document.getElementById("people-dots");
    const peoplePrevBtn = document.getElementById("people-prev");
    const peopleNextBtn = document.getElementById("people-next");
    const peopleSection = document.getElementById("meet-students");

    if (peopleSlides.length > 0) {
        let peopleCurrent = 0;
        let peopleTimer;

        if (peopleDotsContainer) {
            peopleSlides.forEach((_, i) => {
                const dot = document.createElement("div");
                dot.classList.add("dot");
                if (i === 0) dot.classList.add("active");
                dot.addEventListener("click", () => {
                    goToPeopleSlide(i);
                    resetPeopleTimer();
                });
                peopleDotsContainer.appendChild(dot);
            });
        }

        function goToPeopleSlide(index) {
            peopleSlides[peopleCurrent].classList.remove("active");
            if (peopleDotsContainer) peopleDotsContainer.children[peopleCurrent].classList.remove("active");
            peopleCurrent = (index + peopleSlides.length) % peopleSlides.length;
            peopleSlides[peopleCurrent].classList.add("active");
            if (peopleDotsContainer) peopleDotsContainer.children[peopleCurrent].classList.add("active");
        }

        function resetPeopleTimer() {
            clearInterval(peopleTimer);
            peopleTimer = setInterval(() => goToPeopleSlide(peopleCurrent + 1), 4000);
        }

        if (peoplePrevBtn) {
            peoplePrevBtn.addEventListener("click", () => {
                goToPeopleSlide(peopleCurrent - 1);
                resetPeopleTimer();
            });
        }

        if (peopleNextBtn) {
            peopleNextBtn.addEventListener("click", () => {
                goToPeopleSlide(peopleCurrent + 1);
                resetPeopleTimer();
            });
        }

        resetPeopleTimer();

        // Every time the section scrolls into view, jump back to the manager's
        // slide (index 0) and restart the auto-play timer from there.
        if (peopleSection) {
            const peopleSectionObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        goToPeopleSlide(0);
                        resetPeopleTimer();
                    }
                });
            }, { threshold: 0.4 });

            peopleSectionObserver.observe(peopleSection);
        }
    }

    // ── IMAGE LIGHTBOX / ZOOM VIEWER ──────
    (function setupLightbox() {
        // Group images by their containing gallery so prev/next stays within that set
        const galleries = document.querySelectorAll(".gallery-container");
        if (!galleries.length) return;

        let currentImages = [];
        let currentIndex = 0;
        let scale = 1;
        let originX = 0, originY = 0;
        let isDragging = false;
        let dragStartX = 0, dragStartY = 0;
        let startOriginX = 0, startOriginY = 0;

        const MIN_SCALE = 1;
        const MAX_SCALE = 4;

        // Build overlay markup once
        const overlay = document.createElement("div");
        overlay.className = "lightbox-overlay";
        overlay.innerHTML = `
            <div class="lightbox-counter" id="lb-counter"></div>
            <button class="lightbox-close" id="lb-close" aria-label="Close"><i class="fas fa-times"></i></button>
            <button class="lightbox-nav prev" id="lb-prev" aria-label="Previous image"><i class="fas fa-chevron-left"></i></button>
            <div class="lightbox-stage" id="lb-stage">
                <img id="lb-image" src="" alt="">
            </div>
            <button class="lightbox-nav next" id="lb-next" aria-label="Next image"><i class="fas fa-chevron-right"></i></button>
            <div class="lightbox-hint">Scroll or pinch to zoom · drag to pan</div>
            <div class="lightbox-controls">
                <button class="lightbox-btn" id="lb-zoom-out" aria-label="Zoom out"><i class="fas fa-minus"></i></button>
                <span class="lightbox-zoom-level" id="lb-zoom-level">100%</span>
                <button class="lightbox-btn" id="lb-zoom-in" aria-label="Zoom in"><i class="fas fa-plus"></i></button>
                <button class="lightbox-btn" id="lb-reset" aria-label="Reset zoom"><i class="fas fa-compress"></i></button>
            </div>
        `;
        document.body.appendChild(overlay);

        const stage = overlay.querySelector("#lb-stage");
        const imgEl = overlay.querySelector("#lb-image");
        const counterEl = overlay.querySelector("#lb-counter");
        const zoomLevelEl = overlay.querySelector("#lb-zoom-level");

        function applyTransform() {
            imgEl.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
            stage.classList.toggle("zoomed", scale > 1);
            zoomLevelEl.textContent = Math.round(scale * 100) + "%";
        }

        function resetZoom() {
            scale = 1;
            originX = 0;
            originY = 0;
            applyTransform();
        }

        function clampPan() {
            // Simple clamp so the image can't be dragged wildly off-stage
            const maxOffset = (scale - 1) * 260;
            originX = Math.max(-maxOffset, Math.min(maxOffset, originX));
            originY = Math.max(-maxOffset, Math.min(maxOffset, originY));
        }

        function loadImage(index) {
            currentIndex = (index + currentImages.length) % currentImages.length;
            const target = currentImages[currentIndex];
            imgEl.src = target.src;
            imgEl.alt = target.alt || "";
            counterEl.textContent = `${currentIndex + 1} / ${currentImages.length}`;
            resetZoom();
        }

        function openLightbox(images, startIndex) {
            currentImages = images;
            loadImage(startIndex);
            overlay.classList.add("active");
            document.body.style.overflow = "hidden";
        }

        function closeLightbox() {
            overlay.classList.remove("active");
            document.body.style.overflow = "";
            resetZoom();
        }

        // Wire up every gallery's images
        galleries.forEach((gallery) => {
            const images = Array.from(gallery.querySelectorAll("img"));
            images.forEach((img, idx) => {
                img.addEventListener("click", () => openLightbox(images, idx));
            });
        });

        overlay.querySelector("#lb-close").addEventListener("click", closeLightbox);
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) closeLightbox();
        });

        overlay.querySelector("#lb-prev").addEventListener("click", () => loadImage(currentIndex - 1));
        overlay.querySelector("#lb-next").addEventListener("click", () => loadImage(currentIndex + 1));

        overlay.querySelector("#lb-zoom-in").addEventListener("click", () => {
            scale = Math.min(MAX_SCALE, scale + 0.5);
            clampPan();
            applyTransform();
        });
        overlay.querySelector("#lb-zoom-out").addEventListener("click", () => {
            scale = Math.max(MIN_SCALE, scale - 0.5);
            if (scale === 1) { originX = 0; originY = 0; }
            clampPan();
            applyTransform();
        });
        overlay.querySelector("#lb-reset").addEventListener("click", resetZoom);

        // Scroll wheel to zoom, centered roughly on cursor
        stage.addEventListener("wheel", (e) => {
            if (!overlay.classList.contains("active")) return;
            e.preventDefault();
            const delta = e.deltaY < 0 ? 0.25 : -0.25;
            scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale + delta));
            if (scale === 1) { originX = 0; originY = 0; }
            clampPan();
            applyTransform();
        }, { passive: false });

        // Double click / double tap to toggle zoom
        imgEl.addEventListener("dblclick", () => {
            if (scale > 1) {
                resetZoom();
            } else {
                scale = 2.5;
                applyTransform();
            }
        });

        // Drag to pan when zoomed in (mouse)
        stage.addEventListener("mousedown", (e) => {
            if (scale <= 1) return;
            isDragging = true;
            stage.classList.add("dragging");
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            startOriginX = originX;
            startOriginY = originY;
        });
        window.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            originX = startOriginX + (e.clientX - dragStartX);
            originY = startOriginY + (e.clientY - dragStartY);
            clampPan();
            applyTransform();
        });
        window.addEventListener("mouseup", () => {
            isDragging = false;
            stage.classList.remove("dragging");
        });

        // Touch support: single-finger pan when zoomed, pinch to zoom
        let pinchStartDist = null;
        let pinchStartScale = 1;

        function touchDist(touches) {
            const dx = touches[0].clientX - touches[1].clientX;
            const dy = touches[0].clientY - touches[1].clientY;
            return Math.hypot(dx, dy);
        }

        stage.addEventListener("touchstart", (e) => {
            if (e.touches.length === 2) {
                pinchStartDist = touchDist(e.touches);
                pinchStartScale = scale;
            } else if (e.touches.length === 1 && scale > 1) {
                isDragging = true;
                dragStartX = e.touches[0].clientX;
                dragStartY = e.touches[0].clientY;
                startOriginX = originX;
                startOriginY = originY;
            }
        }, { passive: true });

        stage.addEventListener("touchmove", (e) => {
            if (e.touches.length === 2 && pinchStartDist) {
                e.preventDefault();
                const newDist = touchDist(e.touches);
                scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, pinchStartScale * (newDist / pinchStartDist)));
                clampPan();
                applyTransform();
            } else if (e.touches.length === 1 && isDragging) {
                originX = startOriginX + (e.touches[0].clientX - dragStartX);
                originY = startOriginY + (e.touches[0].clientY - dragStartY);
                clampPan();
                applyTransform();
            }
        }, { passive: false });

        stage.addEventListener("touchend", () => {
            isDragging = false;
            pinchStartDist = null;
        });

        // Keyboard controls
        document.addEventListener("keydown", (e) => {
            if (!overlay.classList.contains("active")) return;
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft") loadImage(currentIndex - 1);
            if (e.key === "ArrowRight") loadImage(currentIndex + 1);
            if (e.key === "+" || e.key === "=") {
                scale = Math.min(MAX_SCALE, scale + 0.5);
                clampPan();
                applyTransform();
            }
            if (e.key === "-" || e.key === "_") {
                scale = Math.max(MIN_SCALE, scale - 0.5);
                if (scale === 1) { originX = 0; originY = 0; }
                clampPan();
                applyTransform();
            }
        });
    })();

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
// APPLICATION FORM — VALIDATION + FORMSUBMIT + ZAPIER TRACKER
// =========================================

const applicationForm = document.querySelector(".application-form");

if (applicationForm) {

    // Make.com webhook — receives the full application and pushes it into
    // the Excel Online "ApplicationsTable" via the connected scenario.
    const MAKE_WEBHOOK_URL = "https://hook.eu1.make.com/7kaaarv1zlnxla6b7a3ll790ctsvazyf";

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

    // Grabs EVERY field currently on the form by its "name" attribute and
    // turns it into a plain JSON object. This is dynamic — if fields are
    // ever added, removed, or renamed on the form, this automatically
    // picks up the change with zero edits needed here. (Just remember: if
    // you add a brand-new field later, you'll still need to map it to a
    // column inside your Zapier step — this only handles the "sending" side.)
    function collectAllFormDataAsJSON(form) {
        const data = {};
        new FormData(form).forEach((value, key) => {
            data[key] = value;
        });
        // Add a server-side-friendly timestamp so Zapier/Excel has a
        // reliable "Date Received" value without relying on the browser clock.
        data["Submitted At"] = new Date().toISOString();
        return data;
    }

    // Fires a background copy of the full form to the Make.com webhook.
    // "keepalive: true" lets this request finish even though the page is
    // about to navigate away to FormSubmit's thank-you redirect.
    function sendToMake(form) {
        if (!MAKE_WEBHOOK_URL) return; // not configured yet — skip silently

        const payload = collectAllFormDataAsJSON(form);

        fetch(MAKE_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            keepalive: true
        }).catch(() => {
            // Never block or interrupt the applicant's submission if this fails —
            // the FormSubmit email is still the reliable fallback record.
            console.warn("Malungelo Properties: could not reach Make.com webhook.");
        });
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

        // Send the full application to Make.com (which pushes it into Excel Online)
        sendToMake(applicationForm);

        // Then continue on to FormSubmit as before — email still sends normally.
        applicationForm.submit();

    });

}
