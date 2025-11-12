// Navbar Loader - Load navbar component and set active page
document.addEventListener('DOMContentLoaded', async function () {
    // Load navbar HTML
    const navbarPlaceholder = document.getElementById('navbar-placeholder');

    if (navbarPlaceholder) {
        try {
            const response = await fetch('../src/assets/components/navbar.html');
            const navbarHTML = await response.text();
            navbarPlaceholder.innerHTML = navbarHTML;

            // Set active page after navbar is loaded
            setActivePage();

            // Initialize mobile menu after navbar is loaded
            initializeMobileMenu();
        } catch (error) {
            console.error('Error loading navbar:', error);
        }
    }
});

// Set active navigation item based on current page
function setActivePage() {
    const currentPath = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    const currentHash = window.location.hash.replace('#', '');
    const navLinks = document.querySelectorAll('nav a[data-page]');

    navLinks.forEach(link => {
        const page = link.getAttribute('data-page');
        const linkHref = link.getAttribute('href');
        const linkHash = linkHref.includes('#') ? linkHref.split('#')[1] : '';

        // Remove active class first
        link.classList.remove('active');

        // Check if we're on index page
        if (currentPath === 'index' || currentPath === '') {
            // If there's a hash in the URL
            if (currentHash) {
                // Match links with the same hash
                if (linkHash === currentHash) {
                    link.classList.add('active');
                }
            } else {
                // No hash - activate only the main/home link
                if (page === 'main') {
                    link.classList.add('active');
                }
            }
        } else {
            // For other pages, match by page name
            if (page === currentPath) {
                link.classList.add('active');
            }
        }
    });
}

window.addEventListener('hashchange', setActivePage);

// Initialize mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function () {
            mobileMenu.classList.toggle('active');
            // Change hamburger icon to X when menu is open
            mobileMenuToggle.innerHTML = mobileMenu.classList.contains('active') ? '✕' : '☰';
        });

        // Close mobile menu when clicking on links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function () {
                mobileMenu.classList.remove('active');
                mobileMenuToggle.innerHTML = '☰';
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function (event) {
            if (!mobileMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                if (mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    mobileMenuToggle.innerHTML = '☰';
                }
            }
        });
    }
}
