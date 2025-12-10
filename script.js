// small helper utilities
const qs = (s) => document.querySelector(s);
const qsa = (s) => Array.from(document.querySelectorAll(s));

// set current year
qs('#year').textContent = new Date().getFullYear();

// mobile menu toggle
const menuToggle = qs('#menuToggle');
const nav = qs('#nav');
menuToggle && menuToggle.addEventListener('click', () => {
  if (nav.style.display === 'flex') nav.style.display = '';
  else nav.style.display = 'flex';
});

// theme toggle (light/dark baseline)
const themeToggle = qs('#themeToggle');
themeToggle && themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('light');
  // optional: persist theme with localStorage
  try { localStorage.setItem('pref-theme', document.documentElement.classList.contains('light') ? 'light' : 'dark'); } catch(e){}
});

// restore theme preference
try {
  const pref = localStorage.getItem('pref-theme');
  if (pref === 'light') document.documentElement.classList.add('light');
} catch(e){}

// smooth scroll for internal links
qsa('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const el = document.querySelector(href);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({behavior:'smooth', block:'start'});
      if (window.innerWidth < 900) nav.style.display = '';
    }
  });
});

// project filters
const filters = qsa('.filter-btn');
const projects = qsa('.project-card');
filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tag = btn.dataset.filter;
    projects.forEach(p => {
      if (tag === 'all') {
        p.style.display = '';
        return;
      }
      const t = (p.dataset.tags || '');
      p.style.display = t.includes(tag) ? '' : 'none';
    });
  });
});

// simple contact form validation (client-side)
const form = qs('#contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = qs('#name').value.trim();
    const email = qs('#email').value.trim();
    const message = qs('#message').value.trim();
    if (!name || !email || !message) {
      alert('Please fill all fields.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert('Please provide a valid email address.');
      return;
    }
    alert('Message ready — replace alert by hooking up a backend or Netlify Forms.');
    form.reset();
  });
}
