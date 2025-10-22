// prAIvacy Website JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function () {
            mobileMenu.classList.toggle('active');

            // Change hamburger icon to X when menu is open
            const icon = mobileMenuToggle.innerHTML;
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
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
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

    // Animated counter function
    function animateCounter(element, target, suffix = '') {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            if (target >= 1000000) {
                element.textContent = (current / 1000000).toFixed(1) + 'M' + suffix;
            } else if (target >= 1000) {
                element.textContent = (current / 1000).toFixed(1) + 'K' + suffix;
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, 20);
    }

    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;

                // Fade in animations
                if (element.hasAttribute('data-animate')) {
                    element.classList.add('animate');
                }

                // Counter animations
                if (element.hasAttribute('data-animate') && element.getAttribute('data-animate') === 'counter') {
                    const delay = parseInt(element.getAttribute('data-delay')) || 0;

                    setTimeout(() => {
                        element.classList.add('counting');
                        const numberElement = element.querySelector('.stat-number');
                        const target = parseInt(numberElement.getAttribute('data-target'));
                        const suffix = numberElement.getAttribute('data-suffix') || '';

                        animateCounter(numberElement, target, suffix);
                    }, delay);
                }

                observer.unobserve(element);
            }
        });
    }, observerOptions);

    // Observe elements with animation attributes
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(el => observer.observe(el));

    // Tech pillar cards interactive effects
    const techCards = document.querySelectorAll('.tech-pillar-card');
    techCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            const bgEffect = this.querySelector('.pillar-bg-effect');
            if (bgEffect) {
                bgEffect.style.opacity = '1';
            }
        });

        card.addEventListener('mouseleave', function () {
            const bgEffect = this.querySelector('.pillar-bg-effect');
            if (bgEffect) {
                bgEffect.style.opacity = '0';
            }
        });
    });

    // Journey Line Animation - Colab Style
    const journeyLine = document.querySelector('.journey-line');
    const journeyProgress = document.getElementById('journeyProgress');
    const journeyDots = document.querySelectorAll('.journey-dot');
    const sections = document.querySelectorAll('section[data-journey-color]');

    if (journeyLine && journeyProgress && sections.length > 0) {
        let ticking = false;

        function updateJourneyLine() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.min(scrollTop / docHeight, 1);

            // Update progress bar height
            journeyProgress.style.height = `${scrollPercent * 100}%`;

            // Find current section in viewport
            let currentSection = null;
            let maxVisibility = 0;

            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const sectionTop = rect.top;
                const sectionHeight = rect.height;
                const viewportHeight = window.innerHeight;

                // Calculate how much of the section is visible
                let visibility = 0;
                if (sectionTop <= viewportHeight && sectionTop + sectionHeight >= 0) {
                    const visibleTop = Math.max(0, -sectionTop);
                    const visibleBottom = Math.min(sectionHeight, viewportHeight - sectionTop);
                    visibility = (visibleBottom - visibleTop) / Math.min(sectionHeight, viewportHeight);
                }

                if (visibility > maxVisibility) {
                    maxVisibility = visibility;
                    currentSection = section;
                }
            });

            // Update active dot and progress color
            if (currentSection) {
                const color = currentSection.getAttribute('data-journey-color');
                const sectionId = currentSection.getAttribute('id');

                // Remove active class from all dots
                journeyDots.forEach(dot => {
                    dot.classList.remove('active');
                });

                // Add active class to current dot
                const currentDot = document.querySelector(`.journey-dot[data-section="${sectionId}"]`);
                if (currentDot) {
                    currentDot.classList.add('active');
                }

                // Update progress bar color and glow
                const colorMap = {
                    'blue': '#3b82f6',
                    'red': '#ef4444',
                    'green': '#22c55e',
                    'purple': '#a855f7',
                    'orange': '#f97316'
                };

                if (colorMap[color]) {
                    journeyProgress.style.boxShadow = `
                        0 0 20px ${colorMap[color]}80,
                        0 0 40px ${colorMap[color]}60
                    `;
                }
            }

            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateJourneyLine);
                ticking = true;
            }
        }

        // Smooth scroll to section when dot is clicked
        journeyDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const sectionId = dot.getAttribute('data-section');
                const targetSection = document.getElementById(sectionId);

                if (targetSection) {
                    const navHeight = document.querySelector('nav').offsetHeight || 0;
                    const targetPosition = targetSection.offsetTop - navHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Listen for scroll events
        window.addEventListener('scroll', requestTick, { passive: true });
        window.addEventListener('resize', requestTick, { passive: true });

        // Initial update
        updateJourneyLine();
    }

    // Active navigation highlighting
    const allSections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('nav a[href^="#"]');

    function updateActiveNav() {
        const scrollPosition = window.scrollY + 100;

        allSections.forEach(section => {
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
        heroVideo.addEventListener('canplaythrough', function () {
            this.play().catch(function (error) {
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

    // Enhanced Intersection Observer for scroll animations
    const enhancedObserverOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };

    const enhancedObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;

                // Add fade-in-up animation
                element.classList.add('animate-fade-in-up');
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';

                // Stagger animation for grid items
                if (element.parentElement.classList.contains('products-grid') ||
                    element.parentElement.classList.contains('cards-grid') ||
                    element.parentElement.classList.contains('awards-grid')) {
                    const siblings = Array.from(element.parentElement.children);
                    const index = siblings.indexOf(element);
                    element.style.animationDelay = `${index * 0.1}s`;
                }
            }
        });
    }, enhancedObserverOptions);

    // Enhanced element selection for animations
    const enhancedAnimatedElements = document.querySelectorAll(`
        .section:not(.team-page-section),
        .card,
        .timeline-item,
        .award-card,
        .support-notice,
        .impact-item,
        .story-card,
        .question-bubble
    `);

    enhancedAnimatedElements.forEach((el, index) => {
        // Set initial state for animation
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        enhancedObserver.observe(el);
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');

        if (hero && heroContent) {
            // Subtle parallax effect
            // heroContent.style.transform = `translateY(${scrolled * 0.1}px)`;
            // Removed opacity fade-out effect to keep hero content visible
        }
    });

    // Add loading class removal after page load
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // Custom cursor effect for cards (optional enhancement)
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
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
        form.addEventListener('submit', function (e) {
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
        learnMoreBtn.addEventListener('mouseenter', function () {
            card.style.transform = 'translateY(-8px)';
        });

        learnMoreBtn.addEventListener('mouseleave', function () {
            card.style.transform = 'translateY(-5px)';
        });
    });

    // Global keyboard navigation support
    document.addEventListener('keydown', function (e) {
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

    // Animated Timeline on Scroll
    const timeline = document.querySelector('.timeline');
    const timelineProgress = document.querySelector('.timeline-progress');
    const timelineItems = document.querySelectorAll('.timeline-item');

    if (timeline && timelineProgress && timelineItems.length > 0) {
        function updateTimeline() {
            const timelineRect = timeline.getBoundingClientRect();
            const timelineTop = timelineRect.top + window.pageYOffset;
            const timelineHeight = timeline.offsetHeight;
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;

            // Calculate how much of the timeline is visible
            const timelineStart = timelineTop - windowHeight * 0.8;
            const timelineEnd = timelineTop + timelineHeight - windowHeight * 0.2;

            if (scrollTop >= timelineStart && scrollTop <= timelineEnd) {
                // Calculate progress percentage
                const progress = Math.min(Math.max((scrollTop - timelineStart) / (timelineEnd - timelineStart), 0), 1);
                timelineProgress.style.height = `${progress * 100}%`;

                // Update active timeline items
                timelineItems.forEach((item, index) => {
                    const itemRect = item.getBoundingClientRect();
                    const itemTop = itemRect.top + window.pageYOffset;
                    const itemCenter = itemTop + (item.offsetHeight / 2);
                    const viewportCenter = scrollTop + (windowHeight / 2);

                    // Check if item is in the active zone (center of viewport)
                    const activeZone = windowHeight * 0.3; // 30% of viewport height
                    const isActive = Math.abs(itemCenter - viewportCenter) < activeZone;

                    if (isActive) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            } else if (scrollTop < timelineStart) {
                timelineProgress.style.height = '0%';
                timelineItems.forEach(item => item.classList.remove('active'));
            } else {
                timelineProgress.style.height = '100%';
                timelineItems.forEach(item => item.classList.remove('active'));
                // Keep the last item active when fully scrolled
                if (timelineItems.length > 0) {
                    timelineItems[timelineItems.length - 1].classList.add('active');
                }
            }
        }

        // Add scroll listener for timeline
        window.addEventListener('scroll', updateTimeline);

        // Initial call
        updateTimeline();
    }

    // Console branding
    console.log('%c🔐 prAIvacy', 'color: #6366f1; font-size: 20px; font-weight: bold;');
    console.log('%cSecuring AI\'s Future', 'color: #06b6d4; font-size: 12px;');
});