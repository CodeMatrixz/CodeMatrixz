/* ========================================
   MOBILE MENU JAVASCRIPT - mobile-menu.js
======================================== */

document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('header');
    const body = document.body;

    // If there is no header/nav on this page, bail out safely
    if (!mobileMenuBtn || !navLinks) return;

    const MOBILE_BREAKPOINT = 1024;

    function openMobileMenu() {
        mobileMenuBtn.classList.add('active');
        navLinks.classList.add('active');
        body.classList.add('menu-open'); // use CSS for overflow lock
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
    }

    function closeMobileMenu() {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        body.classList.remove('menu-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }

    function isMenuOpen() {
        return navLinks.classList.contains('active');
    }

    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', function (e) {
        e.stopPropagation();

        if (isMenuOpen()) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
        if (!isMenuOpen()) return;

        const clickInsideHeader = header && header.contains(e.target);
        const clickOnToggle = mobileMenuBtn.contains(e.target);

        if (!clickInsideHeader && !clickOnToggle) {
            closeMobileMenu();
        }
    });

    // Close menu when clicking on a non-dropdown link
    navLinks.addEventListener('click', function (e) {
        const link = e.target.closest('a');
        if (!link) return;

        const li = link.closest('li');
        const isDropdownParent = li && li.classList.contains('has-dropdown');

        // On mobile: normal links close the menu
        if (!isDropdownParent && window.innerWidth <= MOBILE_BREAKPOINT && isMenuOpen()) {
            closeMobileMenu();
        }
    });

    // Handle dropdown menus on mobile
    const dropdownParents = navLinks.querySelectorAll('.has-dropdown');

    dropdownParents.forEach(item => {
        const link = item.querySelector(':scope > a');
        if (!link) return;

        link.addEventListener('click', function (e) {
            // Only hijack click on mobile/tablet
            if (window.innerWidth <= MOBILE_BREAKPOINT) {
                e.preventDefault();

                const alreadyActive = item.classList.contains('active');

                // Optional: close other dropdowns first
                dropdownParents.forEach(i => i.classList.remove('active'));

                if (!alreadyActive) {
                    item.classList.add('active');
                }
            }
        });
    });

    // Keyboard accessibility - Close menu on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isMenuOpen()) {
            closeMobileMenu();
            mobileMenuBtn.focus();
        }
    });

    // Handle scroll behavior: close mobile menu on significant scroll
    let lastScrollTop = 0;

    window.addEventListener('scroll', function () {
        if (!isMenuOpen()) {
            lastScrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
            return;
        }

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;

        // Only react on noticeable scroll (50px threshold)
        if (Math.abs(scrollTop - lastScrollTop) > 50) {
            closeMobileMenu();
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // Close menu and reset inline states when resizing to desktop
    window.addEventListener('resize', function () {
        if (window.innerWidth > MOBILE_BREAKPOINT && isMenuOpen()) {
            closeMobileMenu();
        }
    });

    // Expose helper globally if you still need it elsewhere
    window.closeMobileMenu = closeMobileMenu;
});