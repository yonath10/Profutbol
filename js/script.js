document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica del Loader Mejorada ---
    const loaderWrapper = document.getElementById("loader-wrapper");
    if (loaderWrapper) {
        // Esperar a que todos los recursos estén cargados
        window.addEventListener('load', () => {
            setTimeout(() => {
                loaderWrapper.classList.add("hidden");
                // Eliminar el loader del DOM después de la animación
                setTimeout(() => loaderWrapper.remove(), 1000);
            }, 1000);
        });
    }

    // --- Hero Section con Parallax ---
    const heroSection = document.querySelector('.hero-home-redesigned');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            heroSection.style.backgroundPositionY = -scrollPosition * 0.3 + 'px';
        });
    }

    // --- Animación de secciones al hacer scroll (Intersection Observer) ---
    const sectionsToAnimate = document.querySelectorAll('.fade-in-section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px' // Activar animación 100px antes de llegar a la sección
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // observer.unobserve(entry.target); // Opcional: Descomentar si solo quieres animar una vez
            } else {
                entry.target.classList.remove('visible'); // Para reanimar al volver a scroll up
            }
        });
    }, observerOptions);

    sectionsToAnimate.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Validación de Formulario Mejorada ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input, textarea');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const validateInput = (input) => {
            const isValid = input.checkValidity();
            if (input.value.trim() === '') {
                input.setCustomValidity('Este campo es obligatorio.');
            } else if (input.type === 'email' && !emailRegex.test(input.value)) {
                input.setCustomValidity('Por favor, introduce un correo válido.');
            } else {
                input.setCustomValidity('');
            }
            input.reportValidity();
            return isValid;
        };

        inputs.forEach(input => {
            input.addEventListener('input', () => validateInput(input));
            input.addEventListener('blur', () => validateInput(input));
        });

        contactForm.addEventListener('submit', (e) => {
            let formIsValid = true;
            inputs.forEach(input => {
                if (!validateInput(input)) formIsValid = false;
            });

            if (!formIsValid) {
                e.preventDefault();
                // Mostrar mensaje de error general
                const errorDiv = document.createElement('div');
                errorDiv.className = 'alert alert-danger mt-3';
                errorDiv.textContent = 'Por favor, corrige los errores en el formulario.';
                contactForm.appendChild(errorDiv);
            }
        });
    }

    // --- Copy to Clipboard con Fallback ---
    const copyElements = document.querySelectorAll('[data-copy]');
    
    copyElements.forEach(element => {
        element.addEventListener('click', async (e) => {
            e.preventDefault();
            const textToCopy = element.getAttribute('data-copy') || element.textContent.trim();
            
            try {
                await navigator.clipboard.writeText(textToCopy);
                showCopyFeedback(element);
            } catch (err) {
                // Fallback para navegadores antiguos
                const textArea = document.createElement('textarea');
                textArea.value = textToCopy;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showCopyFeedback(element);
            }
        });
    });

    function showCopyFeedback(element) {
        const feedback = document.createElement('span');
        feedback.className = 'copy-feedback';
        feedback.textContent = '¡Copiado!';
        element.parentNode.appendChild(feedback);
        
        setTimeout(() => {
            feedback.classList.add('fade-out');
            setTimeout(() => feedback.remove(), 500);
        }, 1500);
    }

    // --- Carrusel Responsive Mejorado ---
    const carousels = document.querySelectorAll('.carousel-container');
    
    carousels.forEach(carousel => {
        const slides = carousel.querySelector('.carousel-slides');
        const items = carousel.querySelectorAll('.carousel-item');
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');
        const dotsContainer = carousel.querySelector('.carousel-dots');
        
        if (!slides || !items.length || !prevBtn || !nextBtn) return;
        
        let currentIndex = 0;
        let autoSlideInterval;
        const slideCount = items.length;
        const slideWidth = items[0].clientWidth;
        
        function updateCarousel() {
            slides.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            updateDots();
        }
        
        function updateDots() {
            if (!dotsContainer) return;
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
        
        function nextSlide() {
            currentIndex = (currentIndex + 1) % slideCount;
            updateCarousel();
        }
        
        function prevSlide() {
            currentIndex = (currentIndex - 1 + slideCount) % slideCount;
            updateCarousel();
        }
        
        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 5000);
        }
        
        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }
        
        // Inicializar dots
        if (dotsContainer) {
            for (let i = 0; i < slideCount; i++) {
                const dot = document.createElement('span');
                dot.className = 'dot';
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            }
            updateDots();
        }
        
        // Event listeners
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });
        
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });
        
        // Responsive
        function handleResize() {
            const newSlideWidth = items[0].clientWidth;
            if (newSlideWidth !== slideWidth) {
                slides.style.transform = `translateX(-${currentIndex * newSlideWidth}px)`;
            }
        }
        
        // Iniciar
        updateCarousel();
        startAutoSlide();
        
        // Pausar al interactuar
        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);
        
        // Redimensionamiento
        window.addEventListener('resize', handleResize);
    });

    // --- Smooth Scroll Mejorado ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Actualizar URL sin recargar
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    window.location.hash = targetId;
                }
            }
        });
    });

    // --- Navbar Responsive ---
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
        
        // Cerrar menú al hacer clic en un enlace (en móviles)
        const navLinks = navbar.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                const navbarCollapse = navbar.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const toggler = navbar.querySelector('.navbar-toggler');
                    if (toggler) toggler.click(); // Simular clic en el toggler para cerrar
                }
            });
        });
    }

    // --- Botón Volver Arriba ---
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            backToTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- WhatsApp Float Button ---
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (whatsappBtn) {
        // Asegurar que no duplique el botón en resize
        window.addEventListener('resize', () => {
            whatsappBtn.style.display = window.innerWidth < 992 ? 'flex' : 'none';
        });
        
        // Mostrar solo en móviles inicialmente
        whatsappBtn.style.display = window.innerWidth < 992 ? 'flex' : 'none';
    }
});

// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {

    // Loader de carga
    const loaderWrapper = document.getElementById('loader-wrapper');
    if (loaderWrapper) {
        // Simular un tiempo de carga mínimo para que el usuario vea el loader
        setTimeout(() => {
            loaderWrapper.classList.add('hidden');
            // Eliminar el loader del DOM después de la transición
            loaderWrapper.addEventListener('transitionend', () => {
                loaderWrapper.remove();
            });
        }, 1500); // Muestra el loader por 1.5 segundos
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) { // Si el scroll es mayor a 50px
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }

    // Back to Top button functionality
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Muestra el botón después de 300px de scroll
                backToTopButton.style.display = 'flex'; // Usar flex para centrar el icono
            } else {
                backToTopButton.style.display = 'none';
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Desplazamiento suave
            });
        });
    }

    // Contador de estadísticas (si no lo tienes ya)
    const counters = document.querySelectorAll('.counter-number');
    const speed = 200; // Cuanto más alto, más lento es el número

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-count');
        let current = +counter.innerText;
        const increment = target / speed;

        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.innerText = Math.ceil(current);
                setTimeout(updateCounter, 1);
            } else {
                counter.innerText = target;
            }
        };
        updateCounter();
    };

    // Observador para animar contadores cuando están visibles
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target); // Deja de observar una vez animado
            }
        });
    }, { threshold: 0.5 }); // Inicia animación cuando el 50% del elemento es visible

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // Fade-in sections on scroll
    const fadeSections = document.querySelectorAll('.fade-in-section');
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 }); // Se activa cuando el 10% de la sección es visible

    fadeSections.forEach(section => {
        fadeObserver.observe(section);
    });

    // Carrusel de testimonios
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.testimonial-button.prev');
    const nextButton = document.querySelector('.testimonial-button.next');
    let currentSlide = 0;

    function showSlide(index) {
        testimonialSlides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % testimonialSlides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
        showSlide(currentSlide);
    }

    if (testimonialSlides.length > 0) {
        showSlide(currentSlide); // Muestra el primer slide al cargar

        prevButton.addEventListener('click', prevSlide);
        nextButton.addEventListener('click', nextSlide);

        // Opcional: Autoplay del carrusel
        setInterval(nextSlide, 7000); // Cambia de slide cada 7 segundos
    }

    // Fancybox inicialización
    // Asegúrate de que Fancybox esté cargado ANTES de inicializarlo
    if (typeof Fancybox !== 'undefined') {
        Fancybox.bind("[data-fancybox='gallery']", {
            // Your custom options
            caption: function (fancybox, carousel, slide) {
                return (
                    `<div class="fancybox__caption">${slide.caption || slide.dataset.caption || ""}</div>`
                );
            },
        });
    } else {
        console.warn("Fancybox no está cargado. Asegúrate de incluir su script.");
    }

});