/* ==========================================================================
   DEVAI PASS - INTERACTIVE JAVASCRIPT & GSAP ANIMATION CONTROLLER
   ========================================================================== */

// ==========================================
// 1. CASHFREE PAYMENT LINKS CONFIGURATION
// Customize your Cashfree payment gateway links here
// ==========================================
const CASHFREE_PAYMENT_URLS = {
    plan1: "https://payments.cashfree.com/forms/stai",      // 2499rs Starter Plan
    plan2: "https://payments.cashfree.com/forms?code=prcr", // 3999rs Pro Plan
    plan3: "https://payments.cashfree.com/forms/uldevs"    // 4999rs Ultimate Plan
};

document.addEventListener('DOMContentLoaded', () => {

    // Initialize Cashfree links on buttons
    initCashfreeLinks();

    // Initialize GSAP Animations
    initGSAPAnimations();

    // Initialize Savings Calculator
    initCalculator();

    // Initialize Countdown Timer
    initCountdownTimer();

    // Initialize Live Social Proof Popups
    initSocialProofToasts();

    // Initialize FAQ Accordion
    initAccordion();

    // Initialize Auth Modal
    initAuthModal();

    // Initialize Mobile Menu
    initMobileMenu();

    // Initialize Sticky Bottom Bar Scroll Trigger
    initStickyBar();

    // Initialize Contact Form AJAX submission
    initContactForm();
});

/* --- Auth Modal & Cashfree Checkout Controller --- */
let activePlanKey = 'plan2';

const PLAN_NAMES = {
    plan1: "Starter AI Pack — ₹2,499/mo",
    plan2: "Pro Creator Pack — ₹3,999/mo",
    plan3: "Ultimate Dev Suite — ₹4,999/mo"
};

