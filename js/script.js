// Clint's Cafe - Interactive Elements
document.addEventListener('DOMContentLoaded', () => {

    // Welcome Screen Handler
    const welcomeScreen = document.getElementById('welcomeScreen');
    const body = document.body;

    if (welcomeScreen) {
        // Prevent body scroll while welcome screen is visible
        body.classList.add('welcome-active');

        // Auto-hide welcome screen after 3.5 seconds
        setTimeout(() => {
            welcomeScreen.classList.add('hidden');
            
            // Re-enable body scroll after fade-out animation completes
            setTimeout(() => {
                body.classList.remove('welcome-active');
                // Remove element from DOM after animation
                welcomeScreen.style.display = 'none';
            }, 800); // Match CSS transition duration
        }, 3500); // 3.5 seconds as specified
    }

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileToggle.innerHTML = navLinks.classList.contains('active') ? '&times;' : '&#9776;';
        });
    }

    // Scroll Animation
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    // Trigger once on load
    revealOnScroll();

    // Slow down Night Life Video & Custom Loop (Start at 6s)
    const nightLifeVideo = document.getElementById('nightLifeVideo');
    if (nightLifeVideo) {
        nightLifeVideo.playbackRate = 0.6;

        const startVideo = () => {
            if (nightLifeVideo.currentTime < 6) {
                nightLifeVideo.currentTime = 6;
            }
            nightLifeVideo.play().catch(e => console.log("Autoplay prevented:", e));
        };

        if (nightLifeVideo.readyState >= 1) {
            startVideo();
        } else {
            nightLifeVideo.addEventListener('loadedmetadata', startVideo);
        }

        // Loop back to 6s instead of 0
        nightLifeVideo.addEventListener('ended', () => {
            nightLifeVideo.currentTime = 6;
            nightLifeVideo.play();
        });
    }

    // Smooth Scroll-Driven Video Overlay Effect (Mobile)
    const handleSmoothVideoOverlay = () => {
        // Only run on mobile devices
        if (window.innerWidth > 768) return;

        const storySection = document.querySelector('.story-section');
        if (!storySection) return;

        const storyImage = storySection.querySelector('.story-image');
        const storyText = storySection.querySelector('.story-text');

        if (!storyImage || !storyText) return;

        // Create dark overlay for video (like hero section)
        let videoOverlay = storyImage.querySelector('.video-overlay');
        if (!videoOverlay) {
            videoOverlay = document.createElement('div');
            videoOverlay.className = 'video-overlay';
            videoOverlay.style.position = 'absolute';
            videoOverlay.style.top = '0';
            videoOverlay.style.left = '0';
            videoOverlay.style.width = '100%';
            videoOverlay.style.height = '100%';
            videoOverlay.style.background = 'rgba(15, 15, 15, 0.6)';
            videoOverlay.style.opacity = '0';
            videoOverlay.style.transition = 'opacity 0.3s ease';
            videoOverlay.style.pointerEvents = 'none';
            videoOverlay.style.zIndex = '2';
            storyImage.style.position = 'relative';
            storyImage.appendChild(videoOverlay);
        }

        const sectionRect = storySection.getBoundingClientRect();
        const videoRect = storyImage.getBoundingClientRect();
        const headerHeight = 80;

        // Calculate scroll progress
        // Phase 1: Video reaches top of viewport (becomes fixed)
        const phase1Start = sectionRect.top;
        const phase1End = headerHeight;

        // Phase 2: Description slides over video
        const videoHeight = storyImage.offsetHeight;
        const textHeight = storyText.offsetHeight;
        const scrollRange = textHeight; // Exact range - no extra scroll

        // Check if section is in viewport
        if (sectionRect.top <= headerHeight && sectionRect.bottom > headerHeight) {
            // Calculate how much we've scrolled into the section
            const scrollProgress = Math.max(0, headerHeight - sectionRect.top);

            // Phase 1: Make video sticky (0 to videoHeight scroll)
            if (scrollProgress < videoHeight) {
                storyImage.style.position = 'fixed';
                storyImage.style.top = headerHeight + 'px';
                storyImage.style.left = '0';
                storyImage.style.width = '100%';
                storyImage.style.zIndex = '5';
                storyImage.style.transition = 'none';

                // Keep description below video initially
                storyText.style.transform = 'translateY(0)';
                storyText.style.opacity = '0.5';

                // No overlay yet
                videoOverlay.style.opacity = '0';
            }

            // Phase 2: Slide description over video
            else if (scrollProgress >= videoHeight && scrollProgress < videoHeight + scrollRange) {
                const phase2Progress = (scrollProgress - videoHeight) / scrollRange;
                const translateY = -textHeight * phase2Progress;

                storyImage.style.position = 'fixed';
                storyImage.style.top = headerHeight + 'px';
                storyImage.style.left = '0';
                storyImage.style.width = '100%';
                storyImage.style.zIndex = '5';

                // Smoothly slide description up
                storyText.style.transform = `translateY(${translateY}px)`;
                storyText.style.opacity = '1';
                storyText.style.transition = 'opacity 0.3s ease';

                // Gradually darken video as description overlays it
                videoOverlay.style.opacity = phase2Progress.toString();
            }

            // Phase 3: Description fully aligned on video - both scroll together
            else {
                storyImage.style.position = 'relative';
                storyImage.style.top = '';
                storyImage.style.left = '';
                storyImage.style.width = '';
                storyImage.style.zIndex = '';

                // Keep description in its final overlay position
                storyText.style.transform = `translateY(-${textHeight}px)`;
                storyText.style.opacity = '1';

                // Full overlay
                videoOverlay.style.opacity = '1';
            }
        } else {
            // Reset when section is out of viewport
            storyImage.style.position = '';
            storyImage.style.top = '';
            storyImage.style.left = '';
            storyImage.style.width = '';
            storyImage.style.zIndex = '';

            storyText.style.transform = '';
            storyText.style.opacity = '';

            // Remove overlay
            videoOverlay.style.opacity = '0';
        }
    };

    // Use requestAnimationFrame for smooth scroll handling
    let ticking = false;
    const smoothScrollHandler = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleSmoothVideoOverlay();
                ticking = false;
            });
            ticking = true;
        }
    };

    // Add scroll listener
    window.addEventListener('scroll', smoothScrollHandler, { passive: true });

    // Also run on resize
    window.addEventListener('resize', handleSmoothVideoOverlay);

    // Run once on load
    handleSmoothVideoOverlay();

    // Premium Multi-Slide Carousel with Enhanced Animations
    const initCarousel = () => {
        const carouselItems = document.querySelectorAll('.carousel-item');
        const dots = document.querySelectorAll('.carousel-dots .dot');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const counterCurrent = document.querySelector('.carousel-counter .current');

        if (!carouselItems.length) return;

        let currentIndex = 0;
        let autoPlayInterval;
        const autoPlayDuration = 5000; // 5 seconds

        const updateCarousel = (index) => {
            const totalItems = carouselItems.length;

            carouselItems.forEach((item, i) => {
                // Remove all classes
                item.classList.remove('active', 'prev', 'next');

                // Calculate positions
                const prevIndex = (index - 1 + totalItems) % totalItems;
                const nextIndex = (index + 1) % totalItems;

                // Add appropriate classes for 3-slide view
                if (i === index) {
                    item.classList.add('active');
                } else if (i === prevIndex) {
                    item.classList.add('prev');
                } else if (i === nextIndex) {
                    item.classList.add('next');
                }
            });

            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });

            // Update counter
            if (counterCurrent) {
                counterCurrent.textContent = index + 1;
            }
        };

        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % carouselItems.length;
            updateCarousel(currentIndex);
        };

        const prevSlide = () => {
            currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
            updateCarousel(currentIndex);
        };

        const goToSlide = (index) => {
            currentIndex = index;
            updateCarousel(currentIndex);
        };

        // Auto-play
        const startAutoPlay = () => {
            autoPlayInterval = setInterval(nextSlide, autoPlayDuration);
        };

        const stopAutoPlay = () => {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
            }
        };

        // Navigation buttons
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                stopAutoPlay();
                startAutoPlay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                stopAutoPlay();
                startAutoPlay();
            });
        }

        // Dots navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                stopAutoPlay();
                startAutoPlay();
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const carouselSection = document.querySelector('.carousel-section');
            if (!carouselSection) return;

            const rect = carouselSection.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight && rect.bottom > 0;

            if (isInView) {
                if (e.key === 'ArrowLeft') {
                    prevSlide();
                    stopAutoPlay();
                    startAutoPlay();
                } else if (e.key === 'ArrowRight') {
                    nextSlide();
                    stopAutoPlay();
                    startAutoPlay();
                }
            }
        });

        // Touch/Swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                stopAutoPlay();
            }, { passive: true });

            carouselContainer.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
                startAutoPlay();
            }, { passive: true });
        }

        const handleSwipe = () => {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                nextSlide();
            }
            if (touchEndX > touchStartX + swipeThreshold) {
                prevSlide();
            }
        };

        // Pause on hover (desktop only)
        if (carouselContainer && window.innerWidth > 768) {
            carouselContainer.addEventListener('mouseenter', stopAutoPlay);
            carouselContainer.addEventListener('mouseleave', startAutoPlay);
        }

        // Initialize
        updateCarousel(currentIndex);
        startAutoPlay();
    };

    // Lazy Load Videos
    const lazyVideos = document.querySelectorAll('video.lazy-video');

    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                const video = entry.target;

                if (entry.isIntersecting) {
                    // Start playing when in view
                    video.play().catch(e => console.log("Auto-play prevented:", e));
                } else {
                    // Pause when out of view
                    video.pause();
                }
            });
        }, {
            root: null,
            threshold: 0.25 // Play when 25% visible
        });

        lazyVideos.forEach(video => {
            videoObserver.observe(video);
        });
    } else {
        // Fallback for older browsers: just play them
        lazyVideos.forEach(video => {
            video.play();
        });
    }

    // Initialize carousel
    initCarousel();

    // Scroll Progress Indicator
    const scrollProgress = document.querySelector('.scroll-progress');
    if (scrollProgress) {
        const updateScrollProgress = () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            scrollProgress.style.width = scrolled + '%';
        };

        window.addEventListener('scroll', updateScrollProgress, { passive: true });
        updateScrollProgress();
    }

    // Service Worker Registration
    if ('serviceWorker' in navigator) {
        // Register immediately, don't wait for load
        navigator.serviceWorker.register('/sw.js', { scope: '/' })
            .then((registration) => {
                console.log('[Service Worker] Registered successfully:', registration.scope);
                
                // Check if service worker is already controlling the page
                if (registration.active) {
                    console.log('[Service Worker] Active and controlling page');
                }
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                console.log('[Service Worker] New version available');
                            }
                        });
                    }
                });
            })
            .catch((error) => {
                console.error('[Service Worker] Registration failed:', error);
            });
    }

    // PWA Install Prompt
    let deferredPrompt;
    const installButton = document.getElementById('installButton');
    const installButtonNav = document.getElementById('installButtonNav');
    const installBanner = document.getElementById('installBanner');

    // Function to show install banner
    const showInstallBanner = () => {
        if (installBanner && !localStorage.getItem('installBannerDismissed')) {
            installBanner.style.display = 'flex';
        }
        if (installButton) {
            installButton.style.display = 'block';
        }
        if (installButtonNav) {
            installButtonNav.style.display = 'inline-block';
        }
    };

    // Check if app is installable
    const checkInstallability = async () => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
            console.log('[PWA] App is already installed');
            if (installBanner) installBanner.style.display = 'none';
            if (installButton) installButton.style.display = 'none';
            return;
        }

        // Check if manifest is accessible
        try {
            const response = await fetch('/manifest.json');
            if (!response.ok) {
                console.error('[PWA] Manifest not accessible');
                return;
            }
        } catch (error) {
            console.error('[PWA] Error checking manifest:', error);
            return;
        }

        // Show banner after a delay if prompt hasn't appeared
        setTimeout(() => {
            if (!deferredPrompt && installBanner) {
                showInstallBanner();
            }
        }, 3000);
    };

    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('[PWA] beforeinstallprompt event fired');
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        
        // Show install button/banner
        showInstallBanner();
    });

    // Function to trigger install
    const triggerInstall = async () => {
        if (!deferredPrompt) {
            console.log('[PWA] Install prompt not available. Showing manual instructions...');
            // Show manual install instructions
            alert('To install this app:\n\nChrome/Edge: Click the install icon in the address bar, or go to Menu (⋮) → Install app\n\nFirefox: Menu (☰) → Install\n\nSafari (iOS): Share button → Add to Home Screen');
            return;
        }

        try {
            // Show the install prompt
            deferredPrompt.prompt();

            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice;
            console.log('[PWA] User response to install prompt:', outcome);

            // Clear the deferredPrompt
            deferredPrompt = null;

            // Hide install button/banner
            if (installButton) {
                installButton.style.display = 'none';
            }
            if (installButtonNav) {
                installButtonNav.style.display = 'none';
            }
            if (installBanner) {
                installBanner.style.display = 'none';
            }
        } catch (error) {
            console.error('[PWA] Error showing install prompt:', error);
        }
    };

    // Handle install button clicks
    if (installButton) {
        installButton.addEventListener('click', triggerInstall);
    }
    if (installButtonNav) {
        installButtonNav.addEventListener('click', triggerInstall);
    }

    // Handle install banner close button
    const installBannerClose = document.getElementById('installBannerClose');
    if (installBannerClose && installBanner) {
        installBannerClose.addEventListener('click', () => {
            installBanner.style.display = 'none';
            // Store preference to not show again (optional)
            localStorage.setItem('installBannerDismissed', 'true');
        });
    }

    // Check if banner was previously dismissed
    if (installBanner && localStorage.getItem('installBannerDismissed') === 'true') {
        installBanner.style.display = 'none';
    }

    // Handle app installed event
    window.addEventListener('appinstalled', () => {
        console.log('[PWA] App installed successfully');
        deferredPrompt = null;
        
        // Hide install button/banner
        if (installButton) {
            installButton.style.display = 'none';
        }
        if (installButtonNav) {
            installButtonNav.style.display = 'none';
        }
        if (installBanner) {
            installBanner.style.display = 'none';
        }

        // Optionally show success message
        // showNotification('WhitesSand installed successfully!');
    });

    // Check installability on load
    checkInstallability();

    // Also check periodically (in case service worker takes time to register)
    setTimeout(checkInstallability, 2000);
    setTimeout(checkInstallability, 5000);
});
