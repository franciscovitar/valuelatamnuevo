export function initNavigationCards() {
  const cleanups = [];

  const menuButton = document.querySelector('.menu-btn');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelector('.nav-links');
  if (menuButton && nav && navLinks) {
    const setMenu = (open) => {
      nav.classList.toggle('menu-open', open);
      document.body.classList.toggle('menu-open', open);
      menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      navLinks.toggleAttribute('inert', !open && window.matchMedia('(max-width: 980px)').matches);
      navLinks.toggleAttribute('inert', !open && window.matchMedia('(max-width: 980px)').matches);
    };
    const onMenuClick = () => setMenu(!nav.classList.contains('menu-open'));
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenu(false);
    };
    const onLinkClick = () => setMenu(false);
    menuButton.addEventListener('click', onMenuClick);
    document.addEventListener('keydown', onKeyDown);
    navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', onLinkClick));
    cleanups.push(() => {
      menuButton.removeEventListener('click', onMenuClick);
      document.removeEventListener('keydown', onKeyDown);
      navLinks.querySelectorAll('a').forEach((link) => link.removeEventListener('click', onLinkClick));
      setMenu(false);
    });
  }

  document.querySelectorAll('.sol-card[data-expand] .sol-head').forEach((head) => {
    const onClick = () => {
      const card = head.closest('.sol-card');
      if (!card) return;
      const open = card.classList.toggle('open');
      head.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    head.addEventListener('click', onClick);
    cleanups.push(() => head.removeEventListener('click', onClick));
  });

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    document.querySelectorAll('.tilt').forEach((element) => {
      const onMove = (event) => {
        const rect = element.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        const lift = element.classList.contains('sol-card') ? -6 : 0;
        element.style.transition = 'transform .06s linear';
        element.style.transform = 'perspective(900px) rotateX(' + (-py * 7).toFixed(2) + 'deg) rotateY(' + (px * 8).toFixed(2) + 'deg) translateY(' + lift + 'px)';
      };
      const onLeave = () => {
        element.style.transition = 'transform .5s cubic-bezier(.2,.7,.2,1)';
        element.style.transform = '';
      };
      element.addEventListener('pointermove', onMove);
      element.addEventListener('pointerleave', onLeave);
      cleanups.push(() => {
        element.removeEventListener('pointermove', onMove);
        element.removeEventListener('pointerleave', onLeave);
      });
    });
  }

  document.querySelectorAll('.trust .logos img, .reg .seal img, .rel-logo img').forEach((image) => {
    const applyFallback = () => {
      const parent = image.parentNode;
      if (!parent || parent.querySelector('.logo-fallback')) return;
      const name = image.getAttribute('alt') || '';
      parent.innerHTML = '<span class="logo-fallback">' + name + '</span>';
    };
    if (image.complete && image.naturalWidth === 0) applyFallback();
    image.addEventListener('error', applyFallback);
    cleanups.push(() => image.removeEventListener('error', applyFallback));
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}
