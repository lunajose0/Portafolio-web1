// Create a vanilla JavaScript SPA portfolio
document.addEventListener('DOMContentLoaded', () => {
  // Navigation & scrolling functionality
  let seccionActiva = 'home';
  let progresoScroll = 0;
  let esModoOscuro = localStorage.getItem('modoOscuro') === 'true';
  
  const secciones = ['home', 'about', 'projects', 'experience', 'contact'];
  const contenidoPrincipal = document.getElementById('main-content');
  const indicadorCarga = document.getElementById('loading-indicator');
  const modalPdf = document.getElementById('pdf-modal');
  const iframePdf = document.getElementById('pdf-iframe');
  const cerrarModal = document.querySelector('.close-modal');
  const cambiarTema = document.querySelector('.theme-toggle');
  const botonMenu = document.querySelector('.hamburger');
  const enlacesNav = document.querySelector('.nav-links');
  
  // Initialize dark mode if set in localStorage
  if (esModoOscuro) {
    document.body.classList.add('dark-mode');
  }
  
  // Hamburger menu functionality
  botonMenu.addEventListener('click', () => {
    botonMenu.classList.toggle('open');
    enlacesNav.classList.toggle('open');
    document.body.classList.toggle('menu-open');
  });
  
  // Close mobile menu when clicking on a link
  document.querySelectorAll('.nav-link').forEach(enlace => {
    enlace.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        botonMenu.classList.remove('open');
        enlacesNav.classList.remove('open');
        document.body.classList.remove('menu-open');
      }
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && 
        enlacesNav.classList.contains('open') && 
        !enlacesNav.contains(e.target) && 
        !botonMenu.contains(e.target)) {
      botonMenu.classList.remove('open');
      enlacesNav.classList.remove('open');
      document.body.classList.remove('menu-open');
    }
  });
  
  // Theme toggle functionality
  cambiarTema.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    esModoOscuro = document.body.classList.contains('dark-mode');
    localStorage.setItem('modoOscuro', esModoOscuro);
    
    // Update background colors for shapes when theme changes
    const formas = document.querySelectorAll('.shape');
    const colores = document.body.classList.contains('dark-mode') ? 
      ['#3498db', '#2ecc71', '#9b59b6', '#f1c40f', '#e74c3c'] : 
      ['#64f4ac', '#4ca1f4', '#f44ca1', '#f4ca4c', '#9f4cf4'];
    
    formas.forEach(forma => {
      forma.style.backgroundColor = colores[Math.floor(Math.random() * colores.length)];
    });
  });
  
  // Update navigation and progress bar on scroll
  const manejarScroll = () => {
    // Update scroll progress for progress bar
    const alturaTotal = document.body.scrollHeight - window.innerHeight;
    progresoScroll = window.scrollY / alturaTotal * 100;
    document.querySelector('.progress-bar').style.width = `${progresoScroll}%`;
    
    // Calculate which section is currently active
    for (const seccion of secciones) {
      const elemento = document.getElementById(seccion);
      if (elemento) {
        const rect = elemento.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          if (seccionActiva !== seccion) {
            document.querySelectorAll('.nav-link').forEach(enlace => {
              enlace.classList.remove('active');
            });
            document.querySelector(`.nav-link[data-section="${seccion}"]`).classList.add('active');
            seccionActiva = seccion;
            // Update URL with hash without scrolling
            history.pushState(null, null, `#${seccion}`);
          }
          break;
        }
      }
    }
  };
  
  window.addEventListener('scroll', manejarScroll);
  
  // Set up navigation click handlers for SPA functionality
  document.querySelectorAll('.nav-link, .footer-link a').forEach(enlace => {
    enlace.addEventListener('click', (e) => {
      e.preventDefault();
      const idSeccion = enlace.getAttribute('data-section');
      
      // Show loading indicator
      indicadorCarga.classList.add('active');
      
      // Simulate content loading delay
      setTimeout(() => {
        // Hide all sections
        secciones.forEach(seccion => {
          document.getElementById(seccion).style.display = 'none';
        });
        
        // Show selected section
        document.getElementById(idSeccion).style.display = 'flex';
        
        // Update URL without page refresh
        history.pushState(null, null, `#${idSeccion}`);
        
        // Update active navigation link
        document.querySelectorAll('.nav-link').forEach(navEnlace => {
          navEnlace.classList.remove('active');
        });
        document.querySelector(`.nav-link[data-section="${idSeccion}"]`).classList.add('active');
        seccionActiva = idSeccion;
        
        // Hide loading indicator
        indicadorCarga.classList.remove('active');
        
        // Smooth scroll to top of the section
        window.scrollTo({
          top: document.getElementById(idSeccion).offsetTop,
          behavior: 'smooth'
        });
      }, 300);
    });
  });
  
  // Handle browser back/forward buttons
  window.addEventListener('popstate', () => {
    const idSeccion = window.location.hash.replace('#', '') || 'home';
    
    // Hide all sections
    secciones.forEach(seccion => {
      document.getElementById(seccion).style.display = 'none';
    });
    
    // Show selected section
    document.getElementById(idSeccion).style.display = 'flex';
    
    // Update active navigation link
    document.querySelectorAll('.nav-link').forEach(navEnlace => {
      navEnlace.classList.remove('active');
    });
    document.querySelector(`.nav-link[data-section="${idSeccion}"]`).classList.add('active');
    seccionActiva = idSeccion;
  });
  
  // Initialize the SPA by showing the section in the URL or home
  const seccionInicial = window.location.hash.replace('#', '') || 'home';
  secciones.forEach(seccion => {
    if (seccion !== seccionInicial) {
      document.getElementById(seccion).style.display = 'none';
    }
  });
  document.querySelector(`.nav-link[data-section="${seccionInicial}"]`).classList.add('active');
  seccionActiva = seccionInicial;
  
  // Hero CTA button
  document.querySelector('.hero-cta').addEventListener('click', () => {
    document.querySelectorAll('.nav-link').forEach(navEnlace => {
      navEnlace.classList.remove('active');
    });
    document.querySelector('.nav-link[data-section="projects"]').classList.add('active');
    
    // Hide all sections
    secciones.forEach(seccion => {
      document.getElementById(seccion).style.display = 'none';
    });
    
    // Show projects section
    document.getElementById('projects').style.display = 'flex';
    
    // Update URL without page refresh
    history.pushState(null, null, '#projects');
    seccionActiva = 'projects';
    
    // Smooth scroll to top of the section
    window.scrollTo({
      top: document.getElementById('projects').offsetTop,
      behavior: 'smooth'
    });
  });
  
  // Contact form handling
  const formularioContacto = document.querySelector('.contact-form');
  if (formularioContacto) {
    formularioContacto.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('¡Gracias por tu mensaje! Este es un formulario de demostración.');
    });
  }
  
  // PDF viewer functionality
  document.querySelectorAll('.certificate-link, .cv-button').forEach(enlace => {
    enlace.addEventListener('click', (e) => {
      e.preventDefault();
      const archivoPdf = enlace.getAttribute('data-pdf');
      iframePdf.src = archivoPdf;
      modalPdf.style.display = 'block';
      document.body.style.overflow = 'hidden';
    });
  });
  
  cerrarModal.addEventListener('click', () => {
    modalPdf.style.display = 'none';
    document.body.style.overflow = 'auto';
  });
  
  window.addEventListener('click', (e) => {
    if (e.target === modalPdf) {
      modalPdf.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
  
  // Create dynamic background
  crearFondoDinamico();
  
  // Apply advanced animations
  aplicarAnimacionesAvanzadas();
  
  // Create floating social media buttons
  crearBotonesFlotantes();
  
  // Handle window resize events to adapt UI dynamically
  window.addEventListener('resize', () => {
    // Adjust any dynamic elements that need repositioning on resize
    if (window.innerWidth <= 768) {
      // Mobile optimizations
      document.querySelectorAll('.floating-btn span').forEach(span => {
        span.style.display = 'none';
      });
    } else {
      // Desktop optimizations
      document.querySelectorAll('.floating-btn span').forEach(span => {
        span.style.display = 'block';
      });
    }
  });
  
  // Create dynamic background with shapes
  function crearFondoDinamico() {
    const contenedor = document.createElement('div');
    contenedor.className = 'dynamic-background';
    
    const formas = document.createElement('div');
    formas.className = 'background-shapes';
    
    // Create multiple shapes with different colors, sizes and positions
    const colores = esModoOscuro ? 
      ['#3498db', '#2ecc71', '#9b59b6', '#f1c40f', '#e74c3c'] : 
      ['#64f4ac', '#4ca1f4', '#f44ca1', '#f4ca4c', '#9f4cf4'];
    
    for (let i = 0; i < 15; i++) {
      const forma = document.createElement('div');
      forma.className = 'shape';
      const tamaño = Math.random() * 300 + 100;
      const color = colores[Math.floor(Math.random() * colores.length)];
      
      forma.style.width = `${tamaño}px`;
      forma.style.height = `${tamaño}px`;
      forma.style.backgroundColor = color;
      forma.style.left = `${Math.random() * 100}%`;
      forma.style.top = `${Math.random() * 100}%`;
      forma.style.animationDuration = `${Math.random() * 10 + 10}s`;
      forma.style.animationDelay = `${Math.random() * 5}s`;
      
      formas.appendChild(forma);
    }
    
    contenedor.appendChild(formas);
    document.body.insertBefore(contenedor, document.body.firstChild);
  }
  
  // Apply advanced animations 
  function aplicarAnimacionesAvanzadas() {
    // Reveal animations with delays for elements
    document.querySelectorAll('.animate-on-scroll').forEach((el, indice) => {
      el.classList.add('reveal-animation');
      el.style.animationDelay = `${indice * 0.1}s`;
    });
    
    // Initialize typing animation for hero title
    iniciarAnimacionEscritura();
    
    // Add pop animation to skill items
    document.querySelectorAll('.skill-item').forEach((el, indice) => {
      el.classList.add('pop-animation');
      el.style.animationDelay = `${0.1 + indice * 0.1}s`;
    });
  }
  
  // Initialize the typing animation effect for the hero title
  function iniciarAnimacionEscritura() {
    const tituloHero = document.querySelector('.hero-title');
    const textoOriginal = tituloHero.innerHTML;
    const spanNombre = tituloHero.querySelector('.highlight');
    const nombreOriginal = spanNombre.textContent;
    
    // The phrases to cycle through
    const frases = [
      nombreOriginal,
      "Programador",
      "Entusiasta",
      "Full Stack"
    ];
    
    let indiceFrase = 0;
    let indiceCaracter = 0;
    let estaBorrando = false;
    let velocidadEscritura = 150;
    
    function escribirTexto() {
      const fraseActual = frases[indiceFrase];
      
      if (estaBorrando) {
        // Deleting text
        spanNombre.textContent = fraseActual.substring(0, indiceCaracter - 1) + (indiceCaracter > 0 ? '|' : '');
        indiceCaracter--;
        velocidadEscritura = 100;
      } else {
        // Typing text
        spanNombre.textContent = fraseActual.substring(0, indiceCaracter + 1) + '|';
        indiceCaracter++;
        velocidadEscritura = 150;
      }
      
      // If finished typing the current phrase
      if (!estaBorrando && indiceCaracter === fraseActual.length) {
        velocidadEscritura = 1500; // Pause at the end of typing
        estaBorrando = true;
      } 
      // If finished deleting the current phrase
      else if (estaBorrando && indiceCaracter === 0) {
        estaBorrando = false;
        indiceFrase = (indiceFrase + 1) % frases.length;
        velocidadEscritura = 500; // Pause before starting new phrase
      }
      
      setTimeout(escribirTexto, velocidadEscritura);
    }
    
    // Remove the typing animation class that was added earlier
    tituloHero.classList.remove('typing-animation');
    
    // Start the typing animation
    setTimeout(escribirTexto, 1500);
  }
  
  function crearBotonesFlotantes() {
    const contenedorSocial = document.createElement('div');
    contenedorSocial.className = 'floating-social';
    
    // WhatsApp button
    const botonWhatsapp = document.createElement('a');
    botonWhatsapp.className = 'floating-btn whatsapp';
    botonWhatsapp.href = 'https://wa.me/+59893395151';
    botonWhatsapp.target = '_blank';
    botonWhatsapp.innerHTML = '<i class="fab fa-whatsapp"></i><span>WhatsApp</span>';
    
    // GitHub button
    const botonGithub = document.createElement('a');
    botonGithub.className = 'floating-btn github';
    botonGithub.href = 'https://github.com/lunajose0';
    botonGithub.target = '_blank';
    botonGithub.innerHTML = '<i class="fab fa-github"></i><span>GitHub</span>';
    
    // LinkedIn button
    const botonLinkedin = document.createElement('a');
    botonLinkedin.className = 'floating-btn linkedin';
    botonLinkedin.href = 'https://www.linkedin.com/in/jose-luna-br10/';
    botonLinkedin.target = '_blank';
    botonLinkedin.innerHTML = '<i class="fab fa-linkedin-in"></i><span>LinkedIn</span>';
    
    contenedorSocial.appendChild(botonWhatsapp);
    contenedorSocial.appendChild(botonGithub);
    contenedorSocial.appendChild(botonLinkedin);
    
    document.body.appendChild(contenedorSocial);
  }
  
  // Add basic animations with IntersectionObserver
  const animarAlScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    animarAlScroll.observe(el);
  });
});