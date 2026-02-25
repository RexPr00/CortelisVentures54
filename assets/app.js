(() => {
  const focusables = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';
  const body = document.body;
  let trapEl = null;

  const setTrap = (container) => { trapEl = container; };
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeModal();
      document.querySelectorAll('.lang-wrap.open').forEach(w => w.classList.remove('open'));
    }
    if (e.key === 'Tab' && trapEl) {
      const items = [...trapEl.querySelectorAll(focusables)].filter(el => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  document.querySelectorAll('.lang-toggle').forEach(btn => {
    btn.addEventListener('click', () => btn.parentElement.classList.toggle('open'));
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.lang-wrap')) document.querySelectorAll('.lang-wrap.open').forEach(w => w.classList.remove('open'));
  });

  const overlay = document.getElementById('overlay');
  const drawer = document.getElementById('drawer');
  const burger = document.getElementById('burger');
  const drawerClose = document.getElementById('drawerClose');
  const openDrawer = () => {
    overlay.classList.add('open');
    drawer.classList.add('open');
    body.classList.add('no-scroll');
    setTrap(drawer);
  };
  const closeDrawer = () => {
    overlay?.classList.remove('open');
    drawer?.classList.remove('open');
    body.classList.remove('no-scroll');
    if (trapEl === drawer) trapEl = null;
  };
  burger?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);

  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      document.querySelectorAll('.faq-item.open').forEach(open => { if (open !== item) open.classList.remove('open'); });
      item.classList.toggle('open');
    });
  });

  const modalWrap = document.getElementById('privacyModal');
  const openModal = () => {
    modalWrap.classList.add('open');
    body.classList.add('no-scroll');
    setTrap(modalWrap.querySelector('.modal'));
  };
  const closeModal = () => {
    modalWrap?.classList.remove('open');
    body.classList.remove('no-scroll');
    if (trapEl && modalWrap && modalWrap.contains(trapEl)) trapEl = null;
  };
  document.querySelectorAll('[data-open-privacy]').forEach(el => el.addEventListener('click', (e) => { e.preventDefault(); openModal(); }));
  document.querySelectorAll('[data-close-privacy]').forEach(el => el.addEventListener('click', closeModal));
  modalWrap?.addEventListener('click', (e) => { if (e.target === modalWrap) closeModal(); });

  const amountButtons = [...document.querySelectorAll('[data-amount]')];
  const monthRange = document.getElementById('monthsRange');
  const monthValue = document.getElementById('monthsValue');
  const lowOut = document.getElementById('lowValue');
  const baseOut = document.getElementById('baseValue');
  const highOut = document.getElementById('highValue');
  const locale = body.dataset.locale || 'en-GB';
  const currency = body.dataset.currency || 'USD';
  let amount = 10000;
  const formatMoney = (val) => new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(val);
  const compute = () => {
    const m = Number(monthRange?.value || 12);
    monthValue.textContent = monthValue.dataset.label.replace('{m}', m);
    lowOut.textContent = formatMoney(amount * Math.pow(1.08, m));
    baseOut.textContent = formatMoney(amount * Math.pow(1.115, m));
    highOut.textContent = formatMoney(amount * Math.pow(1.15, m));
  };
  amountButtons.forEach(btn => btn.addEventListener('click', () => {
    amountButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    amount = Number(btn.dataset.amount);
    compute();
  }));
  monthRange?.addEventListener('input', compute);
  compute();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: .16 });
  document.querySelectorAll('section .panel, section .card, .calculator').forEach(el => {
    el.style.opacity = '.001';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity .45s ease, transform .45s ease';
    observer.observe(el);
  });
})();
