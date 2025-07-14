# ⚽ ProFutbol - Complejo Deportivo y Recreativo 🏆


Este repositorio contiene el código fuente de la aplicación web del **ProFutbol Complejo Deportivo y Recreativo**, un proyecto diseñado para gestionar y promocionar un moderno complejo de canchas de fútbol. La aplicación busca ser una plataforma integral para usuarios que deseen reservar canchas, conocer los programas de entrenamiento, informarse sobre torneos y contactar con el complejo.

Actualmente, el proyecto se encuentra en una fase avanzada de desarrollo, con funcionalidades CRUD (Crear, Leer, Actualizar, Borrar) para la gestión interna y la representación gráfica de la demanda de las canchas (aunque esta última parte aún no ha sido integrada en el frontend público de este repositorio).

## ✨ Características Principales (Frontend)

* **Página de Inicio Impactante:** Un diseño moderno y atractivo para dar la bienvenida a los usuarios, destacando las ventajas del complejo y testimonios de clientes.
* **Sección de Servicios Detallada:** Presenta las canchas de grama natural (Fútbol 5, 8, 11), iluminación profesional, y programas de rendimiento deportivo y formación para todas las edades.
* **Galería de Instalaciones:** Carrusel de imágenes dinámico para mostrar la calidad de las instalaciones.
* **Showcase de Clientes Destacados:** Destaca las alianzas y clientes importantes del complejo.
* **Página de Contacto Funcional:** Formulario de contacto con validación y envío de datos a través de Formspree, junto con la ubicación en Google Maps.
* **Navegación Responsiva:** Menú hamburguesa para dispositivos móviles y diseño adaptable a diferentes tamaños de pantalla.

## 🛠️ Tecnologías Utilizadas

### Frontend
* **HTML5:** Estructura de la aplicación web.
* **CSS3:** Estilos personalizados y diseño responsivo (`base.css`, `home.css`, `services.css`, `contact.css`).
* **JavaScript (Vanilla JS):** Interactividad, menú hamburguesa, carruseles de imágenes y validación de formulario.
* **Font Awesome:** Biblioteca de iconos para elementos visuales.

### Backend (Mencionado en el desarrollo, pero no incluido en este repositorio Frontend)
* **Node.js:** Entorno de ejecución de JavaScript para el servidor.
* **Express.js:** Framework web para construir la API RESTful (CRUD y gestión de datos).

### Herramientas
* **Git:** Sistema de control de versiones.
* **GitHub:** Plataforma de alojamiento de repositorios.
* **Formspree:** Servicio para el procesamiento de formularios de contacto sin necesidad de un backend propio para esta función.
* **Visual Studio Code:** Editor de código.

## 🚀 Cómo Ejecutar el Proyecto Localmente

Para ver y probar esta aplicación web en tu entorno local:

1.  **Clona el Repositorio:**
    ```bash
    git clone [https://github.com/yonath10/Profutbol.git](https://github.com/yonath10/Profutbol.git)
    cd Profutbol # Asegúrate de que el nombre del repo sea correcto
    ```
2.  **Abrir en el Navegador:**
    * Este es un proyecto puramente frontend (excepto la parte de Formspree). Simplemente abre el archivo `index.html` en tu navegador web preferido (`Chrome`, `Firefox`, `Edge`, etc.).
    * Para una experiencia de desarrollo más robusta (con "live server"), puedes usar extensiones como `Live Server` en Visual Studio Code.

3.  **Configuración de Formspree (para el formulario de contacto):**
    * Ve a [Formspree.io](https://formspree.io/) y crea una cuenta.
    * Crea un nuevo formulario y copia el "Form ID" que te proporcionan (ej. `xvovqjza`).
    * En `contacto.html`, busca la línea del formulario y reemplaza `YOUR_FORMSPREE_FORM_ID` con tu ID real:
        ```html
        <form action="[https://formspree.io/f/YOUR_FORMSPREE_FORM_ID](https://formspree.io/f/YOUR_FORMSPREE_FORM_ID)" method="POST" class="contact-form">
        ```
    * Realiza un primer envío de prueba desde el navegador para activar tu formulario en Formspree.
