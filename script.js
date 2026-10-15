document.documentElement.classList.add('js');

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx4K0FAXhd1uI_dxKU17JiYa8MHVj3B7YgsR_mwWRMIYykekw7XpbYgeCeOgeqJRs4H/exec';

// Navbar: solid on scroll + mobile menu
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
const onScroll = () => nav.classList.toggle('solid', window.scrollY > 20);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
}));

// Active link while scrolling
const links = [...menu.querySelectorAll('a')];
const sections = links.map(a => document.querySelector(a.getAttribute('href')));
const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
        }
    });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => s && spy.observe(s));

// Reveal cards once
const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Contact form -> Google Apps Script
const form = document.getElementById('form');
const status = document.getElementById('status');
const send = document.getElementById('send');

form.addEventListener('submit', async e => {
    e.preventDefault();
    status.className = '';
    const data = new FormData(form);
    const name = data.get('name').trim(), email = data.get('email').trim(), message = data.get('message').trim();

    if (!name || !message || !/^\S+@\S+\.\S+$/.test(email)) {
        status.textContent = 'Please fill in your name, a valid email, and a message.';
        status.className = 'err';
        return;
    }

    send.disabled = true;
    send.textContent = 'Sending...';
    try {
        // no-cors: Apps Script does not return CORS headers, so the reply cannot be read.
        // If the request leaves the browser without a network error, we treat it as sent.
        await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify({ name, email, message }) });
        status.textContent = 'Message sent successfully. Thank you!';
        status.className = 'ok';
        form.reset();
    } catch (err) {
        status.textContent = 'Could not send the message. Please try again or email me directly.';
        status.className = 'err';
    } finally {
        send.disabled = false;
        send.textContent = 'Send Message';
    }
});