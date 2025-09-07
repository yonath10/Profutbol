document.addEventListener('DOMContentLoaded', () => {

    // 1. Inicializar AOS (Animate on Scroll)
    AOS.init({
        duration: 800,
        once: true,
        offset: 120
    });

    // 2. Comportamiento del Navbar al hacer scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('navbar-scrolled', window.scrollY > 50);
        });
    }

    // 3. Menú Activo y Smooth Scroll
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
    const sections = document.querySelectorAll('main section[id]');

    const activateMenuOnScroll = () => {
        let fromTop = window.scrollY + 150;
        let currentSectionId = null;
        sections.forEach(section => {
            if (section.offsetTop <= fromTop) {
                currentSectionId = section.id;
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSectionId) {
                link.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', activateMenuOnScroll);

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarCollapse = navbar?.querySelector('.navbar-collapse');
                if (navbarCollapse?.classList.contains('show')) {
                    navbar.querySelector('.navbar-toggler')?.click();
                }
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 4. Actualizar el año en el footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }



    // 6. Funcionalidad del Banner de Cookies
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies-btn');
    const rejectCookiesBtn = document.getElementById('reject-cookies-btn');

    if (cookieBanner && acceptCookiesBtn && rejectCookiesBtn) {
        const consentGiven = localStorage.getItem('cookie_consent');
        if (!consentGiven) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 2000);
        }

        const handleConsent = (consentType) => {
            localStorage.setItem('cookie_consent', consentType);
            cookieBanner.classList.remove('show');
            setTimeout(() => {
                if (cookieBanner) cookieBanner.style.display = 'none';
            }, 500);
        };

        acceptCookiesBtn.addEventListener('click', () => handleConsent('accepted'));
        rejectCookiesBtn.addEventListener('click', () => handleConsent('rejected'));
    }


});

