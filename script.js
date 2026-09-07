const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const navPanel = document.querySelector('.nav-panel');
const revealItems = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('.count');
const choiceCards = document.querySelectorAll('.choice-card');
const track = document.querySelector('.testimonial-track');
const cakeScroll = document.querySelector('.cake-scroll');
const cakeTrack = document.querySelector('.cake-track');
const previousCakeButton = document.querySelector('.carousel-arrow-prev');
const nextCakeButton = document.querySelector('.carousel-arrow-next');

function updateHeaderState() {
  if (!header) return;
  const scrolled = window.scrollY > 30;
  header.classList.toggle('scrolled', scrolled);
}

window.addEventListener('scroll', updateHeaderState);
updateHeaderState();

if (navToggle && navPanel) {
  navToggle.addEventListener('click', () => {
    const isOpen = navPanel.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navPanel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navPanel.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => revealObserver.observe(item));

function animateCounter(node) {
  const target = Number(node.dataset.target || 0);
  const suffix = node.nextElementSibling && node.nextElementSibling.tagName !== 'P' ? node.nextElementSibling.textContent.trim() : '';
  const duration = 1200;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * eased);
    node.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      node.textContent = target;
    }
  }

  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

counters.forEach((counter) => counterObserver.observe(counter));

choiceCards.forEach((card) => {
  card.addEventListener('mouseenter', () => {
    choiceCards.forEach((item) => item.classList.remove('active'));
    card.classList.add('active');
  });

  card.addEventListener('click', () => {
    choiceCards.forEach((item) => item.classList.remove('active'));
    card.classList.add('active');
  });
});

if (track) {
  let index = 0;
  const cards = [...track.children];
  if (cards.length) {
    setInterval(() => {
      index = (index + 1) % cards.length;
      track.style.transform = `translateX(-${index * 100}%)`;
    }, 3500);
  }
}

if (cakeScroll && cakeTrack && previousCakeButton && nextCakeButton) {
  const cakeCards = [...cakeTrack.children];
  let cakeIndex = 0;

  function updateCakeCarousel() {
    const cardWidth = cakeCards[0].getBoundingClientRect().width;
    const gap = Number.parseFloat(getComputedStyle(cakeTrack).columnGap) || 0;
    const visibleWidth = cakeScroll.getBoundingClientRect().width;
    const maxOffset = Math.max(0, cakeTrack.scrollWidth - visibleWidth);
    const offset = Math.min(cakeIndex * (cardWidth + gap), maxOffset);
    cakeTrack.style.transform = `translateX(-${offset}px)`;
    previousCakeButton.disabled = cakeIndex === 0;
    nextCakeButton.disabled = offset >= maxOffset;
  }

  previousCakeButton.addEventListener('click', () => {
    cakeIndex = Math.max(0, cakeIndex - 1);
    updateCakeCarousel();
  });

  nextCakeButton.addEventListener('click', () => {
    cakeIndex = Math.min(cakeCards.length - 1, cakeIndex + 1);
    updateCakeCarousel();
  });

  window.addEventListener('resize', updateCakeCarousel);
  updateCakeCarousel();
}

document.querySelector('.contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const name = formData.get('name') || 'Not provided';
  const email = formData.get('email') || 'Not provided';
  const phone = formData.get('phone') || 'Not provided';
  const message = formData.get('message') || 'Not provided';
  const subject = `New inquiry from ${name}`;
  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    '',
    'Message:',
    message,
  ].join('\n');

  window.location.href = `mailto:sathishben100@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
