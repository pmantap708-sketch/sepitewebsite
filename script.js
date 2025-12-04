console.log("Sprite Website Loaded");

document.addEventListener('DOMContentLoaded', function() {
    console.log('Website Brand Name berhasil dimuat.');

    // Product variant selection
    const variantCards = document.querySelectorAll('.variant-card');
    const variantData = {
        original: {
            title: 'Sprite Original',
            tagline: 'Minuman soda lemon-lime menyegarkan yang cocok diminum kapan pun.',
            features: ['Rasa segar lemon & lime', 'Bebas kafein', 'Melepas dahaga dengan cepat'],
            image: 'sprite-can.svg',
            size: '250ml, 330ml, 500ml, 2L',
            calories: '105 kkal',
            sugar: '28g',
            type: 'Carbonated'
        },
        zero: {
            title: 'Sprite Zero',
            tagline: 'Rasa segar tanpa gula yang terlalu banyak. Nikmati kesegaran Sprite dengan kalori lebih rendah.',
            features: ['Zero gula', 'Rasa tetap segar', 'Lebih ringan'],
            image: 'sprite-zero.svg',
            size: '250ml, 330ml, 500ml, 2L',
            calories: '5 kkal',
            sugar: '0g',
            type: 'Carbonated'
        },
        tropical: {
            title: 'Sprite Tropical',
            tagline: 'Paduan unik Sprite dengan sentuhan tropis yang eksotis dan menyegarkan.',
            features: ['Rasa tropis yang unik', 'Mangga & nanas', 'Kesegaran premium'],
            image: 'sprite-tropical.svg',
            size: '330ml, 500ml, 2L',
            calories: '120 kkal',
            sugar: '30g',
            type: 'Carbonated'
        }
    };

    variantCards.forEach(card => {
        card.addEventListener('click', function() {
            const variant = this.dataset.variant;
            const data = variantData[variant];

            // Update active card
            variantCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');

            // Update product title and description
            document.getElementById('product-title').textContent = data.title;
            document.getElementById('product-tagline').textContent = data.tagline;

            // Update features
            const featuresList = document.getElementById('product-features');
            featuresList.innerHTML = data.features.map(f => `<li>${f}</li>`).join('');

            // Update image
            document.getElementById('product-image').src = data.image;

            // Update specifications
            document.getElementById('spec-size').textContent = data.size;
            document.getElementById('spec-calories').textContent = data.calories;
            document.getElementById('spec-sugar').textContent = data.sugar;
            document.getElementById('spec-type').textContent = data.type;

            // Smooth scroll to main product section
            document.querySelector('.product-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // CTA hover: preserve original text
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        const original = ctaButton.textContent;
        ctaButton.addEventListener('mouseover', function() {
            this.textContent = 'TONTON SEKARANG!';
        });
        ctaButton.addEventListener('mouseout', function() {
            this.textContent = original;
        });
    }

    // Mobile nav toggle
    const navToggleButtons = document.querySelectorAll('.nav-toggle');
    navToggleButtons.forEach(btn => {
        const menuId = btn.getAttribute('aria-controls');
        const menu = document.getElementById(menuId);
        btn.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', String(!expanded));
            if (menu) menu.classList.toggle('open');
            this.classList.toggle('open');
        });
    });

    // Newsletter removed: no-op (newsletter form removed from pages)

    // Contact form handling (client-side): enhanced validation + feedback
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Helper: normalize phone number
        function normalizePhone(raw) {
            if (!raw) return '';
            let p = raw.replace(/[^0-9+]/g, '');
            if (p.startsWith('0')) p = '+62' + p.slice(1);
            if (!p.startsWith('+')) p = '+62' + p;
            return p;
        }

        // Helper: validate email
        function isValidEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        // Helper: validate phone (min 10 digits after normalization)
        function isValidPhone(phone) {
            const normalized = normalizePhone(phone);
            const digitsOnly = normalized.replace(/\D/g, '');
            return digitsOnly.length >= 10;
        }

        // Helper: show alert
        function showAlert(message, type) {
            const alertEl = document.getElementById('formAlert');
            alertEl.className = `alert ${type === 'success' ? 'alert-success' : 'alert-danger'}`;
            alertEl.textContent = message;
            alertEl.classList.remove('d-none');

            // Also announce to screen readers
            const statusEl = document.getElementById('contactStatus');
            statusEl.textContent = message;
        }

        // Helper: hide alert
        function hideAlert() {
            document.getElementById('formAlert').classList.add('d-none');
        }

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();
            const honeypot = document.getElementById('website').value.trim();

            // Honeypot check (if filled, likely spam)
            if (honeypot) {
                hideAlert();
                this.reset();
                return;
            }

            // Validate required fields
            if (!name || !email || !phone || !message) {
                showAlert('Mohon lengkapi semua field.', 'error');
                return;
            }

            // Validate email format
            if (!isValidEmail(email)) {
                showAlert('Mohon masukkan alamat email yang valid.', 'error');
                return;
            }

            // Validate phone format
            if (!isValidPhone(phone)) {
                showAlert('Mohon masukkan nomor telepon yang valid (minimal 10 digit).', 'error');
                return;
            }

            // All validations passed
            const normalizedPhone = normalizePhone(phone);
            showAlert(`Terima kasih, ${name}! Pesan Anda telah dikirim. Nomor Anda: ${normalizedPhone}`, 'success');

            // Reset form
            this.reset();
            hideAlert();

            // Optional: Hide alert after 5 seconds
            setTimeout(() => hideAlert(), 5000);
        });
    }

    // Scroll reveal (IntersectionObserver)
    (function() {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) return; // skip animations for reduced motion

        const revealElements = document.querySelectorAll('.reveal');
        if (!revealElements.length) return;

        const io = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealElements.forEach(el => io.observe(el));
    })();

    // Product image float & tilt (apply to product images across pages)
    (function() {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const selectors = ['#product-image', '.product-media img', '.product-image-container img', '.product-image', '.product-img'];
        const images = selectors.flatMap(sel => Array.from(document.querySelectorAll(sel)));
        if (!images.length) return;
        images.forEach(img => {
            if (!(img instanceof HTMLElement)) return;
            // Add float animation if not reduced motion
            if (!reduce) img.classList.add('float-animate');
            // Add tilt-on-hover for interactive tilt
            img.classList.add('tilt-on-hover');
            // Ensure images will not break layout
            img.style.maxWidth = img.style.maxWidth || '';
        });
    })();

    // Video play UI and fallback handling
    (function() {
        const video = document.getElementById('ad-video');
        const playBtn = document.getElementById('videoPlayBtn');
        const fallback = document.getElementById('videoFallback');
        const iframeWrapper = document.getElementById('videoIframeWrapper');
        const openLink = document.getElementById('openVideoLink');

        if (!video || !playBtn) return;

        // Try to detect if browser can play provided sources
        function canPlayVideo() {
            try {
                const can = (video.canPlayType && video.canPlayType('video/mp4')) || '';
                return !!can;
            } catch (e) {
                return false;
            }
        }

        // If video errors, show fallback iframe or link
        video.addEventListener('error', function() {
            console.warn('Video element reported an error, showing iframe fallback');
            video.setAttribute('hidden', '');
            if (iframeWrapper) iframeWrapper.classList.remove('d-none');
            if (fallback) fallback.classList.remove('d-none');
        });

        // When play button clicked, attempt to play video; if fails, show iframe fallback
        playBtn.addEventListener('click', function(ev) {
            ev.preventDefault();
            // If cannot play native, show iframe fallback instead
            if (!canPlayVideo()) {
                if (iframeWrapper) iframeWrapper.classList.remove('d-none');
                if (video) video.setAttribute('hidden', '');
                return;
            }

            // Try to play; handle promise
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // playing
                    playBtn.style.display = 'none';
                    if (fallback) fallback.classList.add('d-none');
                }).catch(err => {
                    console.warn('Video play promise rejected:', err);
                    // fallback to iframe
                    if (iframeWrapper) iframeWrapper.classList.remove('d-none');
                    video.setAttribute('hidden', '');
                    if (fallback) fallback.classList.remove('d-none');
                });
            } else {
                // older browsers
                playBtn.style.display = 'none';
            }
        });

        // If user interacts directly with video controls, hide overlay
        video.addEventListener('play', function() {
            if (playBtn) playBtn.style.display = 'none';
            if (fallback) fallback.classList.add('d-none');
        });

        // If iframe exists and user clicks it (or play fails), provide open link
        if (openLink) {
            // keep the link current - it already points to assets/vd.mp4
        }
    })();

});