function initAuthModal() {
    const modal = document.getElementById('auth-modal');
    const modalClose = document.getElementById('modal-close');
    const modalPlanTitle = document.getElementById('modal-plan-title');

    const tabLoginBtn = document.getElementById('tab-login-btn');
    const tabRegisterBtn = document.getElementById('tab-register-btn');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    const loginErrorBanner = document.getElementById('login-error-banner');
    const switchToRegLink = document.getElementById('switch-to-reg-link');
    const switchToLogLink = document.getElementById('switch-to-log-link');

    if (!modal) return;

    function openModal(planKey) {
        activePlanKey = planKey || 'plan2';
        if (modalPlanTitle && PLAN_NAMES[activePlanKey]) {
            modalPlanTitle.textContent = PLAN_NAMES[activePlanKey];
        }
        modal.classList.add('active');
        if (loginErrorBanner) loginErrorBanner.classList.remove('show');
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }

    function closeModal() {
        modal.classList.remove('active');
    }

    // Attach click triggers to all pricing CTA buttons
    const triggerButtons = document.querySelectorAll('.cashfree-link, .btn-pulse');
    triggerButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const planKey = btn.getAttribute('data-plan') || 'plan2';
            e.preventDefault();
            openModal(planKey);
        });
    });

    // Close buttons & overlay
    if (modalClose) modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });

    // Tab Switchers
    function switchToLogin() {
        tabLoginBtn.classList.add('active');
        tabRegisterBtn.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    }

    function switchToRegister() {
        tabRegisterBtn.classList.add('active');
        tabLoginBtn.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    }

    if (tabLoginBtn) tabLoginBtn.addEventListener('click', switchToLogin);
    if (tabRegisterBtn) tabRegisterBtn.addEventListener('click', switchToRegister);
    if (switchToRegLink) switchToRegLink.addEventListener('click', (e) => { e.preventDefault(); switchToRegister(); });
    if (switchToLogLink) switchToLogLink.addEventListener('click', (e) => { e.preventDefault(); switchToLogin(); });

    // Handle Login Form Submission -> Input format validation + Unregistered account error
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const loginInput = document.getElementById('login-email');
            const errorBannerSpan = loginErrorBanner ? loginErrorBanner.querySelector('span') : null;
            const inputVal = loginInput ? loginInput.value.trim() : '';

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
            const phoneRegex = /^\+?[0-9]{10,12}$/;

            if (loginErrorBanner && errorBannerSpan) {
                loginErrorBanner.classList.remove('show');
                void loginErrorBanner.offsetWidth; // Trigger reflow for shake animation

                if (!inputVal.includes('@') && !phoneRegex.test(inputVal)) {
                    // User typed plain text without @ or domain
                    errorBannerSpan.innerHTML = `<strong>Invalid Format:</strong> Please enter a complete email address (e.g. <u>example@gmail.com</u>) or a 10-digit mobile number.`;
                    loginErrorBanner.classList.add('show');
                    if (loginInput) loginInput.focus();
                    return;
                }

                if (inputVal.includes('@') && !emailRegex.test(inputVal)) {
                    // User typed without domain extension
                    const userPrefix = inputVal.split('@')[0] || 'example';
                    errorBannerSpan.innerHTML = `<strong>Invalid Email Format:</strong> Please include full domain extension (e.g. <u>${userPrefix}@gmail.com</u> or <u>example@gmail.com</u>).`;
                    loginErrorBanner.classList.add('show');
                    if (loginInput) loginInput.focus();
                    return;
                }

                // If valid format, show unregistered credentials error
                errorBannerSpan.innerHTML = `<strong>No Account Found:</strong> Credentials for <u>${inputVal}</u> are not registered. Please click <strong>"Create Account"</strong> tab below to get your DevAI Pass via Cashfree.`;
                loginErrorBanner.classList.add('show');
            }
        });
    }

    // Activation Notice Modal Controls
    const activationModal = document.getElementById('activation-modal');
    const activationModalClose = document.getElementById('activation-modal-close');
    const activationPlanPill = document.getElementById('activation-plan-pill');
    const activationUserEmail = document.getElementById('activation-user-email');
    const activationPayBtn = document.getElementById('activation-pay-btn');
    const activationPayBtnText = document.getElementById('activation-pay-btn-text');

    const PLAN_FULL_NAMES = {
        plan1: "Starter AI Pack (₹2,499)",
        plan2: "Pro Creator Pack (₹3,999)",
        plan3: "Ultimate Dev Suite (₹4,999)"
    };

    function openActivationModal(userEmail) {
        closeModal(); // Close initial auth modal
        if (activationUserEmail) activationUserEmail.textContent = userEmail || 'user@example.com';
        if (activationPlanPill && PLAN_NAMES[activePlanKey]) {
            activationPlanPill.textContent = PLAN_NAMES[activePlanKey];
        }
        if (activationPayBtnText && PLAN_FULL_NAMES[activePlanKey]) {
            activationPayBtnText.textContent = `Purchase ${PLAN_FULL_NAMES[activePlanKey]}`;
        }
        if (activationModal) {
            activationModal.classList.add('active');
            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                lucide.createIcons();
            }
        }
    }

    function closeActivationModal() {
        if (activationModal) activationModal.classList.remove('active');
    }

    if (activationModalClose) activationModalClose.addEventListener('click', closeActivationModal);
    if (activationModal) {
        activationModal.addEventListener('click', (e) => {
            if (e.target === activationModal) closeActivationModal();
        });
    }

    // Handle Register Form Submission -> Button Morph Spinner then Open Activation Modal!
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const regEmailInput = document.getElementById('reg-email');
            const regSubmitBtn = document.getElementById('reg-submit-btn');
            const regEmail = regEmailInput ? regEmailInput.value.trim() : 'user@example.com';

            if (regSubmitBtn) {
                regSubmitBtn.classList.add('btn-morph-loading');
            }

            // 1.5s circle loading animation before popup
            setTimeout(() => {
                if (regSubmitBtn) {
                    regSubmitBtn.classList.remove('btn-morph-loading');
                }
                openActivationModal(regEmail);
            }, 1500);
        });
    }

    // Handle Cashfree Payment Button inside Activation Modal -> Redirects to exact plan link!
    if (activationPayBtn) {
        activationPayBtn.addEventListener('click', () => {
            activationPayBtn.disabled = true;
            if (activationPayBtnText) {
                activationPayBtnText.textContent = '⚡ Redirecting to Cashfree Checkout...';
            }

            setTimeout(() => {
                const targetUrl = CASHFREE_PAYMENT_URLS[activePlanKey] || CASHFREE_PAYMENT_URLS.plan2;
                console.log(`Redirecting customer to plan-specific Cashfree link (${activePlanKey}): ${targetUrl}`);
                window.location.href = targetUrl;
            }, 800);
        });
    }
}

