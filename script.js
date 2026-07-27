const emailConfig = {
  publicKey: 'YOUR_EMAILJS_PUBLIC_KEY',
  serviceId: 'YOUR_EMAILJS_SERVICE_ID',
  templateId: 'YOUR_EMAILJS_TEMPLATE_ID',
  receiverEmail: 'abhi26kumar@gmail.com'
};

window.addEventListener('load', () => {
  document.querySelector('.preloader')?.classList.add('hidden');
  document.body.classList.add('loaded');
});

const header = document.querySelector('.site-header');
const backToTop = document.querySelector('.back-to-top');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = [...document.querySelectorAll('.nav-links a')];
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
const heroBg = document.querySelector('.hero-bg');
const enquiryButtons = document.querySelectorAll('[data-open-booking]');
const bookingModal = document.querySelector('#bookingModal');
const modalClose = document.querySelectorAll('[data-close-modal]');
const projectSearch = document.querySelector('#projectSearch');
const filterPills = [...document.querySelectorAll('.filter-pill')];
const projectCards = [...document.querySelectorAll('.project-card')];
const accordionItems = [...document.querySelectorAll('.faq-item')];
const testimonialTrack = document.querySelector('.testimonial-track');
const sliderDots = [...document.querySelectorAll('.slider-dot')];
const availabilityBars = [...document.querySelectorAll('.progress span')];
const animatedCounters = [...document.querySelectorAll('[data-counter]')];
const revealNodes = [...document.querySelectorAll('[data-animate]')];
let activeFilter = 'all';
let activeSlide = 0;



function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, {offset: -90});
    navLinks?.classList.remove('open');
  });
});

navToggle?.addEventListener('click', () => navLinks.classList.toggle('open'));
navAnchors.forEach(link => link.addEventListener('click', () => navLinks.classList.remove('open')));

document.addEventListener('scroll', () => {
  const isScrolled = window.scrollY > 24;
  header?.classList.toggle('scrolled', isScrolled);
  backToTop?.classList.toggle('show', window.scrollY > 450);
});
backToTop?.addEventListener('click', () => lenis.scrollTo(0));

if (window.innerWidth > 1024 && cursor && cursorFollower) {
  document.addEventListener('mousemove', (e) => {
    cursor.style.opacity = '1';
    cursorFollower.style.opacity = '1';
    cursor.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
    cursorFollower.style.transform = `translate(${e.clientX - 21}px, ${e.clientY - 21}px)`;
  });
  document.querySelectorAll('a, button, .filter-pill, .project-card, .gallery-item').forEach(item => {
    item.addEventListener('mouseenter', () => cursorFollower.style.transform += ' scale(1.2)');
    item.addEventListener('mouseleave', () => cursorFollower.style.transform = cursorFollower.style.transform.replace(' scale(1.2)',''));
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('shown');
      observer.unobserve(entry.target);
    }
  });
}, {threshold: 0.15});
revealNodes.forEach(node => observer.observe(node));

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.counter);
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const tick = () => {
      current += step;
      if (current >= target) {
        el.textContent = `${target}${suffix}`;
      } else {
        el.textContent = `${current}${suffix}`;
        requestAnimationFrame(tick);
      }
    };
    tick();
    counterObserver.unobserve(el);
  });
}, {threshold: .35});
animatedCounters.forEach(counter => counterObserver.observe(counter));

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = `${entry.target.dataset.width}%`;
      barObserver.unobserve(entry.target);
    }
  });
}, {threshold: .3});
availabilityBars.forEach(bar => barObserver.observe(bar));

filterPills.forEach(pill => {
  pill.addEventListener('click', () => {
    filterPills.forEach(btn => btn.classList.remove('active'));
    pill.classList.add('active');
    activeFilter = pill.dataset.filter;
    filterProjects();
  });
});
projectSearch?.addEventListener('input', filterProjects);
function filterProjects(){
  const query = (projectSearch?.value || '').toLowerCase().trim();
  projectCards.forEach(card => {
    const text = card.dataset.search.toLowerCase();
    const filterMatch = activeFilter === 'all' || card.dataset.location === activeFilter;
    const searchMatch = !query || text.includes(query);
    card.classList.toggle('hidden-card', !(filterMatch && searchMatch));
  });
}

