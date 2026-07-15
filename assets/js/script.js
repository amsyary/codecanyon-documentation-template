(function () {
  'use strict';

  var sidebar = document.getElementById('sidebar');
  var toggleBtn = document.getElementById('sidebarToggle');
  var overlay = document.getElementById('sidebarOverlay');
  var backToTop = document.getElementById('backToTop');
  var themeToggle = document.getElementById('themeToggle');
  var navLinks = document.querySelectorAll('.nav-link');
  var html = document.documentElement;

  function getStoredTheme() {
    return localStorage.getItem('docTemplateTheme');
  }

  function setStoredTheme(theme) {
    localStorage.setItem('docTemplateTheme', theme);
  }

  function applyTheme(theme) {
    html.setAttribute('data-bs-theme', theme);
    var icon = themeToggle.querySelector('i');
    var label = themeToggle.querySelector('span');
    if (theme === 'dark') {
      icon.className = 'bi bi-sun';
      label.textContent = 'Light Mode';
    } else {
      icon.className = 'bi bi-moon-stars';
      label.textContent = 'Dark Mode';
    }
  }

  var savedTheme = getStoredTheme();
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }

  themeToggle.addEventListener('click', function () {
    var current = html.getAttribute('data-bs-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setStoredTheme(next);
  });

  function openSidebar() {
    sidebar.classList.add('show');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('show');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', function () {
    if (sidebar.classList.contains('show')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  overlay.addEventListener('click', closeSidebar);

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.forEach(function (l) { l.classList.remove('active'); });
      link.classList.add('active');
      if (window.innerWidth < 992) {
        closeSidebar();
      }
    });
  });

  var sections = [];
  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      var target = document.querySelector(href);
      if (target) {
        sections.push({ link: link, target: target, id: href.substring(1) });
      }
    }
  });

  function onScroll() {
    var scrollY = window.scrollY || window.pageYOffset;

    if (scrollY > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    var current = null;
    sections.forEach(function (section) {
      var top = section.target.offsetTop - 80;
      if (scrollY >= top) {
        current = section;
      }
    });

    if (current) {
      navLinks.forEach(function (link) { link.classList.remove('active'); });
      current.link.classList.add('active');
    }
  }

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', onScroll, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 60, behavior: 'smooth' });
      }
    });
  });

  /* Lightbox for screenshots */
  document.querySelectorAll('.screenshot').forEach(function (img) {
    img.addEventListener('click', function () {
      var lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      var clone = img.cloneNode(true);
      clone.style.maxWidth = '90vw';
      clone.style.maxHeight = '90vh';
      lightbox.appendChild(clone);
      document.body.appendChild(lightbox);
      document.body.style.overflow = 'hidden';

      lightbox.addEventListener('click', function () {
        lightbox.remove();
        document.body.style.overflow = '';
      });

      document.addEventListener('keydown', function handler(e) {
        if (e.key === 'Escape') {
          lightbox.remove();
          document.body.style.overflow = '';
          document.removeEventListener('keydown', handler);
        }
      });
    });
  });

})();