/* --- Mobile Navigation Drawer --- */
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-open');
    });

    // Close menu when clicking any link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('mobile-open');
        });
    });
}

/* --- Update Cashfree Redirect Links --- */
function initCashfreeLinks() {
    const cashfreeButtons = document.querySelectorAll('.cashfree-link');
    cashfreeButtons.forEach(button => {
        const planKey = button.getAttribute('data-plan');
        if (planKey && CASHFREE_PAYMENT_URLS[planKey]) {
            button.setAttribute('href', CASHFREE_PAYMENT_URLS[planKey]);
        }

        // Track outbound clicks for analytics
        button.addEventListener('click', (e) => {
            console.log(`Redirecting customer to Cashfree checkout for: ${planKey}`);
        });
    });
}

/* --- GSAP & ScrollTrigger Animations --- */
function initGSAPAnimations() {
    if (typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Hero Stagger Reveal
    gsap.from(".hero-anim", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out"
    });

    // Floating Hero Cards Animation
    gsap.to(".float-1", {
        y: -10,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    gsap.to(".float-2", {
        y: 10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5
    });

    gsap.to(".float-3", {
        y: -8,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1
    });

    // Pricing Cards Scroll Reveal
    gsap.fromTo(".pricing-card",
        { y: 30, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".pricing-grid",
                start: "top 90%",
                toggleActions: "play none none none"
            }
        }
    );

    // Bento Grid Reveal
    gsap.fromTo(".bento-card",
        { y: 30, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".bento-grid",
                start: "top 90%",
                toggleActions: "play none none none"
            }
        }
    );

    // Step Cards Reveal
    gsap.fromTo(".step-card",
        { y: 20, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".steps-grid",
                start: "top 90%",
                toggleActions: "play none none none"
            }
        }
    );

    // Stat Cards Reveal
    gsap.fromTo(".stat-card",
        { y: 20, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".stats-grid",
                start: "top 90%",
                toggleActions: "play none none none"
            }
        }
    );

    // Failsafe & ScrollTrigger Refresh
    setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
        // Guarantee visibility if any element got stuck
        document.querySelectorAll('.pricing-card, .bento-card, .step-card, .stat-card').forEach(el => {
            if (window.getComputedStyle(el).opacity === '0') {
                el.style.opacity = '1';
                el.style.transform = 'none';
            }
        });
    }, 500);

    window.addEventListener('load', () => {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    });
}

/* --- Savings Calculator Logic --- */
function initCalculator() {
    const checkboxes = document.querySelectorAll('.calc-checkbox');
    const originalCostDisplay = document.getElementById('original-cost-display');
    const devaiCostDisplay = document.getElementById('devai-cost-display');
    const savingsAmountDisplay = document.getElementById('savings-amount-display');
    const savingsPercentDisplay = document.getElementById('savings-percent-display');

    function calculateSavings() {
        let totalOriginal = 0;
        let selectedCount = 0;

        checkboxes.forEach(cb => {
            const card = cb.closest('.tool-check-card');
            if (cb.checked) {
                totalOriginal += parseInt(cb.value);
                selectedCount++;
                card.classList.add('checked');
            } else {
                card.classList.remove('checked');
            }
        });

        // Determine best DevAI tier based on tools selected
        let devaiCost = 4999; // Default to ultimate
        if (selectedCount <= 3) {
            devaiCost = 2499;
        } else if (selectedCount <= 5) {
            devaiCost = 3999;
        } else {
            devaiCost = 4999;
        }

        const savings = Math.max(0, totalOriginal - devaiCost);
        const percent = totalOriginal > 0 ? Math.round((savings / totalOriginal) * 100) : 0;

        // Animate counter values
        originalCostDisplay.textContent = `₹${totalOriginal.toLocaleString('en-IN')} / mo`;
        devaiCostDisplay.textContent = `₹${devaiCost.toLocaleString('en-IN')} / mo`;
        savingsAmountDisplay.textContent = `₹${savings.toLocaleString('en-IN')}`;
        savingsPercentDisplay.textContent = `You save ${percent}% every single month!`;
    }

    checkboxes.forEach(cb => {
        cb.addEventListener('change', calculateSavings);
    });

    calculateSavings();
}

