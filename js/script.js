document.addEventListener('DOMContentLoaded', () => {
    // Obtenemos los elementos del DOM
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navLinks = document.getElementById('nav-links');

    // Verificamos que ambos elementos existan antes de añadir el event listener
    if (hamburgerMenu && navLinks) {
        // Añadimos un "escuchador de eventos" al icono de la hamburguesa
        hamburgerMenu.addEventListener('click', () => {
            // Cuando se haga clic, alternamos la clase 'active' en los enlaces de navegación
            navLinks.classList.toggle('active');

            // Opcional: Para animar el icono de la hamburguesa (cruces, etc.)
            // Podrías añadir/quitar otra clase aquí o directamente en el mismo toggle
            hamburgerMenu.classList.toggle('open');
        });
    } else {
        console.warn("No se encontraron los elementos 'hamburger-menu' o 'nav-links'. Asegúrate de que los IDs sean correctos.");
    }

    // Opcional: Cerrar el menú si se hace clic fuera de él (útil en móviles)
    document.addEventListener('click', (event) => {
        // Si el clic no fue dentro del menú ni en el botón de hamburguesa
        if (!navLinks.contains(event.target) && !hamburgerMenu.contains(event.target)) {
            // Y el menú está abierto, entonces ciérralo
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburgerMenu.classList.remove('open'); // Si usas la clase 'open' para la animación
            }
        }
    });
});

// (Tu código JS del Navbar aquí arriba)

document.addEventListener('DOMContentLoaded', () => {
    // ... (código existente del navbar) ...

    // --- Funcionalidad para la Sección Hero ---
    const heroSection = document.getElementById('hero-home');
    if (heroSection) {
        // Opción 1: Establecer la imagen de fondo dinámicamente (si es necesario)
        // Por ahora, lo dejaremos en CSS. Si quisieras rotar imágenes, etc., lo harías aquí.
        // heroSection.style.backgroundImage = "url('images/tu-imagen-hero.jpg')";

        // Ejemplo básico: efecto de desplazamiento sutil para el fondo
        // Puedes descomentar y usar esto si quieres un efecto parallax muy ligero
        // window.addEventListener('scroll', () => {
        //     const scrollPosition = window.pageYOffset;
        //     heroSection.style.backgroundPositionY = -scrollPosition * 0.3 + 'px'; // Ajusta el 0.3 para más o menos efecto
        // });
    }

    // --- Animación de secciones al hacer scroll (Ejemplo mejorado) ---
    // Si quieres que las secciones aparezcan con una animación suave al entrar en la vista
    const sectionsToAnimate = document.querySelectorAll('.content-section');

    const observerOptions = {
        root: null, // Observa el viewport
        rootMargin: '0px',
        threshold: 0.1 // Cuando el 10% de la sección es visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // Añade una clase para activar la animación
                observer.unobserve(entry.target); // Deja de observar una vez que se ha animado
            }
        });
    }, observerOptions);

    sectionsToAnimate.forEach(section => {
        section.classList.add('fade-in-section'); // Clase inicial para la animación
        sectionObserver.observe(section);
    });
});

// ... (Tu código JS del Navbar y animaciones de secciones aquí) ...

