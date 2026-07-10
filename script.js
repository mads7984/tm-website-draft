// Tower Medic Pharmacy mobile navigation
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  toggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
  nav.classList.toggle('open', !open);
});

nav.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
});

// Add the review link consistently to the bottom of every page.
const footerBottom = document.querySelector('.footer-bottom');

// Keep the legal notice available in every footer without adding it to navigation.
if (!footerBottom.querySelector('.privacy-link')) {
  const privacyLink = document.createElement('a');
  privacyLink.className = 'privacy-link';
  privacyLink.href = 'privacy.html';
  privacyLink.textContent = 'HIPAA Privacy Notice';
  footerBottom.appendChild(privacyLink);
}

const reviewButton = document.createElement('a');
reviewButton.className = 'review-button';
reviewButton.href = 'https://g.page/r/CbZ0r3sUOhBYEB0/review';
reviewButton.textContent = 'Leave a Google review';
footerBottom.appendChild(reviewButton);
