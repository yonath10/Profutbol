document.addEventListener('DOMContentLoaded', () => {

    // -------------------- Loader --------------------
    const loaderWrapper = document.getElementById("loader-wrapper");

    if (loaderWrapper) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loaderWrapper.classList.add("hidden");
                loaderWrapper.addEventListener('transitionend', () => {
                    loaderWrapper.remove();
                });
            }, 1000); // Espera para mostrar animación
        });
    }

    // -------------------- Hero Parallax --------------------
    const heroSection = document.querySelector('.hero-home-redesigned');

    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            heroSection.style.backgroundPositionY = `${-scrollY * 0.3}px`;
        });
    }

    // -------------------- Smooth Scroll (Anclas) --------------------
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            const navbar = document.querySelector('.navbar');

            if (target && navbar) {
                const offset = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight;

                window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });

                history.pushState ? history.pushState(null, null, targetId) : window.location.hash = targetId;
            }
        });
    });

    // -------------------- Navbar Scroll Behavior --------------------
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        const navLinks = navbar.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            navbar.classList.toggle('navbar-scrolled', window.scrollY > 50);
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                const navbarCollapse = navbar.querySelector('.navbar-collapse');
                const toggler = navbar.querySelector('.navbar-toggler');

                if (navbarCollapse?.classList.contains('show') && toggler) {
                    toggler.click(); // Cierra el menú colapsado
                }
            });
        });
    }

    // -------------------- Botón "Volver Arriba" --------------------
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            backToTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // -------------------- Animaciones con Intersection Observer --------------------
    const animatedSections = document.querySelectorAll('.fade-in-section');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle('visible', entry.isIntersecting);
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    animatedSections.forEach(section => sectionObserver.observe(section));

    // -------------------- Contadores Animados --------------------
    const counters = document.querySelectorAll('.counter-number');
    const animationSpeed = 200;

    const animateCounter = (counter) => {
        const target = parseInt(counter.dataset.count, 10);
        let current = 0;
        const increment = target / animationSpeed;

        const update = () => {
            if (current < target) {
                current += increment;
                counter.innerText = Math.ceil(current);
                setTimeout(update, 1);
            } else {
                counter.innerText = target;
            }
        };

        update();
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // -------------------- Carrusel de Testimonios --------------------
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.testimonial-button.prev');
    const nextBtn = document.querySelector('.testimonial-button.next');
    let currentIndex = 0;

    const showSlide = (index) => {
        testimonialSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    };

    const changeSlide = (delta) => {
        currentIndex = (currentIndex + delta + testimonialSlides.length) % testimonialSlides.length;
        showSlide(currentIndex);
    };

    if (testimonialSlides.length > 0) {
        showSlide(currentIndex);

        prevBtn?.addEventListener('click', () => changeSlide(-1));
        nextBtn?.addEventListener('click', () => changeSlide(1));

        setInterval(() => changeSlide(1), 7000); // Auto-slide
    }

    // -------------------- Fancybox (Galería) --------------------
    if (typeof Fancybox !== 'undefined') {
        Fancybox.bind("[data-fancybox='gallery']", {
            caption: (fancybox, carousel, slide) =>
                `<div class="fancybox__caption">${slide.caption || slide.dataset.caption || ""}</div>`
        });
    } else {
        console.warn("Fancybox no está cargado.");
    }

    // -------------------- Validación del Formulario --------------------
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            if (!contactForm.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            } else {
                const successMsg = document.querySelector('.form-success-message');
                if (successMsg) successMsg.style.display = 'block';
            }

            contactForm.classList.add('was-validated');
        }, false);
    }

    // -------------------- Copiar al Portapapeles --------------------
    const copyElements = document.querySelectorAll('[data-copy]');

    const showCopyFeedback = (el) => {
        const feedback = document.createElement('span');
        feedback.className = 'copy-feedback';
        feedback.textContent = '¡Copiado!';
        el.parentNode.appendChild(feedback);

        setTimeout(() => {
            feedback.classList.add('fade-out');
            setTimeout(() => feedback.remove(), 500);
        }, 1500);
    };

    copyElements.forEach(el => {
        el.addEventListener('click', async (e) => {
            e.preventDefault();
            const text = el.getAttribute('data-copy') || el.textContent.trim();

            try {
                await navigator.clipboard.writeText(text);
                showCopyFeedback(el);
            } catch {
                // Fallback para navegadores antiguos
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showCopyFeedback(el);
            }
        });
    });

});


/* ==========================================================================
   FUNCIONALIDAD DEL BANNER DE COOKIES (CON ACEPTAR/RECHAZAR)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies-btn');
    const rejectCookiesBtn = document.getElementById('reject-cookies-btn'); // Nuevo botón

    // Si no encontramos los elementos, no hacemos nada.
    if (!cookieBanner || !acceptCookiesBtn || !rejectCookiesBtn) {
        return;
    }

    // Comprobamos si ya se ha tomado una decisión (aceptado o rechazado)
    const consentGiven = localStorage.getItem('cookie_consent');

    // Si no hay una decisión guardada, mostramos el banner
    if (!consentGiven) {
        cookieBanner.classList.add('show');
    }
    
    // Función para manejar el consentimiento y ocultar el banner
    const handleConsent = (consentType) => {
        // Guardamos el tipo de consentimiento ('accepted' o 'rejected')
        localStorage.setItem('cookie_consent', consentType);
        
        // Ocultamos el banner con una animación
        cookieBanner.style.opacity = '0';
        cookieBanner.style.transform = 'translateY(100%)';
        
        // Esperamos a que termine la animación para quitarlo del todo
        setTimeout(() => {
            cookieBanner.style.display = 'none';
        }, 500);
    };

    // Event listener para el botón de ACEPTAR
    acceptCookiesBtn.addEventListener('click', () => {
        handleConsent('accepted');
    });

    // Event listener para el botón de RECHAZAR
    rejectCookiesBtn.addEventListener('click', () => {
        handleConsent('rejected');
    });
});