// =========================================
// MALUNGELO PROPERTIES — MAIN SCRIPT
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    // ── PAGE LOADER ───────────────────────
    // It disappears as soon as the page is usable. The fallback prevents a
    // slow third-party image or font from ever trapping a visitor on the loader.
    const pageLoader = document.getElementById("page-loader");
    const hidePageLoader = () => {
        if (!pageLoader) return;
        pageLoader.classList.add("is-hidden");
        window.setTimeout(() => pageLoader.remove(), 420);
    };
    window.addEventListener("load", hidePageLoader, { once: true });
    window.setTimeout(hidePageLoader, 3500);

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
        navbar.classList.toggle("scrolled", window.scrollY > 60);
        window.addEventListener("scroll", () => {
            navbar.classList.toggle("scrolled", window.scrollY > 60);
        }, { passive: true });
    }

    // ── MOBILE MENU TOGGLE ────────────────
    const menuBtn = document.getElementById("menu-btn");
    const navLinks = document.getElementById("nav-links");

    if (menuBtn && navLinks) {
        menuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            navLinks.classList.toggle("active");
            menuBtn.setAttribute("aria-expanded", navLinks.classList.contains("active"));
        });

        // Close on outside click
        document.addEventListener("click", (e) => {
            if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
                navLinks.classList.remove("active");
                menuBtn.setAttribute("aria-expanded", "false");
            }
        });

        // Close when a link is clicked
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                menuBtn.setAttribute("aria-expanded", "false");
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
        let slideTimer;

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

        function previousSlide() {
            goToSlide((currentSlide - 1 + slides.length) % slides.length);
        }

        function startSlider() {
            clearInterval(slideTimer);
            slideTimer = setInterval(nextSlide, 4500);
        }

        // Add clear touch-friendly controls without changing the HTML structure.
        const slider = slides[0].closest('.slider');
        if (slider) {
            const controls = document.createElement('div');
            controls.className = 'slider-controls';
            controls.innerHTML = `
                <button type="button" class="slider-arrow slider-prev" aria-label="Previous slide"><i class="fas fa-chevron-left"></i></button>
                <button type="button" class="slider-arrow slider-next" aria-label="Next slide"><i class="fas fa-chevron-right"></i></button>`;
            slider.appendChild(controls);

            controls.querySelector('.slider-prev').addEventListener('click', () => {
                previousSlide();
                startSlider();
            });
            controls.querySelector('.slider-next').addEventListener('click', () => {
                nextSlide();
                startSlider();
            });

            let touchStartX = 0;
            slider.addEventListener('touchstart', (event) => {
                touchStartX = event.changedTouches[0].screenX;
            }, { passive: true });
            slider.addEventListener('touchend', (event) => {
                const distance = event.changedTouches[0].screenX - touchStartX;
                if (Math.abs(distance) < 45) return;
                distance < 0 ? nextSlide() : previousSlide();
                startSlider();
            }, { passive: true });
        }

        startSlider();
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
// SITE-WIDE LEGAL FOOTER LINKS
// =========================================
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("footer .footer-inner").forEach((footerInner) => {
        // apply.html already contains the legal links in its markup.
        if (footerInner.querySelector(".footer-legal")) return;

        const existingCopy = footerInner.querySelector(".footer-copy");
        const footerMiddle = document.createElement("div");
        footerMiddle.className = "footer-middle";

        if (existingCopy) {
            existingCopy.parentNode.insertBefore(footerMiddle, existingCopy);
            footerMiddle.appendChild(existingCopy);
        } else {
            const copy = document.createElement("p");
            copy.className = "footer-copy";
            copy.innerHTML = "&copy; 2026 Malungelo Properties. All rights reserved.";
            footerMiddle.appendChild(copy);
            const socials = footerInner.querySelector(".footer-socials");
            footerInner.insertBefore(footerMiddle, socials || null);
        }

        const legal = document.createElement("div");
        legal.className = "footer-legal";
        legal.setAttribute("aria-label", "Legal links");
        legal.innerHTML = `
            <a href="terms.html">Terms & Conditions</a>
            <a href="privacy.html">Privacy Policy</a>
            <a href="residence-rules.html">Residence Rules</a>
            <a href="cancellation-policy.html">Cancellation Policy</a>
        `;
        footerMiddle.appendChild(legal);
    });
});

