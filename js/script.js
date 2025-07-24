document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica del Loader ---
    // Asegura que la pantalla de carga se oculte después de un tiempo.
    // Se ejecuta una vez que el HTML está completamente cargado.
    const loaderWrapper = document.getElementById("loader-wrapper");
    if (loaderWrapper) {
        // Oculta el loader después de un pequeño retraso para que la animación sea visible
        // Puedes ajustar el tiempo (en milisegundos)
        setTimeout(function() {
            loaderWrapper.classList.add("hidden");
        }, 1000); // 1000 ms = 1 segundo
    }


    // --- Funcionalidad para la Sección Hero (Ejemplo de parallax sutil) ---
    const heroSection = document.getElementById('hero-home');
    if (heroSection) {
        // Descomenta y ajusta el valor '0.3' para un efecto parallax muy ligero
        // window.addEventListener('scroll', () => {
        //     const scrollPosition = window.pageYOffset;
        //     heroSection.style.backgroundPositionY = -scrollPosition * 0.3 + 'px';
        // });
    }


    // --- Animación de secciones al hacer scroll (Intersection Observer) ---
    // Añade la clase 'visible' a las secciones cuando entran en la vista para activar animaciones CSS.
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
        section.classList.add('fade-in-section'); // Clase inicial para la animación (asegúrate de que exista en tu CSS)
        sectionObserver.observe(section);
    });


    // --- Validación de Formulario en Tiempo Real para Contacto ---
    // Valida los campos del formulario de contacto mientras el usuario escribe.
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

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex simple para email

        // Event listeners para validación en tiempo real
        if (nameInput) {
            nameInput.addEventListener('input', () => validateInput(nameInput));
        }
        if (emailInput) {
            emailInput.addEventListener('input', () => validateInput(emailInput, emailRegex, 'Por favor, introduce un correo electrónico válido.'));
        }
        if (messageInput) {
            messageInput.addEventListener('input', () => validateInput(messageInput));
        }

        // Si usas Formspree, su script ya manejará el evento 'submit' y hará preventDefault().
        // Asegúrate de que su script se cargue después de este para que la validación se ejecute primero.
    }


    // --- Efecto "Copy to Clipboard" para Email y Teléfono en Contacto ---
    const phoneDetail = document.querySelector('.contact-details-container a[href^="tel:"]');
    const emailDetail = document.querySelector('.contact-details-container a[href^="mailto:"]');

    const createCopyMessage = (element) => {
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
            event.preventDefault(); // Evita que se active la llamada por defecto
            const phoneNumber = phoneDetail.textContent.trim();
            navigator.clipboard.writeText(phoneNumber).then(() => {
                createCopyMessage(phoneDetail);
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
                createCopyMessage(emailDetail);
            }).catch(err => {
                console.error('Error al copiar el email:', err);
            });
        });
    }


    // --- Lógica del Carrusel con Auto-avance ---
    // Esta lógica gestiona el movimiento del carrusel, botones y puntos, incluyendo el auto-avance.
    const carouselSlides = document.getElementById('carouselSlides');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const carouselDotsContainer = document.querySelector('.carousel-dots');

    // Solo inicializar el carrusel si todos sus elementos necesarios están presentes
    if (carouselSlides && prevButton && nextButton && carouselDotsContainer) {
        const images = carouselSlides.querySelectorAll('img');
        let currentSlideIndex = 0;
        const slideIntervalTime = 8000; // 3 segundos (3000 milisegundos)

        let autoSlideInterval; // Variable para almacenar el ID del intervalo de auto-avance

        // Función para actualizar la visualización del carrusel (mover las imágenes)
        function updateCarousel() {
            if (images.length === 0) return;
            const offset = -currentSlideIndex * 100; // Calcular el desplazamiento en porcentaje
            carouselSlides.style.transform = `translateX(${offset}%)`;
            updateDots(); // Actualizar los puntos de navegación
        }

        // Función para actualizar los puntos de navegación (dots)
        function updateDots() {
            carouselDotsContainer.innerHTML = ''; // Limpiar los puntos existentes
            images.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (index === currentSlideIndex) {
                    dot.classList.add('active'); // Marcar el punto activo
                }
                dot.addEventListener('click', () => {
                    currentSlideIndex = index; // Ir al slide correspondiente al punto clicado
                    updateCarousel();
                    resetAutoSlide(); // Reiniciar el temporizador de auto-avance al interactuar
                });
                carouselDotsContainer.appendChild(dot);
            });
        }

        // Función para avanzar al siguiente slide
        function moveToNextSlide() {
            currentSlideIndex++;
            if (currentSlideIndex >= images.length) {
                currentSlideIndex = 0; // Volver al primer slide si se llega al final
            }
            updateCarousel();
        }

        // Función para iniciar el auto-avance
        function startAutoSlide() {
            autoSlideInterval = setInterval(moveToNextSlide, slideIntervalTime);
        }

        // Función para reiniciar el temporizador de auto-avance (cuando el usuario interactúa)
        function resetAutoSlide() {
            clearInterval(autoSlideInterval); // Detener el temporizador actual
            startAutoSlide(); // Iniciar un nuevo temporizador
        }

        // Inicializar el carrusel la primera vez
        updateCarousel(); // Mostrar el primer slide y los puntos
        startAutoSlide(); // Iniciar el auto-avance

        // Event listeners para los botones de navegación
        prevButton.addEventListener('click', () => {
            currentSlideIndex--;
            if (currentSlideIndex < 0) {
                currentSlideIndex = images.length - 1; // Ir al último slide si se va hacia atrás desde el primero
            }
            updateCarousel();
            resetAutoSlide(); // Reiniciar el temporizador de auto-avance
        });

        nextButton.addEventListener('click', () => {
            moveToNextSlide(); // Ya maneja el incremento y actualización
            resetAutoSlide(); // Reiniciar el temporizador de auto-avance
        });

        // Opcional: Pausar el auto-avance cuando el mouse está sobre el carrusel y reanudar al salir
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
            carouselContainer.addEventListener('mouseleave', startAutoSlide);
        }
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

// Nota: El código para el menú hamburguesa personalizado que tenías al principio
// ha sido eliminado. Si estás usando el componente Navbar de Bootstrap,
// este ya maneja su propio comportamiento responsivo sin necesidad de JS adicional.
// Si tu Navbar no es de Bootstrap o requiere JS muy específico,
// por favor, házmelo saber para reintegrar esa lógica.