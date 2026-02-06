document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. DYNAMIC YEAR (Footer)
    // ==========================================
    const yearSpan = document.getElementById('year');
    if(yearSpan) yearSpan.textContent = new Date().getFullYear();

    // ==========================================
    // 2. MOBILE MENU TOGGLE
    // ==========================================
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    
    if(menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }

    // ==========================================
    // 3. THEME TOGGLE (Fixed: Uses data-theme)
    // ==========================================
    // This connects to the CSS [data-theme="light"] logic
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement; // Targets the <html> tag
    
    // Check saved preference on load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        html.setAttribute('data-theme', 'light');
    } else {
        html.removeAttribute('data-theme'); // Default is Dark
    }

    if(themeToggle) {
        themeToggle.addEventListener('click', () => {
            // If currently light, switch to dark
            if (html.getAttribute('data-theme') === 'light') {
                html.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
            } 
            // If currently dark, switch to light
            else {
                html.setAttribute('data-theme', 'light');
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
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const tags = card.getAttribute('data-tags');
                if (filterValue === 'all' || tags.includes(filterValue)) {
                    card.style.display = 'flex'; // Use flex to keep layout
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ==========================================
    // 5. FIX EMAIL BUTTON (Smooth Scroll)
    // ==========================================
    const emailButton = document.querySelector('a[href^="mailto:"]');
    const contactSection = document.getElementById('contact');
    const firstInput = document.getElementById('name');

    if (emailButton && contactSection) {
        emailButton.addEventListener('click', (e) => {
            e.preventDefault(); // Stop opening mail app
            contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Focus on input
            if (firstInput) {
                setTimeout(() => { firstInput.focus(); }, 800);
            }
        });
    }

    // ==========================================
    // 6. INTERNATIONALIZATION (German/English)
    // ==========================================
    const langToggle = document.getElementById('langToggle');
    const translatableElements = document.querySelectorAll('[data-i18n]');

    const translations = {
        en: {
            nav_projects: "Projects",
            nav_skills: "Skills",
            nav_edu: "Education",
            nav_contact: "Contact",
            hero_hi: "Hi, I'm",
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
    // 7. CONTACT FORM HANDLING (Web3Forms)
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Dynamic loading text based on language
            submitBtn.textContent = currentLang === 'en' ? 'Sending...' : 'Senden...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            const formData = new FormData(contactForm);

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST', body: formData
                });
                const result = await response.json();

                if (result.success) {
                    formStatus.textContent = currentLang === 'en' 
                        ? "Message sent successfully!" 
                        : "Nachricht erfolgreich gesendet!";
                    formStatus.style.color = "#4ade80"; // Green
                    contactForm.reset();
                } else {
                    formStatus.textContent = currentLang === 'en' 
                        ? "Something went wrong." 
                        : "Etwas ist schief gelaufen.";
                    formStatus.style.color = "#f87171"; // Red
                }
            } catch (error) {
                formStatus.textContent = "Network error.";
                formStatus.style.color = "#f87171";
            } finally {
                setTimeout(() => {
                    // Restore original text based on current language
                    submitBtn.textContent = translations[currentLang]['form_send'];
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    formStatus.textContent = "";
                }, 4000);
            }
        });
    }
});