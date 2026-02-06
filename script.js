document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. DYNAMIC YEAR (Footer)
    // ==========================================
    const yearSpan = document.getElementById('year');
    if(yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ==========================================
    // 2. MOBILE MENU TOGGLE
    // ==========================================
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    
    if(menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            // Toggles a CSS class to show/hide menu on mobile
            nav.classList.toggle('active');
        });
    }

    // ==========================================
    // 3. DARK MODE TOGGLE
    // ==========================================
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Check if user previously preferred dark mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }

    if(themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            // Save preference
            if(body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // ==========================================
    // 4. PROJECT FILTERING
    // ==========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const tags = card.getAttribute('data-tags');
                if (filterValue === 'all' || tags.includes(filterValue)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ==========================================
    // FIX EMAIL BUTTON (Scroll to Form)
    // ==========================================
    // This finds the button that links to your email
    const emailButton = document.querySelector('a[href^="mailto:"]');
    const contactSection = document.getElementById('contact');
    const firstInput = document.getElementById('name');

    if (emailButton && contactSection) {
        emailButton.addEventListener('click', (e) => {
            // 1. Prevent the default "Open Mail App" behavior
            e.preventDefault();

            // 2. Smoothly scroll to the Contact section
            contactSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });

            // 3. Focus on the Name input field (so they can type immediately)
            if (firstInput) {
                // Small delay to allow scrolling to finish
                setTimeout(() => {
                    firstInput.focus();
                }, 800);
            }
        });
    }

    // ==========================================
    // 5. INTERNATIONALIZATION (German/English)
    // ==========================================
    const langToggle = document.getElementById('langToggle');
    const translatableElements = document.querySelectorAll('[data-i18n]');

    // The Dictionary
    const translations = {
        en: {
            nav_projects: "Projects",
            nav_skills: "Skills",
            nav_edu: "Education",
            nav_contact: "Contact",
            hero_hi: "Hi, I'm",
            // Note: We handle the HTML/Bold tags specifically in the function below
            hero_desc_html: `Motivated Frontend Developer transitioning to **Full Stack**. Strong foundation in HTML, CSS and JavaScript — currently expanding into the <strong>MERN Stack</strong> (MongoDB, Express, React, Node) to build scalable, production-ready applications.`,
            btn_projects: "See Projects",
            btn_email: "Email Me",
            contact_header: "Get in touch",
            form_send: "Send Message"
        },
        de: {
            nav_projects: "Projekte",
            nav_skills: "Fähigkeiten",
            nav_edu: "Ausbildung",
            nav_contact: "Kontakt",
            hero_hi: "Hallo, ich bin",
            hero_desc_html: `Motivierter Frontend-Entwickler auf dem Weg zum <strong>Full Stack</strong>. Starkes Fundament in HTML, CSS und JavaScript – aktuell spezialisiere ich mich auf den <strong>MERN-Stack</strong>, um skalierbare Anwendungen zu entwickeln.`,
            btn_projects: "Projekte ansehen",
            btn_email: "Schreib mir",
            contact_header: "Kontakt aufnehmen",
            form_send: "Nachricht senden"
        }
    };

    let currentLang = localStorage.getItem('lang') || 'en';

    function updateLanguage(lang) {
        // Update Toggle Button Text
        if(langToggle) langToggle.textContent = lang === 'en' ? 'DE' : 'EN';

        // Update Text Elements
        translatableElements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            
            // Special handling for the Hero Description to keep the Bold text
            if (key === 'hero_desc') {
                el.innerHTML = translations[lang]['hero_desc_html'];
            } 
            else if (translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });

        // Update Form Button explicitly
        const formBtn = document.getElementById('submitBtn');
        if(formBtn) formBtn.textContent = translations[lang]['form_send'];
    }

    // Initialize Language
    updateLanguage(currentLang);

    if(langToggle) {
        langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'de' : 'en';
            localStorage.setItem('lang', currentLang);
            updateLanguage(currentLang);
        });
    }

    // ==========================================
    // 6. CONTACT FORM HANDLING (Web3Forms)
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Stop page reload

            // 1. Show Loading State
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = currentLang === 'en' ? 'Sending...' : 'Senden...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            // 2. Prepare Data
            const formData = new FormData(contactForm);

            try {
                // 3. Send to Web3Forms API
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    // Success Message
                    formStatus.textContent = currentLang === 'en' 
                        ? "Message sent successfully!" 
                        : "Nachricht erfolgreich gesendet!";
                    formStatus.style.color = "#4ade80"; // Green
                    contactForm.reset();
                } else {
                    // Error Message
                    formStatus.textContent = currentLang === 'en' 
                        ? "Something went wrong. Please try again." 
                        : "Etwas ist schief gelaufen. Bitte versuche es erneut.";
                    formStatus.style.color = "#f87171"; // Red
                }
            } catch (error) {
                console.error("Error:", error);
                formStatus.textContent = "Network error.";
                formStatus.style.color = "#f87171";
            } finally {
                // Reset Button
                setTimeout(() => {
                    submitBtn.textContent = originalBtnText; // Restore original text (Send Message/Nachricht senden)
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    formStatus.textContent = "";
                }, 5000);
            }
        });
    }
});