document.addEventListener('DOMContentLoaded', () => {
    // ... (código existente del navbar y observer para secciones) ...

    // --- Validación de Formulario en Tiempo Real para Contacto ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        const validateInput = (inputElement, regex, errorMessage) => {
            if (inputElement.value.trim() === '') {
                inputElement.setCustomValidity('Este campo es obligatorio.');
                inputElement.reportValidity();
                return false;
            } else if (regex && !regex.test(inputElement.value)) {
                inputElement.setCustomValidity(errorMessage);
                inputElement.reportValidity();
                return false;
            } else {
                inputElement.setCustomValidity(''); // Campo válido
                return true;
            }
        };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex para email

        nameInput.addEventListener('input', () => {
            validateInput(nameInput); // Solo validación de campo vacío
        });

        emailInput.addEventListener('input', () => {
            validateInput(emailInput, emailRegex, 'Por favor, introduce un correo electrónico válido.');
        });

        messageInput.addEventListener('input', () => {
            validateInput(messageInput); // Solo validación de campo vacío
        });

        // Asegúrate de que el evento 'submit' para Formspree esté DESPUÉS de esto
        // para que las validaciones se ejecuten antes del envío.
        // El código de Formspree ya hace preventDefault().
    }

    // --- Efecto "Copy to Clipboard" para Email y Teléfono ---
    const phoneDetail = document.querySelector('.contact-details-container a[href^="tel:"]');
    const emailDetail = document.querySelector('.contact-details-container a[href^="mailto:"]');

    const createCopyMessage = (element, textToCopy, originalText) => {
        const copyMessage = document.createElement('span');
        copyMessage.className = 'copy-feedback-message';
        copyMessage.textContent = '¡Copiado!';
        element.parentNode.insertBefore(copyMessage, element.nextSibling);

        setTimeout(() => {
            copyMessage.remove();
        }, 1500); // El mensaje desaparece después de 1.5 segundos
    };

    if (phoneDetail) {
        phoneDetail.addEventListener('click', (event) => {
            event.preventDefault(); // Evita que se active la llamada/email por defecto
            const phoneNumber = phoneDetail.textContent.trim();
            navigator.clipboard.writeText(phoneNumber).then(() => {
                createCopyMessage(phoneDetail, phoneNumber, phoneDetail.textContent);
            }).catch(err => {
                console.error('Error al copiar el teléfono:', err);
            });
        });
    }

    if (emailDetail) {
        emailDetail.addEventListener('click', (event) => {
            event.preventDefault(); // Evita que se abra el cliente de correo por defecto
            const emailAddress = emailDetail.textContent.trim();
            navigator.clipboard.writeText(emailAddress).then(() => {
                createCopyMessage(emailDetail, emailAddress, emailDetail.textContent);
            }).catch(err => {
                console.error('Error al copiar el email:', err);
            });
        });
    }
});


// ... (Tu código JS del Navbar y validación de formulario de contacto aquí) ...

document.addEventListener('DOMContentLoaded', () => {
    // ... (código existente del navbar, observer para secciones y formulario de contacto) ...

    // --- Carrusel de Galería en Página de Servicios ---
    const carouselContainer = document.querySelector('#gallery-carousel .carousel-container');
    if (carouselContainer) {
        const slides = carouselContainer.querySelectorAll('.carousel-slide');
        const prevButton = carouselContainer.querySelector('.carousel-button.prev');
        const nextButton = carouselContainer.querySelector('.carousel-button.next');
        const dotsContainer = carouselContainer.querySelector('.carousel-dots');
        let currentSlide = 0;

        // Crear los puntos (dots)
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => {
                showSlide(index);
            });
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.classList.remove('active');
                slide.style.opacity = 0; // Reset opacity for transition
                if (i === index) {
                    slide.classList.add('active');
                    slide.style.opacity = 1; // Fade in active slide
                }
            });
            dots.forEach((dot, i) => {
                dot.classList.remove('active');
                if (i === index) {
                    dot.classList.add('active');
                }
            });
            currentSlide = index;
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        };

        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        };

        prevButton.addEventListener('click', prevSlide);
        nextButton.addEventListener('click', nextSlide);

        // Mostrar la primera slide al cargar
        showSlide(currentSlide);

        // Opcional: Autoplay del carrusel
        let carouselInterval = setInterval(nextSlide, 5000); // Cambia cada 5 segundos

        // Pausar autoplay al pasar el ratón y reanudar al salir
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(carouselInterval);
        });
        carouselContainer.addEventListener('mouseleave', () => {
            carouselInterval = setInterval(nextSlide, 5000);
        });
    }

    // --- Smooth Scroll para botón "Explorar Canchas" ---
    const scrollDownButton = document.querySelector('.scroll-down-button');
    if (scrollDownButton) {
        scrollDownButton.addEventListener('click', (event) => {
            event.preventDefault(); // Evita el comportamiento por defecto del enlace
            const targetId = scrollDownButton.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth' // Desplazamiento suave
            });
        });
    }
});