/**
 * ==============================================================================
 * PORTFOLIO JAVASCRIPT
 * Author: Tejaswini Sapkal
 * Vanilla ES6+ - Lightweight, Accessible & Dependency-free
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------------------------
     1. Elements Selection
     ---------------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  const navLinkItems = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('back-to-top');
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const contactForm = document.getElementById('contact-form');
  const formToast = document.getElementById('form-toast');
  const currentYearSpan = document.getElementById('current-year');
  const resumeBtn = document.getElementById('resume-btn');

  /* ----------------------------------------------------------------------------
     2. Dynamic Year in Footer
     ---------------------------------------------------------------------------- */
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  /* ----------------------------------------------------------------------------
     3. Mobile Navigation Menu Toggle
     ---------------------------------------------------------------------------- */
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      mobileToggle.classList.toggle('open', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile menu when any navigation link is clicked
    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          mobileToggle.classList.remove('open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close menu when clicking outside of navbar
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ----------------------------------------------------------------------------
     4. Navbar Scroll Elevation & Back-To-Top Button Visibility
     ---------------------------------------------------------------------------- */
  const handleScroll = () => {
    const scrollPos = window.scrollY;

    // Add subtle shadow and solid background when scrolled down
    if (scrollPos > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Toggle Back to Top button
    if (scrollPos > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Scroll to top smooth click
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ----------------------------------------------------------------------------
     5. Active Navigation Link Highlighting on Scroll (Intersection Observer)
     ---------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinkItems.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
  }

  /* ----------------------------------------------------------------------------
     6. Copy Email Address to Clipboard with Visual Feedback
     ---------------------------------------------------------------------------- */
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = 'tejaswini.sapkal07@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        const originalText = copyEmailBtn.textContent;
        copyEmailBtn.textContent = 'Copied!';
        copyEmailBtn.style.backgroundColor = 'var(--accent-peach)';
        copyEmailBtn.style.color = '#FFFFFF';

        setTimeout(() => {
          copyEmailBtn.textContent = originalText;
          copyEmailBtn.style.backgroundColor = '';
          copyEmailBtn.style.color = '';
        }, 2200);
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        copyEmailBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyEmailBtn.textContent = 'Copy';
        }, 2200);
      }
    });
  }

  /* ----------------------------------------------------------------------------
     7. Resume Download Helper
     ---------------------------------------------------------------------------- */
  if (resumeBtn) {
    resumeBtn.addEventListener('click', (e) => {
      // Test if resume file has been provided yet
      // If the default PDF file doesn't exist yet, guide the user gracefully
      fetch(resumeBtn.getAttribute('href'), { method: 'HEAD' })
        .then(response => {
          if (!response.ok) {
            console.info('Resume file not yet uploaded to assets/docs/Tejaswini_Sapkal_Resume.pdf. Please add your PDF file there.');
          }
        })
        .catch(() => {
          // Silent catch in case of local protocol restriction
        });
    });
  }

  /* ----------------------------------------------------------------------------
     8. Contact Form Handling
     ---------------------------------------------------------------------------- */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !subject || !message) {
        alert('Please fill out all the fields in the contact form.');
        return;
      }

      // Format mailto link to open user's native email client with pre-filled content
      const recipient = 'tejaswini.sapkal07@gmail.com';
      const emailSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject} - from ${name}`);
      const emailBody = encodeURIComponent(
        `Hi Tejaswini,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nSent from Portfolio Website`
      );

      const mailtoLink = `mailto:${recipient}?subject=${emailSubject}&body=${emailBody}`;

      // Show friendly confirmation toast on screen
      if (formToast) {
        formToast.classList.add('success');
        formToast.style.display = 'block';
        formToast.textContent = `Thank you, ${name}! Your email client will now open with your message addressed to tejaswini.sapkal07@gmail.com.`;

        setTimeout(() => {
          formToast.style.display = 'none';
        }, 6000);
      }

      // Open email application
      window.location.href = mailtoLink;

      // Reset form
      contactForm.reset();
    });
  }

});
