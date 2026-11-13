// Scroll-reveal for project cards on touch/mobile screens
export function initMobileProjectReveal() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

  const cards = document.querySelectorAll<HTMLElement>('.project-article');
  if (!cards.length) return;

  const isTouchDevice = () =>
    window.matchMedia('(hover: none)').matches || window.innerWidth < 768;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (isTouchDevice()) {
          entry.target.classList.toggle('is-visible', entry.isIntersecting);
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    },
    {
      rootMargin: '-20% 0px -25% 0px',
      threshold: 0.15,
    }
  );

  cards.forEach((card) => observer.observe(card));

  window.addEventListener(
    'resize',
    () => {
      if (!isTouchDevice()) {
        cards.forEach((card) => card.classList.remove('is-visible'));
      }
    },
    { passive: true }
  );
}