accordionItems.forEach(item => {
  item.querySelector('.faq-q')?.addEventListener('click', () => {
    const active = item.classList.contains('active');
    accordionItems.forEach(el => el.classList.remove('active'));
    if (!active) item.classList.add('active');
  });
});

function goToSlide(index){
  activeSlide = index;
  testimonialTrack.style.transform = `translateX(-${activeSlide * 100}%)`;
  sliderDots.forEach((dot, i) => dot.classList.toggle('active', i === activeSlide));
}
sliderDots.forEach((dot, index) => dot.addEventListener('click', () => goToSlide(index)));
setInterval(() => goToSlide((activeSlide + 1) % sliderDots.length), 5500);

gsap.registerPlugin(ScrollTrigger);
gsap.to('.hero-bg', {
  scale: 1,
  yPercent: 10,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true
  }
});
gsap.from('.hero-copy > *', {y: 40, opacity: 0, duration: .85, stagger: .12, ease: 'power3.out'});
gsap.from('.search-panel', {x: 50, opacity: 0, duration: .9, delay: .3, ease: 'power3.out'});

AOS.init({
  once: true,
  duration: 900,
  easing: 'ease-out-cubic',
  offset: 50
});
GLightbox({ selector: '.glightbox' });

const modalForm = document.querySelector('#siteVisitForm');
enquiryButtons.forEach(btn => btn.addEventListener('click', () => bookingModal.classList.add('active')));
modalClose.forEach(btn => btn.addEventListener('click', () => bookingModal.classList.remove('active')));
bookingModal?.addEventListener('click', (e) => { if (e.target === bookingModal) bookingModal.classList.remove('active'); });
modalForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = modalForm.querySelector('[name="visit_name"]').value.trim();
  const phone = modalForm.querySelector('[name="visit_phone"]').value.trim();
  const project = modalForm.querySelector('[name="visit_project"]').value;
  if (!name || phone.length < 10 || !project) return alert('Please complete the booking details correctly.');
  alert(`Site visit request received for ${project}. Our team will contact you shortly.`);
  modalForm.reset();
  bookingModal.classList.remove('active');
});

const contactForm = document.querySelector('#contactForm');
const formButton = contactForm?.querySelector('.form-submit');
const formFeedback = document.querySelector('.form-feedback');
if (typeof emailjs !== 'undefined' && emailConfig.publicKey && !emailConfig.publicKey.includes('YOUR_')) {
  emailjs.init(emailConfig.publicKey);
}

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get('name')?.toString().trim();
  const phone = formData.get('phone')?.toString().trim();
  const email = formData.get('email')?.toString().trim();
  const project = formData.get('project')?.toString().trim();
  const message = formData.get('message')?.toString().trim();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
  if (!name || !phone || phone.length < 10 || !validEmail || !project || !message) {
    formFeedback.textContent = 'Please fill all fields with valid details.';
    return;
  }

  formButton?.classList.add('loading');
  formFeedback.textContent = '';
  try {
    if (typeof emailjs === 'undefined' || emailConfig.publicKey.includes('YOUR_') || emailConfig.serviceId.includes('YOUR_') || emailConfig.templateId.includes('YOUR_')) {
      throw new Error('EmailJS is not configured yet.');
    }
    await emailjs.send(emailConfig.serviceId, emailConfig.templateId, {
      to_email: emailConfig.receiverEmail,
      from_name: name,
      from_phone: phone,
      from_email: email,
      project_interested: project,
      message,
      company_name: 'The Heaven City',
      enquiry_source: 'Website Contact Form'
    });
    formFeedback.textContent = 'Thank you! Our team will contact you shortly.';
    contactForm.reset();
  } catch (error) {
    formFeedback.textContent = 'Email service needs activation. Add your EmailJS keys in script.js to enable live submissions on GitHub Pages.';
  } finally {
    formButton?.classList.remove('loading');
  }
});

const sections = [...document.querySelectorAll('section[id]')];
const setActiveLink = () => {
  let current = 'home';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) current = section.id;
  });
  navAnchors.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
};
document.addEventListener('scroll', setActiveLink);
setActiveLink();