// =========================================
// APPLICATION FORM — VALIDATION + FORMSUBMIT + MAKE.COM
// =========================================
const applicationForm = document.querySelector(".application-form");

if (applicationForm) {

    // Make.com webhook — receives the full application and pushes it into
    // the Excel Online "ApplicationsTable" via the connected scenario.
    const MAKE_WEBHOOK_URL = "https://hook.eu1.make.com/7kaaarv1zlnxla6b7a3ll790ctsvazyf";

    const formFields = applicationForm.querySelectorAll("input, select, textarea");

    function getFieldContainer(field) {
        return field.closest(".form-group, .form-checkbox") || field.parentElement;
    }

    function validateField(field) {
        if (!field || field.type === "hidden") return true;

        const container = getFieldContainer(field);
        const errorSpan = container ? container.querySelector(".error-message") : null;
        const isValid = field.checkValidity();

        if (!isValid) {
            let message = field.validationMessage || "Please complete this field.";
            if (field.type === "checkbox" && field.required && !field.checked) {
                message = "Please tick this box before submitting.";
            }
            if (errorSpan) errorSpan.textContent = message;
            field.classList.add("invalid");
            if (container) container.classList.add("has-error");
            return false;
        }

        if (errorSpan) errorSpan.textContent = "";
        field.classList.remove("invalid");
        if (container) container.classList.remove("has-error");
        return true;
    }

    // Live validation
    formFields.forEach((field) => {
        if (field.type === "hidden") return;
        field.addEventListener("input", () => validateField(field));
        field.addEventListener("change", () => validateField(field));
        field.addEventListener("blur", () => validateField(field));
    });

    function validateAllFields() {
        let allValid = true;
        formFields.forEach((field) => {
            if (!validateField(field)) allValid = false;
        });
        return allValid;
    }

    // ── APPLICATION DECLARATION MODAL ─────
    const confirmBox = document.getElementById("confirm");
    const declarationModal = document.getElementById("declaration-modal");
    const declarationAgree = document.getElementById("declaration-agree");
    const declarationProceed = document.getElementById("declaration-proceed");
    const declarationClose = document.getElementById("declaration-close");
    const declarationCancel = document.getElementById("declaration-cancel");
    const openDeclarationButton = document.getElementById("open-declaration");

    if (confirmBox && declarationModal && declarationAgree && declarationProceed) {
        const closeDeclaration = () => {
            declarationModal.classList.remove("is-open");
            declarationModal.setAttribute("aria-hidden", "true");
            declarationAgree.checked = false;
            declarationProceed.disabled = true;
            document.body.classList.remove("modal-open");
        };

        const openDeclaration = () => {
            declarationModal.classList.add("is-open");
            declarationModal.setAttribute("aria-hidden", "false");
            declarationAgree.checked = false;
            declarationProceed.disabled = true;
            document.body.classList.add("modal-open");
            window.setTimeout(() => declarationAgree.focus(), 50);
        };

        confirmBox.addEventListener("change", () => {
            if (confirmBox.checked && confirmBox.dataset.declarationAccepted !== "true") {
                confirmBox.checked = false;
                openDeclaration();
            }
            validateField(confirmBox);
        });

        if (openDeclarationButton) {
            openDeclarationButton.addEventListener("click", openDeclaration);
        }

        declarationAgree.addEventListener("change", () => {
            declarationProceed.disabled = !declarationAgree.checked;
        });

        declarationProceed.addEventListener("click", () => {
            confirmBox.dataset.declarationAccepted = "true";
            confirmBox.checked = true;
            validateField(confirmBox);
            closeDeclaration();
            confirmBox.focus();
        });

        [declarationClose, declarationCancel].forEach((button) => {
            if (button) button.addEventListener("click", closeDeclaration);
        });

        declarationModal.addEventListener("click", (event) => {
            if (event.target === declarationModal) closeDeclaration();
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && declarationModal.classList.contains("is-open")) {
                closeDeclaration();
            }
        });
    }

    // ── TERMS & POLICIES REVIEW MODAL ─────
    const legalAcceptBox = document.getElementById("legalAccept");
    const termsModal = document.getElementById("terms-modal");
    const termsAgree = document.getElementById("terms-agree");
    const termsProceed = document.getElementById("terms-modal-proceed");
    const termsClose = document.getElementById("terms-modal-close");
    const termsCancel = document.getElementById("terms-modal-cancel");
    const openTermsReviewButton = document.getElementById("open-terms-review");

    if (legalAcceptBox && termsModal && termsAgree && termsProceed) {
        const closeTermsModal = () => {
            termsModal.classList.remove("is-open");
            termsModal.setAttribute("aria-hidden", "true");
            termsAgree.checked = false;
            termsProceed.disabled = true;
            document.body.classList.remove("modal-open");
        };

        const openTermsModal = () => {
            termsModal.classList.add("is-open");
            termsModal.setAttribute("aria-hidden", "false");
            termsAgree.checked = false;
            termsProceed.disabled = true;
            document.body.classList.add("modal-open");
            window.setTimeout(() => termsAgree.focus(), 50);
        };

        legalAcceptBox.addEventListener("change", () => {
            if (legalAcceptBox.checked && legalAcceptBox.dataset.termsAccepted !== "true") {
                legalAcceptBox.checked = false;
                openTermsModal();
            }
            validateField(legalAcceptBox);
        });

        if (openTermsReviewButton) {
            openTermsReviewButton.addEventListener("click", openTermsModal);
        }

        termsAgree.addEventListener("change", () => {
            termsProceed.disabled = !termsAgree.checked;
        });

        termsProceed.addEventListener("click", () => {
            legalAcceptBox.dataset.termsAccepted = "true";
            legalAcceptBox.checked = true;
            validateField(legalAcceptBox);
            closeTermsModal();
            legalAcceptBox.focus();
        });

        [termsClose, termsCancel].forEach((button) => {
            if (button) button.addEventListener("click", closeTermsModal);
        });

        termsModal.addEventListener("click", (event) => {
            if (event.target === termsModal) closeTermsModal();
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && termsModal.classList.contains("is-open")) {
                closeTermsModal();
            }
        });
    }

    // Grabs every named field and turns it into a plain JSON object.
    function collectAllFormDataAsJSON(form) {
        const data = {};
        new FormData(form).forEach((value, key) => {
            data[key] = value;
        });
        data["Submitted At"] = new Date().toISOString();
        return data;
    }

    function sendToMake(form) {
        if (!MAKE_WEBHOOK_URL) return;

        const payload = collectAllFormDataAsJSON(form);

        fetch(MAKE_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            keepalive: true
        }).catch(() => {
            // Do not block the FormSubmit email if the automation endpoint is unavailable.
            console.warn("Malungelo Properties: could not reach Make.com webhook.");
        });
    }

    // ── DOUBLE-SUBMIT PROTECTION ──────────
    const submitBtn = applicationForm.querySelector('button[type="submit"], input[type="submit"]');
    const consentTimestamp = document.getElementById("consentAcceptedAt");
    let isSubmitting = false;

    applicationForm.addEventListener("submit", function (e) {
        e.preventDefault();

        if (isSubmitting) return;

        if (!validateAllFields()) {
            const firstInvalid = applicationForm.querySelector(".invalid");
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
                firstInvalid.focus({ preventScroll: true });
            }
            return;
        }

        // Record the exact submission/acceptance time in both FormSubmit and Make.
        if (consentTimestamp) {
            consentTimestamp.value = new Date().toISOString();
        }

        isSubmitting = true;

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.dataset.originalHtml = submitBtn.dataset.originalHtml || submitBtn.innerHTML;
            submitBtn.innerHTML = 'Submitting... <i class="fas fa-spinner fa-spin"></i>';
        }

        sendToMake(applicationForm);

        // Safety net if FormSubmit fails to navigate away.
        setTimeout(() => {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = submitBtn.dataset.originalHtml;
            }
            isSubmitting = false;
        }, 15000);

        // Deliberately call the native submit method after our validation and tracking.
        applicationForm.submit();
    });
}