/* --- Countdown Timer --- */
function initCountdownTimer() {
    // Set 2 hours, 14 minutes, 45 seconds initial timer
    let totalSeconds = (2 * 3600) + (14 * 60) + 45;

    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateTimer() {
        if (totalSeconds <= 0) {
            totalSeconds = 2 * 3600; // Reset loop for urgency
        }

        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;

        if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(m).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(s).padStart(2, '0');

        totalSeconds--;
    }

    setInterval(updateTimer, 1000);
    updateTimer();
}

/* --- Social Proof Live Toasts (Simulated Facebook Conversion Proof) --- */
function initSocialProofToasts() {
    const toast = document.getElementById('toast-popup');
    const toastName = document.getElementById('toast-name');
    const toastPlan = document.getElementById('toast-plan');

    const buyers = [
        { name: "Rahul M. from Bengaluru", plan: "Pro Creator Pack (₹3,999)", time: "2 mins ago" },
        { name: "Vikram S. from Gurugram", plan: "Ultimate Dev Suite (₹4,999)", time: "Just now" },
        { name: "Priya N. from Hyderabad", plan: "Starter AI Pack (₹2,499)", time: "4 mins ago" },
        { name: "Aditya K. from Mumbai", plan: "Pro Creator Pack (₹3,999)", time: "1 min ago" },
        { name: "Suresh P. from Chennai", plan: "Ultimate Dev Suite (₹4,999)", time: "6 mins ago" }
    ];

    let index = 0;

    function showNextToast() {
        if (!toast || !toastName || !toastPlan) return;

        const buyer = buyers[index];
        toastName.textContent = buyer.name;
        toastPlan.textContent = buyer.plan;

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 4500);

        index = (index + 1) % buyers.length;
    }

    // First toast after 3 seconds, then every 12 seconds
    setTimeout(() => {
        showNextToast();
        setInterval(showNextToast, 12000);
    }, 3000);
}

/* --- FAQ Accordion --- */
function initAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all items
            faqItems.forEach(otherItem => otherItem.classList.remove('active'));

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/* --- Mobile Sticky Conversion Bar --- */
function initStickyBar() {
    const stickyBar = document.getElementById('sticky-bar');
    const heroSection = document.querySelector('.hero-section');

    if (!stickyBar || !heroSection) return;

    window.addEventListener('scroll', () => {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        if (heroBottom < 0) {
            stickyBar.classList.add('visible');
        } else {
            stickyBar.classList.remove('visible');
        }
    });
}

/* --- Web3Forms Contact Form AJAX Handler --- */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('contact-submit-btn');
    const statusMsg = document.getElementById('contact-status-msg');

    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Sending Message...</span> <i data-lucide="loader-2" class="spin-icon"></i>`;
            if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
        }

        if (statusMsg) {
            statusMsg.className = 'form-status-message';
            statusMsg.style.display = 'none';
        }

        const formData = new FormData(contactForm);

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                if (statusMsg) {
                    statusMsg.className = 'form-status-message success';
                    statusMsg.innerHTML = '🎉 Thank you! Your message has been sent successfully. Our support team will reply shortly.';
                    statusMsg.style.display = 'block';
                }
                contactForm.reset();
            } else {
                throw new Error(data.message || 'Something went wrong');
            }
        } catch (error) {
            if (statusMsg) {
                statusMsg.className = 'form-status-message error';
                statusMsg.innerHTML = '⚠️ Could not send message. Please try again or contact support on WhatsApp.';
                statusMsg.style.display = 'block';
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<span>Send Message</span> <i data-lucide="send"></i>`;
                if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
            }
        }
    });
}
