// prAIvacy Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            
            // Change hamburger icon to X when menu is open
            const icon = mobileMenuToggle.innerHTML;
            mobileMenuToggle.innerHTML = mobileMenu.classList.contains('active') ? '✕' : '☰';
        });

        // Close mobile menu when clicking on links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                mobileMenuToggle.innerHTML = '☰';
            });
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('nav a[href^="#"]');

    function updateActiveNav() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    // Scroll event listener for active nav
    window.addEventListener('scroll', updateActiveNav);

    // Video handling
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        // Ensure video plays on mobile devices
        heroVideo.addEventListener('canplaythrough', function() {
            this.play().catch(function(error) {
                console.log('Video autoplay failed:', error);
                // Fallback: show a play button or mute the video and try again
                this.muted = true;
                this.play();
            }.bind(this));
        });

        // Pause video when not in viewport for performance
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    heroVideo.play();
                } else {
                    heroVideo.pause();
                }
            });
        }, { threshold: 0.25 });

        videoObserver.observe(heroVideo);
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Animate cards and all observed elements
                if (element.classList.contains('card') || 
                    element.classList.contains('timeline-item') ||
                    element.classList.contains('stat-item') ||
                    element.classList.contains('product-card') ||
                    element.classList.contains('award-card') ||
                    element.classList.contains('support-notice')) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }

                // Animate elements on scroll (removed stat counter since investor section is removed)
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.card, .timeline-item, .product-card, .award-card, .support-notice');
    animatedElements.forEach(el => {
        // Set initial state for animation
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        
        if (hero && heroContent) {
            // Subtle parallax effect
            heroContent.style.transform = `translateY(${scrolled * 0.1}px)`;
            hero.style.opacity = Math.max(0, 1 - scrolled / window.innerHeight);
        }
    });

    // Add loading class removal after page load
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // Custom cursor effect for cards (optional enhancement)
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Typing effect for hero title (optional enhancement)
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        let index = 0;
        
        // Uncomment below for typing effect
        /*
        heroTitle.textContent = '';
        
        function typeText() {
            if (index < originalText.length) {
                heroTitle.textContent += originalText.charAt(index);
                index++;
                setTimeout(typeText, 100);
            }
        }
        
        setTimeout(typeText, 1000);
        */
    }

    // Form handling (if contact forms are added later)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add form submission logic here
            console.log('Form submitted');
        });
    });

    // Product Cards with Learn More buttons
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const learnMoreBtn = card.querySelector('.learn-more-btn');
        
        if (!learnMoreBtn) return;
        
        // Add accessibility attributes
        const productName = card.querySelector('h3').textContent;
        learnMoreBtn.setAttribute('aria-label', `Learn more about ${productName}`);
        
        // Add smooth hover animation for the whole card when hovering learn more button
        learnMoreBtn.addEventListener('mouseenter', function() {
            card.style.transform = 'translateY(-8px)';
        });
        
        learnMoreBtn.addEventListener('mouseleave', function() {
            card.style.transform = 'translateY(-5px)';
        });
    });

    // Global keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close mobile menu
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
                if (mobileMenuToggle) {
                    mobileMenuToggle.innerHTML = '☰';
                }
            }
            
            // Reset any transformed product cards
            const productCards = document.querySelectorAll('.product-card');
            productCards.forEach(card => {
                card.style.transform = '';
            });
        }
    });

    // Console branding
    console.log('%c🔐 prAIvacy', 'color: #6366f1; font-size: 20px; font-weight: bold;');
    console.log('%cSecuring AI\'s Future', 'color: #06b6d4; font-size: 12px;');
});