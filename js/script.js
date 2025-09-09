// ==========================================================================
// PROFUTBOL JC - JAVASCRIPT MEJORADO
// Optimizado para Performance, Accesibilidad y SEO
// ==========================================================================

(function() {
    'use strict';

    // ==========================================================================
    // UTILIDADES Y HELPERS
    // ==========================================================================

    const Utils = {
        // Throttle function para optimizar eventos de scroll/resize
        throttle: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Debounce para eventos que se disparan muy frecuentemente
        debounce: function(func, wait, immediate) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    timeout = null;
                    if (!immediate) func(...args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func(...args);
            };
        },

        // Detectar si el usuario prefiere movimiento reducido
        prefersReducedMotion: function() {
            return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        },

        // Detectar si es dispositivo móvil
        isMobile: function() {
            return window.matchMedia('(max-width: 767px)').matches;
        },

        // Smooth scroll con fallback para navegadores antiguos
        smoothScrollTo: function(element, offset = 80) {
            if (!element) return;

            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            if ('scrollBehavior' in document.documentElement.style) {
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            } else {
                // Fallback para navegadores sin soporte nativo
                const startPosition = window.pageYOffset;
                const distance = offsetPosition - startPosition;
                const duration = 800;
                let start = null;

                function animation(currentTime) {
                    if (start === null) start = currentTime;
                    const timeElapsed = currentTime - start;
                    const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
                    window.scrollTo(0, run);
                    if (timeElapsed < duration) requestAnimationFrame(animation);
                }

                function easeInOutQuad(t, b, c, d) {
                    t /= d / 2;
                    if (t < 1) return c / 2 * t * t + b;
                    t--;
                    return -c / 2 * (t * (t - 2) - 1) + b;
                }

                requestAnimationFrame(animation);
            }
        }
    };

    // ==========================================================================
    // GESTIÓN DE COOKIES Y PRIVACIDAD
    // ==========================================================================

    const CookieManager = {
        banner: null,
        acceptBtn: null,
        rejectBtn: null,

        init: function() {
            this.banner = document.getElementById('cookie-banner');
            this.acceptBtn = document.getElementById('accept-cookies');
            this.rejectBtn = document.getElementById('reject-cookies');

            if (!this.banner) return;

            this.bindEvents();
            this.checkConsent();
        },

        bindEvents: function() {
            if (this.acceptBtn) {
                this.acceptBtn.addEventListener('click', () => {
                    this.acceptCookies();
                    this.trackEvent('cookie_consent', { consent_status: 'accepted' });
                });
            }

            if (this.rejectBtn) {
                this.rejectBtn.addEventListener('click', () => {
                    this.rejectCookies();
                    this.trackEvent('cookie_consent', { consent_status: 'rejected' });
                });
            }

            // Cerrar con Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.banner.classList.contains('show')) {
                    this.rejectCookies();
                }
            });
        },

        checkConsent: function() {
            const consent = localStorage.getItem('cookieConsent');
            if (!consent) {
                // Mostrar banner después de 2 segundos
                setTimeout(() => this.showBanner(), 2000);
            } else if (consent === 'accepted') {
                this.enableAnalytics();
            }
        },

        showBanner: function() {
            if (this.banner) {
                this.banner.style.display = 'block';
                // Pequeño delay para la transición CSS
                setTimeout(() => {
                    this.banner.classList.add('show');
                    this.banner.setAttribute('aria-hidden', 'false');
                    // Focus en el primer botón para accesibilidad
                    if (this.acceptBtn) this.acceptBtn.focus();
                }, 100);
            }
        },

        hideBanner: function() {
            if (this.banner) {
                this.banner.classList.remove('show');
                this.banner.setAttribute('aria-hidden', 'true');
                setTimeout(() => {
                    this.banner.style.display = 'none';
                }, 500);
            }
        },

        acceptCookies: function() {
            localStorage.setItem('cookieConsent', 'accepted');
            localStorage.setItem('cookieConsentDate', new Date().toISOString());
            this.hideBanner();
            this.enableAnalytics();
        },

        rejectCookies: function() {
            localStorage.setItem('cookieConsent', 'rejected');
            localStorage.setItem('cookieConsentDate', new Date().toISOString());
            this.hideBanner();
            this.disableAnalytics();
        },

        enableAnalytics: function() {
            // Habilitar Google Analytics si está disponible
            if (typeof gtag !== 'undefined') {
                gtag('consent', 'update', {
                    'analytics_storage': 'granted',
                    'ad_storage': 'denied'
                });
            }
        },

        disableAnalytics: function() {
            if (typeof gtag !== 'undefined') {
                gtag('consent', 'update', {
                    'analytics_storage': 'denied',
                    'ad_storage': 'denied'
                });
            }
        },

        trackEvent: function(eventName, parameters) {
            if (typeof gtag !== 'undefined' && localStorage.getItem('cookieConsent') === 'accepted') {
                gtag('event', eventName, parameters);
            }
        }
    };

    // ==========================================================================
    // NAVEGACIÓN Y NAVBAR
    // ==========================================================================

    const Navigation = {
        navbar: null,
        navLinks: null,
        sections: null,
        mobileMenuOpen: false,

        init: function() {
            this.navbar = document.querySelector('#header .navbar');
            this.navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
            this.sections = document.querySelectorAll('section[id]');

            this.bindEvents();
            this.initSmoothScrolling();
            this.initActiveStates();
        },

        bindEvents: function() {
            // Scroll event para navbar sticky y highlighting
            window.addEventListener('scroll', Utils.throttle(() => {
                this.updateNavbarOnScroll();
                this.highlightActiveSection();
            }, 16)); // 60fps

            // Mobile menu toggle
            const navbarToggler = document.querySelector('.navbar-toggler');
            const navbarCollapse = document.querySelector('.navbar-collapse');

            if (navbarToggler && navbarCollapse) {
                navbarToggler.addEventListener('click', () => {
                    this.mobileMenuOpen = !this.mobileMenuOpen;
                    
                    // Accessibility attributes
                    navbarToggler.setAttribute('aria-expanded', this.mobileMenuOpen);
                    navbarCollapse.setAttribute('aria-hidden', !this.mobileMenuOpen);
                });

                // Cerrar menú móvil al hacer click en un link
                this.navLinks.forEach(link => {
                    link.addEventListener('click', () => {
                        if (Utils.isMobile() && this.mobileMenuOpen) {
                            navbarToggler.click();
                        }
                    });
                });

                // Cerrar menú móvil con Escape
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && this.mobileMenuOpen) {
                        navbarToggler.click();
                    }
                });
            }
        },

        updateNavbarOnScroll: function() {
            if (!this.navbar) return;

            const scrolled = window.pageYOffset > 50;
            const header = document.getElementById('header');
            
            if (scrolled) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        },

        initSmoothScrolling: function() {
            this.navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    const targetId = link.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        Utils.smoothScrollTo(targetElement);
                        
                        // Track navigation
                        CookieManager.trackEvent('navigate', {
                            section: targetId.replace('#', ''),
                            method: 'navbar_click'
                        });

                        // Update URL sin scroll jump
                        if (history.replaceState) {
                            history.replaceState(null, null, targetId);
                        }
                    }
                });
            });

            // Smooth scroll para otros enlaces internos
            document.querySelectorAll('a[href^="#"]:not(.navbar-nav .nav-link)').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetElement = document.querySelector(link.getAttribute('href'));
                    if (targetElement) {
                        Utils.smoothScrollTo(targetElement);
                    }
                });
            });
        },

        initActiveStates: function() {
            // Highlight initial active section
            this.highlightActiveSection();
        },

        highlightActiveSection: function() {
            if (!this.sections.length || !this.navLinks.length) return;

            let current = '';
            const scrollPos = window.pageYOffset + 100;

            // Encontrar la sección actual
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            // Actualizar estados activos
            this.navLinks.forEach(link => {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
                
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                }
            });
        }
    };

    // ==========================================================================
    // FORMULARIOS Y VALIDACIÓN
    // ==========================================================================

    const FormHandler = {
        contactForm: null,
        submitButton: null,

        init: function() {
            this.contactForm = document.querySelector('form[action*="formspree"]');
            if (!this.contactForm) return;

            this.submitButton = this.contactForm.querySelector('.loading-button');
            this.bindEvents();
            this.initValidation();
        },

        bindEvents: function() {
            this.contactForm.addEventListener('submit', (e) => {
                if (!this.validateForm()) {
                    e.preventDefault();
                    return false;
                }
                
                this.handleSubmission();
            });

            // Validación en tiempo real
            const inputs = this.contactForm.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });

                input.addEventListener('input', Utils.debounce(() => {
                    this.clearFieldError(input);
                }, 300));
            });
        },

        initValidation: function() {
            // Custom validation messages
            const inputs = this.contactForm.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('invalid', (e) => {
                    e.preventDefault();
                    this.showFieldError(input, this.getValidationMessage(input));
                });
            });
        },

        validateForm: function() {
            let isValid = true;
            const requiredFields = this.contactForm.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                if (!this.validateField(field)) {
                    isValid = false;
                }
            });

            return isValid;
        },

        validateField: function(field) {
            const value = field.value.trim();
            let isValid = true;
            let message = '';

            // Limpiar errores previos
            this.clearFieldError(field);

            // Validaciones específicas
            if (field.hasAttribute('required') && !value) {
                message = 'Este campo es obligatorio';
                isValid = false;
            } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
                message = 'Por favor ingresa un email válido';
                isValid = false;
            } else if (field.type === 'tel' && value && !this.isValidPhone(value)) {
                message = 'Por favor ingresa un teléfono válido';
                isValid = false;
            } else if (field.name === 'name' && value && value.length < 2) {
                message = 'El nombre debe tener al menos 2 caracteres';
                isValid = false;
            } else if (field.name === 'message' && value && value.length < 10) {
                message = 'El mensaje debe tener al menos 10 caracteres';
                isValid = false;
            }

            if (!isValid) {
                this.showFieldError(field, message);
            }

            return isValid;
        },

        showFieldError: function(field, message) {
            field.classList.add('is-invalid');
            field.setAttribute('aria-invalid', 'true');

            // Crear o actualizar mensaje de error
            let errorElement = field.parentNode.querySelector('.error-message');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message text-danger small mt-1';
                errorElement.setAttribute('role', 'alert');
                field.parentNode.appendChild(errorElement);
            }
            
            errorElement.textContent = message;
            errorElement.id = `${field.id}-error`;
            field.setAttribute('aria-describedby', errorElement.id);
        },

        clearFieldError: function(field) {
            field.classList.remove('is-invalid');
            field.removeAttribute('aria-invalid');
            field.removeAttribute('aria-describedby');

            const errorElement = field.parentNode.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
            }
        },

        getValidationMessage: function(field) {
            const messages = {
                'valueMissing': 'Este campo es obligatorio',
                'typeMismatch': field.type === 'email' ? 'Ingresa un email válido' : 'Formato inválido',
                'tooShort': `Mínimo ${field.minLength} caracteres`,
                'tooLong': `Máximo ${field.maxLength} caracteres`
            };

            for (const [key, message] of Object.entries(messages)) {
                if (field.validity[key]) {
                    return message;
                }
            }

            return 'Campo inválido';
        },

        isValidEmail: function(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        isValidPhone: function(phone) {
            const phoneRegex = /^[\+]?[\s\-\(\)]?[\d\s\-\(\)]{7,}$/;
            return phoneRegex.test(phone);
        },

        handleSubmission: function() {
            if (!this.submitButton) return;

            const buttonText = this.submitButton.querySelector('.button-text');
            const loadingText = this.submitButton.querySelector('.loading-text');

            // Mostrar estado de carga
            this.submitButton.disabled = true;
            this.submitButton.setAttribute('aria-busy', 'true');
            
            if (buttonText) buttonText.style.display = 'none';
            if (loadingText) loadingText.style.display = 'inline-flex';

            // Track form submission
            CookieManager.trackEvent('form_submit', {
                form_name: 'contact_form',
                form_location: 'homepage'
            });

            // Timeout de seguridad para restaurar el botón
            setTimeout(() => {
                this.resetSubmissionState();
            }, 5000);

            // Simular éxito (esto debería manejarse con la respuesta real del servidor)
            setTimeout(() => {
                this.showSuccessMessage();
                this.resetSubmissionState();
                this.contactForm.reset();
            }, 2000);
        },

        resetSubmissionState: function() {
            if (!this.submitButton) return;

            const buttonText = this.submitButton.querySelector('.button-text');
            const loadingText = this.submitButton.querySelector('.loading-text');

            this.submitButton.disabled = false;
            this.submitButton.removeAttribute('aria-busy');
            
            if (buttonText) buttonText.style.display = 'inline-flex';
            if (loadingText) loadingText.style.display = 'none';
        },

        showSuccessMessage: function() {
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success mt-3';
            successMessage.setAttribute('role', 'alert');
            successMessage.innerHTML = `
                <i class="fas fa-check-circle me-2" aria-hidden="true"></i>
                <strong>¡Mensaje enviado exitosamente!</strong> Te contactaremos pronto.
            `;

            this.contactForm.parentNode.insertBefore(successMessage, this.contactForm);

            // Auto-hide después de 5 segundos
            setTimeout(() => {
                successMessage.remove();
            }, 5000);

            // Scroll al mensaje
            Utils.smoothScrollTo(successMessage, 20);
        }
    };

    // ==========================================================================
    // ANIMACIONES Y EFECTOS VISUALES
    // ==========================================================================

    const AnimationManager = {
        init: function() {
            this.initAOS();
            this.initScrollAnimations();
            this.initHoverEffects();
        },

        initAOS: function() {
            // Inicializar AOS solo si no se prefiere movimiento reducido
            if (typeof AOS !== 'undefined' && !Utils.prefersReducedMotion()) {
                AOS.init({
                    duration: 800,
                    easing: 'ease-in-out-cubic',
                    once: true,
                    offset: 50,
                    mirror: false,
                    anchorPlacement: 'top-bottom'
                });

                // Refresh AOS en resize
                window.addEventListener('resize', Utils.debounce(() => {
                    AOS.refresh();
                }, 250));
            }
        },

        initScrollAnimations: function() {
            // Animaciones personalizadas para elementos sin AOS
            const animatedElements = document.querySelectorAll('.fade-in-up');
            
            if (!animatedElements.length) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animationDelay = '0ms';
                        entry.target.style.animationPlayState = 'running';
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            animatedElements.forEach(el => {
                observer.observe(el);
            });
        },

        initHoverEffects: function() {
            // Mejorar efectos hover en cards
            const cards = document.querySelectorAll('.service-card-new, .value-card, .contact-info-card');
            
            cards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    if (!Utils.prefersReducedMotion()) {
                        this.style.transform = 'translateY(-8px)';
                    }
                });

                card.addEventListener('mouseleave', function() {
                    this.style.transform = '';
                });
            });

            // Efecto parallax sutil en hero
            if (!Utils.prefersReducedMotion() && !Utils.isMobile()) {
                const heroImage = document.querySelector('.hero-image-container img');
                if (heroImage) {
                    window.addEventListener('scroll', Utils.throttle(() => {
                        const scrolled = window.pageYOffset;
                        const rate = scrolled * -0.5;
                        heroImage.style.transform = `translateY(${rate}px)`;
                    }, 16));
                }
            }
        }
    };

    // ==========================================================================
    // OPTIMIZACIÓN DE IMÁGENES
    // ==========================================================================

    const ImageOptimizer = {
        init: function() {
            this.lazyLoadImages();
            this.optimizeImageLoading();
        },

        lazyLoadImages: function() {
            const images = document.querySelectorAll('img[loading="lazy"]');
            
            // Fallback para navegadores sin soporte nativo de lazy loading
            if ('loading' in HTMLImageElement.prototype) {
                images.forEach(img => {
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                    });
                });
            } else {
                // Implementar lazy loading manual
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src || img.src;
                            img.classList.add('loaded');
                            observer.unobserve(img);
                        }
                    });
                });

                images.forEach(img => imageObserver.observe(img));
            }
        },

        optimizeImageLoading: function() {
            // Precargar imágenes críticas
            const criticalImages = document.querySelectorAll('img[loading="eager"]');
            criticalImages.forEach(img => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = img.src;
                document.head.appendChild(link);
            });
        }
    };

    // ==========================================================================
    // PERFORMANCE MONITORING
    // ==========================================================================

    const PerformanceMonitor = {
        init: function() {
            this.monitorWebVitals();
            this.trackLoadTimes();
        },

        monitorWebVitals: function() {
            if ('PerformanceObserver' in window) {
                // Largest Contentful Paint
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    
                    CookieManager.trackEvent('web_vitals', {
                        metric_name: 'LCP',
                        value: Math.round(lastEntry.startTime),
                        rating: lastEntry.startTime <= 2500 ? 'good' : 
                               lastEntry.startTime <= 4000 ? 'needs_improvement' : 'poor'
                    });
                });
                
                try {
                    lcpObserver.observe({entryTypes: ['largest-contentful-paint']});
                } catch (e) {
                    console.warn('LCP observation not supported');
                }

                // First Input Delay
                const fidObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        CookieManager.trackEvent('web_vitals', {
                            metric_name: 'FID',
                            value: Math.round(entry.processingStart - entry.startTime),
                            rating: entry.processingStart - entry.startTime <= 100 ? 'good' : 
                                   entry.processingStart - entry.startTime <= 300 ? 'needs_improvement' : 'poor'
                        });
                    });
                });

                try {
                    fidObserver.observe({entryTypes: ['first-input']});
                } catch (e) {
                    console.warn('FID observation not supported');
                }
            }
        },

        trackLoadTimes: function() {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const navigation = performance.getEntriesByType('navigation')[0];
                    const loadTime = navigation.loadEventEnd - navigation.fetchStart;
                    
                    CookieManager.trackEvent('page_timing', {
                        load_time: Math.round(loadTime),
                        dom_content_loaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
                        first_byte: Math.round(navigation.responseStart - navigation.fetchStart)
                    });
                }, 0);
            });
        }
    };

    // ==========================================================================
    // ACCESIBILIDAD
    // ==========================================================================

    const AccessibilityManager = {
        init: function() {
            this.initKeyboardNavigation();
            this.initFocusManagement();
            this.initARIA();
        },

        initKeyboardNavigation: function() {
            // Mejorar navegación con teclado
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    document.body.classList.add('using-keyboard');
                }
            });

            document.addEventListener('mousedown', () => {
                document.body.classList.remove('using-keyboard');
            });

            // Skip links
            const skipLink = document.querySelector('.skip-link');
            if (skipLink) {
                skipLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(skipLink.getAttribute('href'));
                    if (target) {
                        target.focus();
                        target.scrollIntoView();
                    }
                });
            }
        },

        initFocusManagement: function() {
            // Gestión de focus para modales y overlays
            const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
            
            // Trap focus en elementos específicos cuando sea necesario
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    const cookieBanner = document.querySelector('.cookie-banner.show');
                    if (cookieBanner) {
                        this.trapFocus(e, cookieBanner, focusableElements);
                    }
                }
            });
        },

        trapFocus: function(e, container, focusableElements) {
            const focusable = container.querySelectorAll(focusableElements);
            const firstFocusable = focusable[0];
            const lastFocusable = focusable[focusable.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        },

        initARIA: function() {
            // Actualizar etiquetas ARIA dinámicamente
            const updateARIA = () => {
                // Actualizar aria-current para navegación
                const currentSection = document.querySelector('.navbar-nav .nav-link.active');
                document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
                    link.removeAttribute('aria-current');
                });
                if (currentSection) {
                    currentSection.setAttribute('aria-current', 'page');
                }
            };

            // Ejecutar en scroll
            window.addEventListener('scroll', Utils.throttle(updateARIA, 100));
        }
    };

    // ==========================================================================
    // INICIALIZACIÓN PRINCIPAL
    // ==========================================================================

    const App = {
        init: function() {
            // Esperar a que el DOM esté completamente cargado
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
            } else {
                this.initializeComponents();
            }
        },

        initializeComponents: function() {
            console.log('🚀 Inicializando Profutbol JC...');

            try {
                // Inicializar componentes en orden de prioridad
                CookieManager.init();
                Navigation.init();
                FormHandler.init();
                ImageOptimizer.init();
                AccessibilityManager.init();
                
                // Componentes que requieren imágenes cargadas
                window.addEventListener('load', () => {
                    AnimationManager.init();
                    PerformanceMonitor.init();
                });

                // Actualizar año automáticamente
                this.updateYear();

                // Configurar error handling global
                this.setupErrorHandling();

                console.log('✅ Profutbol JC inicializado correctamente');

            } catch (error) {
                console.error('❌ Error inicializando la aplicación:', error);
                this.handleInitError(error);
            }
        },

        updateYear: function() {
            const yearElement = document.getElementById('current-year');
            if (yearElement) {
                yearElement.textContent = new Date().getFullYear();
            }
        },

        setupErrorHandling: function() {
            window.addEventListener('error', (e) => {
                console.error('Error global capturado:', e.error);
                CookieManager.trackEvent('javascript_error', {
                    error_message: e.error?.message || 'Unknown error',
                    error_filename: e.filename || 'Unknown file',
                    error_line: e.lineno || 0
                });
            });

            window.addEventListener('unhandledrejection', (e) => {
                console.error('Promise rechazada no manejada:', e.reason);
                CookieManager.trackEvent('promise_rejection', {
                    error_message: e.reason?.message || 'Unknown rejection reason'
                });
            });
        },

        handleInitError: function(error) {
            // Fallback básico si hay errores críticos
            document.body.classList.add('js-error');
            
            // Mostrar mensaje de error amigable al usuario
            const errorMessage = document.createElement('div');
            errorMessage.className = 'alert alert-warning position-fixed top-0 start-50 translate-middle-x mt-3';
            errorMessage.style.zIndex = '9999';
            errorMessage.innerHTML = `
                <i class="fas fa-exclamation-triangle me-2"></i>
                Algunos elementos interactivos pueden no funcionar correctamente. 
                <button type="button" class="btn-close ms-2" aria-label="Cerrar"></button>
            `;
            
            document.body.appendChild(errorMessage);

            // Permitir cerrar el mensaje
            errorMessage.querySelector('.btn-close').addEventListener('click', () => {
                errorMessage.remove();
            });

            // Auto-hide después de 10 segundos
            setTimeout(() => {
                if (errorMessage.parentNode) {
                    errorMessage.remove();
                }
            }, 10000);
        }
    };

    // ==========================================================================
    // INICIALIZAR LA APLICACIÓN
    // ==========================================================================

    // Inicializar cuando el script se carga
    App.init();

})();