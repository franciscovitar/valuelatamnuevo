export function initNavigationCards() {
  const cleanups = [];

  const menuButton = document.querySelector('.menu-btn');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelector('.nav-links');
  const backdrop = document.querySelector('[data-menu-backdrop]');
  const mobileQuery = window.matchMedia('(max-width: 980px)');

  if (menuButton && nav && navLinks) {
    let menuOpen = false;

    const setNavInertState = () => {
      if (mobileQuery.matches && !menuOpen) {
        navLinks.setAttribute('inert', '');
      } else {
        navLinks.removeAttribute('inert');
      }
    };

    const setMenu = (open) => {
      menuOpen = Boolean(open) && mobileQuery.matches;

      nav.classList.toggle('menu-open', menuOpen);
      document.body.classList.toggle('menu-open', menuOpen);

      menuButton.setAttribute('aria-expanded', menuOpen ? 'true' : 'false');
      menuButton.setAttribute('aria-label', menuOpen ? 'Cerrar menú' : 'Abrir menú');

      setNavInertState();
    };

    const onMenuClick = (event) => {
      event.preventDefault();
      setMenu(!menuOpen);
    };

    const onBackdropClick = () => {
      setMenu(false);
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenu(false);
        menuButton.focus();
      }
    };

    const onLinkClick = () => {
      setMenu(false);
    };

    const onDocumentPointerDown = (event) => {
      if (!menuOpen) return;
      if (nav.contains(event.target)) return;

      setMenu(false);
    };

    const onMediaChange = () => {
      if (!mobileQuery.matches) {
        setMenu(false);
        navLinks.removeAttribute('inert');
        return;
      }

      setNavInertState();
    };

    menuButton.addEventListener('click', onMenuClick);
    backdrop?.addEventListener('click', onBackdropClick);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onDocumentPointerDown);

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', onLinkClick);
    });

    if (typeof mobileQuery.addEventListener === 'function') {
      mobileQuery.addEventListener('change', onMediaChange);
    } else {
      mobileQuery.addListener(onMediaChange);
    }

    setNavInertState();

    cleanups.push(() => {
      menuButton.removeEventListener('click', onMenuClick);
      backdrop?.removeEventListener('click', onBackdropClick);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onDocumentPointerDown);

      navLinks.querySelectorAll('a').forEach((link) => {
        link.removeEventListener('click', onLinkClick);
      });

      if (typeof mobileQuery.removeEventListener === 'function') {
        mobileQuery.removeEventListener('change', onMediaChange);
      } else {
        mobileQuery.removeListener(onMediaChange);
      }

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

  if (
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    window.matchMedia('(hover:hover) and (pointer:fine)').matches
  ) {
    document.querySelectorAll('.tilt').forEach((element) => {
      const onMove = (event) => {
        const rect = element.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        const lift = element.classList.contains('sol-card') ? -6 : 0;

        element.style.transition = 'transform .06s linear';
        element.style.transform =
          'perspective(900px) rotateX(' +
          (-py * 7).toFixed(2) +
          'deg) rotateY(' +
          (px * 8).toFixed(2) +
          'deg) translateY(' +
          lift +
          'px)';
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

    if (image.complete && image.naturalWidth === 0) {
      applyFallback();
    }

    image.addEventListener('error', applyFallback);
    cleanups.push(() => image.removeEventListener('error', applyFallback));
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}