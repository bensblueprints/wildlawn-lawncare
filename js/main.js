/**
 * WildLawn Lawncare LLC - Main JavaScript
 * Vanilla JS, no frameworks
 */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. Navbar Scroll Effect
  //    Adds .scrolled class to navbar after scrolling 50px
  // ============================================================
  const navbar = document.querySelector('.navbar');

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll);
  // Run once on load in case page is already scrolled
  handleNavbarScroll();


  // ============================================================
  // 2. Smooth Scrolling for Anchor Links
  //    Intercepts clicks on all internal anchor links
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });


  // ============================================================
  // 3. Mobile Menu Toggle
  //    Hamburger button toggles .active on nav menu,
  //    adds .scroll-lock on body, animates hamburger to X
  // ============================================================
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  function toggleMobileMenu() {
    if (!hamburger || !navMenu) return;

    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('scroll-lock');
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
  }


  // ============================================================
  // 4. Close Mobile Menu on Nav Link Click
  //    Clicking any nav link inside the menu closes it
  // ============================================================
  if (navMenu) {
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
          hamburger.classList.remove('active');
          navMenu.classList.remove('active');
          document.body.classList.remove('scroll-lock');
        }
      });
    });
  }


  // ============================================================
  // 5. Intersection Observer for fadeUp Animations
  //    Observes all .fadeUp elements, adds .visible when 20%
  //    visible, then unobserves
  // ============================================================
  const fadeUpElements = document.querySelectorAll('.fadeUp');

  if (fadeUpElements.length > 0) {
    const fadeUpObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 13. Stagger animations using data-delay attribute
          const delay = entry.target.dataset.delay || 0;
          entry.target.style.transitionDelay = `${delay}ms`;

          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });

    fadeUpElements.forEach(el => fadeUpObserver.observe(el));
  }


  // ============================================================
  // 6. FAQ Accordion
  //    Click toggles .active on FAQ item, rotates icon.
  //    Only one FAQ open at a time.
  // ============================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other FAQ items first (only one open at a time)
      faqItems.forEach(other => {
        other.classList.remove('active');
      });

      // Toggle the clicked item (open if it was closed, stay closed if it was open)
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });


  // ============================================================
  // 7. Contact Form Handling
  //    - Client-side validation (name, email, phone required)
  //    - Honeypot spam check
  //    - Fetch POST to Netlify function
  //    - Loading, success, and error states
  //    - Reset form after success
  // ============================================================
  const contactForm = document.querySelector('#contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Grab form fields
      const nameField = contactForm.querySelector('[name="name"]');
      const emailField = contactForm.querySelector('[name="email"]');
      const phoneField = contactForm.querySelector('[name="phone"]');
      const messageField = contactForm.querySelector('[name="message"]');
      const honeypot = contactForm.querySelector('[name="bot-field"]');
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const successMsg = contactForm.querySelector('.form-success');
      const errorMsg = contactForm.querySelector('.form-error');

      // Reset previous messages
      if (successMsg) successMsg.classList.remove('active');
      if (errorMsg) errorMsg.classList.remove('active');

      // Honeypot spam check - silently reject if filled
      if (honeypot && honeypot.value) {
        // Bot detected, fake a success to avoid tipping off spammers
        if (successMsg) successMsg.classList.add('active');
        contactForm.reset();
        return;
      }

      // Client-side validation
      const name = nameField ? nameField.value.trim() : '';
      const email = emailField ? emailField.value.trim() : '';
      const phone = phoneField ? phoneField.value.trim() : '';
      const message = messageField ? messageField.value.trim() : '';

      if (!name || !email || !phone) {
        if (errorMsg) {
          errorMsg.textContent = 'Please fill in all required fields (name, email, phone).';
          errorMsg.classList.add('active');
        }
        return;
      }

      // Basic email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        if (errorMsg) {
          errorMsg.textContent = 'Please enter a valid email address.';
          errorMsg.classList.add('active');
        }
        return;
      }

      // Show loading state
      const originalBtnText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
      }

      // Submit via fetch POST to Netlify function
      try {
        const response = await fetch('/.netlify/functions/submit-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, message })
        });

        if (!response.ok) {
          throw new Error('Server returned an error.');
        }

        // Success
        if (successMsg) {
          successMsg.textContent = 'Thank you! We\'ll be in touch soon.';
          successMsg.classList.add('active');
        }
        contactForm.reset();

      } catch (err) {
        // Error
        if (errorMsg) {
          errorMsg.textContent = 'Something went wrong. Please try again or call us directly.';
          errorMsg.classList.add('active');
        }
      } finally {
        // Restore button state
        if (submitBtn) {
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
        }
      }
    });
  }


  // ============================================================
  // 8. Floating CTA Button
  //    Show after scrolling 300px
  // ============================================================
  const floatingCta = document.querySelector('.floating-cta');

  function handleFloatingCta() {
    if (!floatingCta) return;
    if (window.scrollY > 300) {
      floatingCta.classList.add('visible');
    } else {
      floatingCta.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleFloatingCta);
  handleFloatingCta();


  // ============================================================
  // 9. Back-to-Top Button
  //    Smooth scrolls to top on click
  // ============================================================
  const backToTop = document.querySelector('.back-to-top');

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // ============================================================
  // 10. Dynamic Copyright Year
  //     Updates footer copyright with the current year
  // ============================================================
  const yearEl = document.querySelector('#year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  // ============================================================
  // 11. Active Nav Link Highlighting Based on Scroll Position
  //     Highlights the nav link whose section is currently in view
  // ============================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

  function highlightActiveNavLink() {
    const scrollPos = window.scrollY + 100; // offset for navbar height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        // Remove active from all nav links
        navLinks.forEach(link => link.classList.remove('active'));

        // Add active to the matching nav link
        const activeLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', highlightActiveNavLink);
  highlightActiveNavLink();


  // ============================================================
  // 12. Stats Counter Animation
  //     Animates numbers from 0 to their target value when
  //     the element scrolls into view (Intersection Observer)
  // ============================================================
  const statNumbers = document.querySelectorAll('.stat-number');

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;

    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    function updateCount(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out curve for a natural deceleration feel
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(eased * target);

      el.textContent = currentValue.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        // Ensure final value is exact
        el.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(updateCount);
  }

  if (statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });

    statNumbers.forEach(el => statsObserver.observe(el));
  }

  // ============================================================
  // 14. Color Theme Picker
  //     4 themes: green (default), orange, black/white, blue
  // ============================================================
  const themes = {
    green:  { accent: '#48BB78', light: '#68D391', dark: '#38A169', glow: 'rgba(72,187,120,0.15)', glowStrong: 'rgba(72,187,120,0.35)' },
    orange: { accent: '#E07C3E', light: '#F0A060', dark: '#C06830', glow: 'rgba(224,124,62,0.15)', glowStrong: 'rgba(224,124,62,0.35)' },
    black:  { accent: '#FFFFFF', light: '#E0E0E0', dark: '#CCCCCC', glow: 'rgba(255,255,255,0.1)', glowStrong: 'rgba(255,255,255,0.2)' },
    blue:   { accent: '#4A90D9', light: '#6DAAEE', dark: '#3A78BF', glow: 'rgba(74,144,217,0.15)', glowStrong: 'rgba(74,144,217,0.35)' },
  };

  function applyTheme(name) {
    const t = themes[name];
    if (!t) return;
    const root = document.documentElement;
    root.style.setProperty('--accent', t.accent);
    root.style.setProperty('--accent-light', t.light);
    root.style.setProperty('--accent-dark', t.dark);
    root.style.setProperty('--accent-glow', t.glow);
    root.style.setProperty('--accent-glow-strong', t.glowStrong);

    // Update all hardcoded accent colors in inline styles
    document.querySelectorAll('.accent').forEach(el => el.style.color = t.accent);
    document.querySelectorAll('.nav-cta').forEach(el => {
      el.style.background = t.accent;
    });
    document.querySelectorAll('.btn-primary').forEach(el => {
      el.style.background = t.accent;
    });
    document.querySelectorAll('.floating-cta-btn').forEach(el => {
      el.style.background = t.accent;
    });

    // Update active swatch
    document.querySelectorAll('.color-swatch').forEach(s => {
      s.classList.toggle('active', s.dataset.theme === name);
    });

    // Save preference
    localStorage.setItem('wildlawn_theme', name);
  }

  // Color picker toggle
  const pickerBtn = document.getElementById('colorPickerBtn');
  const pickerDropdown = document.getElementById('colorPickerDropdown');
  if (pickerBtn && pickerDropdown) {
    pickerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      pickerDropdown.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.color-picker-wrap')) {
        pickerDropdown.classList.remove('active');
      }
    });
    document.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        applyTheme(swatch.dataset.theme);
        pickerDropdown.classList.remove('active');
      });
    });
  }

  // Load saved theme
  const savedTheme = localStorage.getItem('wildlawn_theme');
  if (savedTheme && themes[savedTheme]) {
    applyTheme(savedTheme);
  }

  // ============================================================
  // 15. Floating Schedule Service Widget
  //     Toggle menu on click, close on outside click
  // ============================================================
  const floatingBtn = document.getElementById('floatingCtaBtn');
  const floatingMenu = document.getElementById('floatingCtaMenu');

  if (floatingBtn && floatingMenu) {
    floatingBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      floatingMenu.classList.toggle('active');
      // Rotate icon when open
      floatingBtn.style.transform = floatingMenu.classList.contains('active') ? 'rotate(135deg)' : '';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.floating-cta-wrap')) {
        floatingMenu.classList.remove('active');
        floatingBtn.style.transform = '';
      }
    });

    // Close menu after clicking an option
    floatingMenu.querySelectorAll('.floating-cta-option').forEach(opt => {
      opt.addEventListener('click', () => {
        setTimeout(() => {
          floatingMenu.classList.remove('active');
          floatingBtn.style.transform = '';
        }, 300);
      });
    });
  }

  // ============================================================
  // 15. AI Receptionist (11 Labs Integration)
  //     Only enabled when ELEVENLABS_AGENT_ID is configured
  //     Check localStorage for admin-set config
  // ============================================================
  const aiConfig = JSON.parse(localStorage.getItem('wildlawn_ai_config') || '{}');
  const aiOption = document.getElementById('aiReceptionistOption');

  if (aiConfig.enabled && aiConfig.agentId && aiOption) {
    aiOption.classList.add('enabled');
  }

});

/**
 * Start AI Receptionist via ElevenLabs Conversational AI
 * Only called when AI option is enabled via admin panel
 */
function startAIReceptionist() {
  const config = JSON.parse(localStorage.getItem('wildlawn_ai_config') || '{}');
  if (!config.enabled || !config.agentId) {
    alert('AI Receptionist is not configured. Please enable it in the admin panel.');
    return;
  }

  // Check if ElevenLabs widget script is loaded
  if (!document.getElementById('elevenlabs-script')) {
    const script = document.createElement('script');
    script.id = 'elevenlabs-script';
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;
    script.onload = () => launchElevenLabsWidget(config.agentId);
    document.head.appendChild(script);
  } else {
    launchElevenLabsWidget(config.agentId);
  }
}

function launchElevenLabsWidget(agentId) {
  // Create or show the ElevenLabs convai widget
  let widget = document.getElementById('elevenlabs-widget');
  if (!widget) {
    widget = document.createElement('elevenlabs-convai');
    widget.id = 'elevenlabs-widget';
    widget.setAttribute('agent-id', agentId);
    document.body.appendChild(widget);
  } else {
    widget.style.display = '';
  }
}
