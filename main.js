/* ─── ROUTING ────────────────────────────────────────────────── */
const pages = {
  home:     document.getElementById('page-home'),
  writeups: document.getElementById('page-writeups'),
  malware:  document.getElementById('page-malware'),
  about:    document.getElementById('page-about'),
};

const navLinks = document.querySelectorAll('.nav-link');
const mobileLinks = document.querySelectorAll('.mobile-link');

function navigate(pageId) {
  if (!pages[pageId]) return;

  Object.values(pages).forEach(p => p.classList.remove('active'));
  pages[pageId].classList.add('active');

  navLinks.forEach(l => {
    l.classList.toggle('active', l.dataset.page === pageId);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
  closeMobile();
}

/* Click delegation — anything with data-page navigates */
document.addEventListener('click', e => {
  const target = e.target.closest('[data-page]');
  if (!target) return;
  const page = target.dataset.page;
  if (pages[page]) {
    e.preventDefault();
    navigate(page);
  }
});

/* ─── MOBILE MENU ────────────────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

navToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  navToggle.classList.toggle('open');
});

function closeMobile() {
  mobileMenu.classList.remove('open');
  navToggle.classList.remove('open');
}

/* ─── NAV SCROLL EFFECT ──────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.borderBottomColor = window.scrollY > 20 ? '#1e1e1e' : '#222222';
}, { passive: true });

/* ─── WRITEUP FILTER ─────────────────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const writeupCards = document.querySelectorAll('.writeup-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    writeupCards.forEach(card => {
      if (filter === 'all' || card.dataset.difficulty === filter) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

/* ─── INIT ───────────────────────────────────────────────────── */
navigate('home');
