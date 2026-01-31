/**
 * Premium Gallery Animation
 * Floating motion with crossfade transitions
 */

(function() {
    'use strict';

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Alternative images for crossfade (using existing images in rotation)
    const galleryImages = [
        'images/gallery-1.png',
        'images/gallery-2.png',
        'images/gallery-3.png',
        'images/gallery-4.png',
        'images/gallery-5.png',
        'images/gallery-6.png',
        'images/gallery-7.png',
        'images/gallery-8.png',
        'images/gallery-9.png'
    ];

    /**
     * Floating animation controller
     */
    class FloatingGallery {
        constructor() {
            this.items = [];
            this.rafId = null;
            this.startTime = performance.now();
            this.isHovered = null;
            
            this.init();
        }

        init() {
            const galleryItems = document.querySelectorAll('.gallery-item');
            if (!galleryItems.length) return;

            // Initialize each item with unique animation parameters
            galleryItems.forEach((item, index) => {
                const itemData = {
                    element: item,
                    index: index,
                    // Unique phase offsets for organic movement
                    phaseX: Math.random() * Math.PI * 2,
                    phaseY: Math.random() * Math.PI * 2,
                    // Different speeds per item (8-16 seconds per cycle)
                    speedX: 0.0003 + Math.random() * 0.0002,
                    speedY: 0.00025 + Math.random() * 0.00015,
                    // Movement range (10-20px)
                    rangeX: 10 + Math.random() * 10,
                    rangeY: 8 + Math.random() * 12,
                    // Current position
                    currentX: 0,
                    currentY: 0,
                    // Hover state
                    isHovered: false,
                    // Scale
                    scale: 0.98,
                    targetScale: 1
                };

                this.items.push(itemData);

                // Add hover listeners
                item.addEventListener('mouseenter', () => this.onHover(itemData, true));
                item.addEventListener('mouseleave', () => this.onHover(itemData, false));
            });

            // Start entrance animation
            this.triggerEntrance();

            // Start floating animation (if motion is allowed)
            if (!prefersReducedMotion) {
                this.startFloating();
                this.startCrossfade();
            }
        }

        triggerEntrance() {
            // Use IntersectionObserver for scroll-triggered entrance
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            this.items.forEach(item => {
                observer.observe(item.element);
            });
        }

        onHover(itemData, isHovered) {
            itemData.isHovered = isHovered;
            itemData.targetScale = isHovered ? 1.03 : 1;
            
            if (isHovered) {
                itemData.element.classList.add('hovered');
            } else {
                itemData.element.classList.remove('hovered');
            }
        }

        startFloating() {
            const animate = (currentTime) => {
                const elapsed = currentTime - this.startTime;

                this.items.forEach(item => {
                    // Calculate smooth sine wave movement
                    const speedMultiplier = item.isHovered ? 0.3 : 1;
                    
                    const x = Math.sin(elapsed * item.speedX * speedMultiplier + item.phaseX) * item.rangeX;
                    const y = Math.sin(elapsed * item.speedY * speedMultiplier + item.phaseY) * item.rangeY;

                    // Smooth interpolation towards target
                    item.currentX += (x - item.currentX) * 0.02;
                    item.currentY += (y - item.currentY) * 0.02;
                    item.scale += (item.targetScale - item.scale) * 0.08;

                    // Apply transform (GPU accelerated)
                    item.element.style.transform = `translate3d(${item.currentX}px, ${item.currentY}px, 0) scale(${item.scale})`;
                });

                this.rafId = requestAnimationFrame(animate);
            };

            this.rafId = requestAnimationFrame(animate);
        }

        startCrossfade() {
            // Crossfade random images every 6-10 seconds
            const crossfadeItem = () => {
                const randomIndex = Math.floor(Math.random() * this.items.length);
                const item = this.items[randomIndex];
                const currentImg = item.element.querySelector('img:not(.gallery-img-next)');
                
                if (!currentImg) return;

                // Get a different random image
                let newImageSrc;
                do {
                    newImageSrc = galleryImages[Math.floor(Math.random() * galleryImages.length)];
                } while (newImageSrc === currentImg.src);

                // Create next image element
                let nextImg = item.element.querySelector('.gallery-img-next');
                if (!nextImg) {
                    nextImg = document.createElement('img');
                    nextImg.className = 'gallery-img-next';
                    nextImg.alt = currentImg.alt;
                    item.element.appendChild(nextImg);
                }

                // Load new image
                nextImg.src = newImageSrc;
                
                // Trigger crossfade after image loads
                nextImg.onload = () => {
                    currentImg.classList.add('gallery-img-current', 'fading');
                    nextImg.classList.add('active');

                    // After transition, swap images
                    setTimeout(() => {
                        currentImg.src = newImageSrc;
                        currentImg.classList.remove('fading');
                        nextImg.classList.remove('active');
                    }, 1200);
                };
            };

            // Schedule crossfades at random intervals (6-10 seconds)
            const scheduleCrossfade = () => {
                const delay = 6000 + Math.random() * 4000;
                setTimeout(() => {
                    crossfadeItem();
                    scheduleCrossfade();
                }, delay);
            };

            // Start after initial entrance animation
            setTimeout(scheduleCrossfade, 3000);
        }

        destroy() {
            if (this.rafId) {
                cancelAnimationFrame(this.rafId);
            }
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new FloatingGallery());
    } else {
        new FloatingGallery();
    }
})();
