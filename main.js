let currentUser = null;
let selectedPackageIndex = null;
let isWeightUpdateUnlocked = false;

// ==========================================
// APP CONFIGURATION (روابط الـ API والموقع)
// ==========================================
const APP_CONFIG = {
    api: {
        authScript: "https://script.google.com/macros/s/AKfycbxsNmVtFwlmYYCnwt7ptmlsxF7p13kIHWBAE9PtOU9GBkIS492joly2H9bQNSJ8zYQ/exec",
        weeklyUpdateScript: "https://script.google.com/macros/s/AKfycbzun3rRM7qer4qVuWsD5lmz-m3v8SSDTdXWBMKuICAmOPZn_wm5Lmq1ZiCINkCiK125/exec"
    },
    links: {
        whatsappPhone: "201055723467",
        progressPhotoForm: "https://docs.google.com/forms/d/e/1FAIpQLSckxk6rko9d-isA_BciOrZPxSPUlzbzQH7f6q6vmoDhnzY4_g/viewform?usp=dialog"
    }
};

let packageData = [
    {
        title: 'RAMADAN 30 DAYS FAT LOSS',
        price: '750',
        currency: 'EGP',
        duration: '30 Days',
        discount: 'Limited Ramadan Offer',
        shortFeatures: [
            'Fat Loss Protocol',
            'Personalized Meal Plan',
            'Daily Guidance'
        ],
        fullFeatures: [
            'Customized 30-day fat loss program',
            'Personalized nutrition plan',
            'Daily WhatsApp support',
            'Weekly progress check-in',
            'Form correction videos',
            'Supplement recommendations',
            'Limited Ramadan offer'
        ]
    },
    {
        title: 'VOLTA NO EXCUSES',
        price: '999',
        currency: 'EGP',
        duration: '3 Months',
        discount: '',
        shortFeatures: [
            'Full Training Program',
            'Nutrition Plan',
            'Weekly Check-ins'
        ],
        fullFeatures: [
            'Personalized workout plan (Gym / Home)',
            'Video exercise explanations',
            'Detailed nutrition protocol',
            'Personalized Nutrition plan',
            'Weekly Follow-up with the coach phone',
            'Program updates every 10-15 days ',
            '10% discount on supplements',
            'VOLTA Customer Supporting if needed',
        ]
    },
    {
        title: 'VOLTA GLOW UP 3.0',
        price: '1500',
        currency: 'EGP',
        duration: '3 Months',
        discount: 'MOST SELLER',
        shortFeatures: [
            'Premium Training',
            'Advanced Nutrition',
            'Priority Support',
            'Body Composition'
        ],
        fullFeatures: [
            'personalised workout plan (Gym / Home)',
            'Video exercis explanations ',
            'Personalized Nutrition plan',
            'Follow-up every 2-3 days with the coach',
            'Program updates every 10 days',
            'Food exchanges Guide',
            '️Recipes E-Book',
            'weekly call / Zoom meeting Customer supporting ',
            '15% Discount on supplements ',
            '️Posing Session with Our CMO / Media Team',
        ]
    },
    {
        title: 'VOLTA BEAST MODE',
        price: '4490',
        currency: 'EGP',
        duration: '6 Months',
        discount: 'VIP',
        shortFeatures: [
            'Elite VIP Program',
            'Maximum Results',
            'Premium Support',
            'Complete Transformation'
        ],
        fullFeatures: [
            'personalised workoup plan (Gym/Home)',
            'Video exercises explanation ',
            'Personalised Nutrition plan',
            'Daily Follow-up with the coach',
            'Program updates every 10 days',
            'Food exchanges',
            'Recipes E-Book',
            '1-2 Customer Call / Zoom per week ',
            '️Posing Session with Our Cmo / media Team',
            'Mindset session / month',
            '20% discount on Supplements',
            'Access call to the Owner(C/Ahmed khaled)',
        ]
    }
];

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('open');
}

function closeMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.remove('open');
}

function toggleSocialPanel() {
    const panel = document.getElementById('social-panel');
    const overlay = document.getElementById('social-overlay');
    panel.classList.toggle('open');
    overlay.classList.toggle('open');
}

function navigateTo(page) {
    // لو المستخدم في نفس الصفحة، ارفع الشاشة لفوق فقط
    if (window.location.hash === `#${page}` || (page === 'home' && !window.location.hash)) {
        window.scrollTo(0, 0);
        closeMobileMenu();
        return;
    }
    // تغيير الرابط لحفظه في المتصفح
    window.location.hash = page;
}

// ==========================================
// ANIMATION SYSTEM (Scroll & Reveal)
// ==========================================
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

function initAnimations() {
    // تحديد العناصر اللي هيتعملها أنيميشن (الكروت والعناوين)
    const elements = document.querySelectorAll('.card-dark, .stat-card, section h2, section h3');
    elements.forEach((el) => {
        if (el.classList.contains('card-dark') || el.classList.contains('stat-card')) {
            el.classList.add('volta-animate');
        } else {
            el.classList.add('volta-animate-text');
        }

        scrollObserver.observe(el);
    });
}

function renderPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    let targetPage = document.getElementById(`page-${page}`);
    if (!targetPage) {
        page = 'home';
        targetPage = document.getElementById('page-home');
    }

    // إعادة ضبط الأنيميشن للعناصر عشان تشتغل تاني لما نقلب بين الصفحات
    const animatedElements = targetPage.querySelectorAll('.volta-animate, .volta-animate-text');
    animatedElements.forEach(el => {
        el.classList.remove('is-visible');
    });

    targetPage.classList.add('active');

    // تأثير ظهور ناعم (Fade In) للصفحة نفسها وقت التنقل
    targetPage.style.opacity = '0';
    targetPage.style.transition = 'opacity 0.4s ease-in-out';
    setTimeout(() => targetPage.style.opacity = '1', 50);

    window.scrollTo(0, 0);
    closeMobileMenu();
}

// التقاط حدث تغيير الرابط
window.addEventListener('hashchange', () => {
    const page = window.location.hash.replace('#', '') || 'home';
    renderPage(page);
});

function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === 'password' ? 'text' : 'password';
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');

    toastMessage.textContent = message;

    if (type === 'error') {
        toastIcon.className = 'w-5 h-5 text-red-500';
        toastIcon.innerHTML = '<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>';
    } else {
        toastIcon.className = 'w-5 h-5 text-green-500';
        toastIcon.innerHTML = '<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>';
    }

    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// ==========================================
// SERVER WARM-UP (To reduce cold-start loading times)
// ==========================================
function warmUpServers() {
    // تسخين سيرفرات جوجل في الخلفية عشان تصحى ويكون الرد سريع وقت اللوجين أو تحديث الوزن
    fetch(APP_CONFIG.api.authScript, { method: 'GET', mode: 'no-cors' }).catch(() => { });
    fetch(APP_CONFIG.api.weeklyUpdateScript, { method: 'GET', mode: 'no-cors' }).catch(() => { });
}

// ==========================================
// LOAD DYNAMIC WEBSITE CONTENT
// ==========================================
async function loadDynamicContent() {
    try {
        const formData = new FormData();
        formData.append("action", "getContent");
        const response = await fetch(APP_CONFIG.api.authScript, { method: "POST", body: formData });
        const result = await response.json();

        if (result.success && result.content) {
            const c = result.content;

            if (c.about_image) {
                const aboutImg = document.getElementById('about-image');
                if (aboutImg) aboutImg.src = c.about_image;
            }

            const setText = (id, key) => { if (c[key] && document.getElementById(id)) document.getElementById(id).textContent = c[key]; };

            setText('dyn-stat-1-num', 'stat_1_num'); setText('dyn-stat-1-text', 'stat_1_text');
            setText('dyn-stat-2-num', 'stat_2_num'); setText('dyn-stat-2-text', 'stat_2_text');
            setText('dyn-stat-3-num', 'stat_3_num'); setText('dyn-stat-3-text', 'stat_3_text');
            setText('dyn-stat-4-num', 'stat_4_num'); setText('dyn-stat-4-text', 'stat_4_text');

            setText('dyn-why-subtitle', 'why_subtitle');
            setText('dyn-why-1-title', 'why_1_title'); setText('dyn-why-1-desc', 'why_1_desc');
            setText('dyn-why-2-title', 'why_2_title'); setText('dyn-why-2-desc', 'why_2_desc');
            setText('dyn-why-3-title', 'why_3_title'); setText('dyn-why-3-desc', 'why_3_desc');

            if (c.about_text) {
                const aboutContainer = document.getElementById('dyn-about-text');
                if (aboutContainer) {
                    aboutContainer.innerHTML = c.about_text.split('\n')
                        .filter(p => p.trim() !== '')
                        .map(p => `<p>${p}</p>`)
                        .join('');
                }
            }

            if (c.packages_data) {
                packageData = JSON.parse(c.packages_data);
            }
        }
        renderPackages();
    } catch (e) {
        console.log("Dynamic content load failed:", e);
        renderPackages();
    }
}

function renderPackages() {
    const container = document.getElementById('packages-container');
    if (!container) return;

    container.innerHTML = packageData.map((pkg, index) => {
        const discountHtml = pkg.discount ? `
            <div class="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 rounded-lg w-fit mb-4 shadow-[0_0_15px_rgba(255,107,0,0.4)]">
              <p class="text-white font-bold text-xs uppercase tracking-wider">${pkg.discount}</p>
            </div>
        ` : '';

        const sFeatures = Array.isArray(pkg.shortFeatures) ? pkg.shortFeatures : (pkg.shortFeatures || '').split('\n').filter(f => f.trim());
        const featuresHtml = sFeatures.map(f => `
            <li class="flex items-start gap-3">
              <svg class="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span>${f}</span>
            </li>
        `).join('');

        return `
        <button onclick="viewPackageDetails(${index})" class="text-left group w-full h-full">
          <div class="rounded-2xl card-dark p-6 sm:p-10 h-full flex flex-col hover:glow-effect transition-all relative overflow-hidden">
            ${discountHtml}
            <h3 class="font-bebas text-3xl tracking-wider mb-2">${pkg.title}</h3>
            <p class="text-gray-400 text-sm mb-8">${pkg.duration}</p>
            <div class="mb-10">
                <span class="font-bebas text-5xl text-orange-500">${pkg.price}</span> 
                <span class="text-gray-400 ml-2">${pkg.currency || 'EGP'}</span>
            </div>
            <ul class="space-y-3 mb-auto text-sm text-gray-300 text-left">
                ${featuresHtml}
            </ul>
            <div class="pt-8 mt-8 border-t border-orange-500/20 text-left">
                <span class="text-orange-500 font-semibold uppercase tracking-wider text-sm group-hover:text-orange-300 transition-colors">View Details</span>
            </div>
          </div>
        </button>
        `;
    }).join('');

    const newCards = container.querySelectorAll('.card-dark');
    newCards.forEach(el => {
        el.classList.add('volta-animate');
        scrollObserver.observe(el);
    });
}

function calculateProtein() {
    const weight = parseFloat(document.getElementById('calc-weight').value);
    const goal = document.getElementById('calc-goal-select').value;

    if (!weight || weight <= 0) {
        showToast('Please enter a valid weight.', 'error');
        return;
    }

    let multiplier, tip;
    switch (goal) {
        case 'lose':
            multiplier = 2.2;
            tip = 'Higher protein helps preserve muscle mass while in a caloric deficit.';
            break;
        case 'gain':
            multiplier = 2.0;
            tip = 'Adequate protein supports muscle growth and recovery during bulking.';
            break;
        default:
            multiplier = 1.8;
            tip = 'This amount maintains nitrogen balance and supports general fitness.';
    }

    const protein = Math.round(weight * multiplier);
    document.getElementById('protein-amount').textContent = `${protein}g`;
    document.getElementById('protein-tip').textContent = tip;
    document.getElementById('protein-result').classList.remove('hidden');
    showToast('Protein calculated!', 'success');
}

function calculateCalories() {
    const weight = parseFloat(document.getElementById('cal-weight').value);
    const height = parseFloat(document.getElementById('cal-height').value);
    const sex = document.getElementById('cal-sex').value;
    const age = parseFloat(document.getElementById('cal-age').value);
    const activity = parseFloat(document.getElementById('cal-activity').value);

    if (!weight || !height || !age || weight <= 0 || height <= 0 || age <= 0) {
        showToast('Please fill in all fields with valid values.', 'error');
        return;
    }

    let bmr;
    if (sex === 'Female') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    }

    const tdee = Math.round(bmr * activity);

    document.getElementById('cal-deficit').textContent = (tdee - 500);
    document.getElementById('cal-maintain').textContent = tdee;
    document.getElementById('cal-surplus').textContent = (tdee + 300);
    document.getElementById('calorie-result').classList.remove('hidden');
    showToast('Calories calculated!', 'success');
}

function exportUserData() {
    if (!currentUser) {
        showToast('Please login first.', 'error');
        return;
    }

    const headers = ['Full Name', 'Email', 'Phone', 'Age', 'Height (cm)', 'Start Weight (kg)', 'Current Weight (kg)', 'Target Weight (kg)', 'Weight Goal Type', 'Experience', 'Training Days', 'Goal', 'Notes', 'Created At'];
    const row = [
        currentUser.fullName || '',
        currentUser.email || '',
        currentUser.phone || '',
        currentUser.age || '',
        currentUser.height || '',
        currentUser.startWeight || '',
        currentUser.currentWeight || '',
        currentUser.targetWeight || '',
        currentUser.weightGoalType || '',
        currentUser.experience || '',
        currentUser.trainingDays || '',
        currentUser.goal || '',
        currentUser.notes || '',
        currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleString() : ''
    ];

    let csv = headers.join(',') + '\n';
    csv += row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `volta_physique_${currentUser.fullName.replace(/\s+/g, '_')}_data.csv`;
    link.click();

    showToast('Data exported successfully!', 'success');
}

function viewPackageDetails(index) {
    selectedPackageIndex = index;
    const pkg = packageData[index];

    document.getElementById('details-title').textContent = pkg.title;
    document.getElementById('details-price').innerHTML = `${pkg.price} <span class="text-2xl">${pkg.currency}</span>`;
    document.getElementById('details-duration').textContent = pkg.duration;

    const featuresList = document.getElementById('details-features');
    featuresList.innerHTML = pkg.fullFeatures.map(f =>
        `<li class="flex items-start gap-4 text-gray-300">
      <svg class="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
      </svg>
      <span>${f}</span>
    </li>`
    ).join('');

    navigateTo('package-details');
}

function proceedToCheckout() {
    if (selectedPackageIndex !== null) {
        const pkg = packageData[selectedPackageIndex];
        const message = `Hi, I'm interested in the ${pkg.title} package (${pkg.price} ${pkg.currency} for ${pkg.duration}). My email is ${currentUser ? currentUser.email : 'not yet registered'}`;
        openWhatsApp(APP_CONFIG.links.whatsappPhone, message);
    }
}

function openWhatsApp(phone = APP_CONFIG.links.whatsappPhone, message = 'Hello VOLTA PHYSIQUE! I have a question about your coaching services.') {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
}

function openProgressPhotoForm() {
    const formUrl = APP_CONFIG.links.progressPhotoForm;
    window.open(formUrl, '_blank', 'noopener,noreferrer');
}

async function handleSignup(e) {
    e.preventDefault();

    const fullName = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim().toLowerCase();
    const phone = document.getElementById('signup-phone').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    const age = document.getElementById('signup-age').value.trim();
    const height = document.getElementById('signup-height').value.trim();
    const weight = document.getElementById('signup-weight').value.trim();
    const experience = document.getElementById('signup-experience').value;
    const trainingDays = document.getElementById('signup-days').value.trim();
    const goal = document.getElementById('signup-goal').value;
    const notes = document.getElementById('signup-notes').value.trim();

    const errorDiv = document.getElementById('signup-error');
    const successDiv = document.getElementById('signup-success');
    const btn = document.getElementById('signup-btn');

    errorDiv.classList.add('hidden');
    successDiv.classList.add('hidden');

    if (password !== confirm) {
        errorDiv.textContent = 'Passwords do not match.';
        errorDiv.classList.remove('hidden');
        return;
    }

    btn.textContent = 'Creating Account...';
    btn.disabled = true;

    try {
        const formData = new FormData();
        formData.append("action", "signup");
        formData.append("fullName", fullName);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("password", password);
        formData.append("age", age);
        formData.append("height", height);
        formData.append("weight", weight);
        formData.append("startWeight", weight);
        formData.append("currentWeight", weight);
        formData.append("targetWeight", weight);
        formData.append("experience", experience);
        formData.append("trainingDays", trainingDays);
        formData.append("goal", goal);
        formData.append("weightGoalType", "");
        formData.append("notes", notes);
        formData.append("createdAt", new Date().toISOString());

        const response = await fetch(APP_CONFIG.api.authScript, {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (!result.success) {
            errorDiv.textContent = result.message || 'Signup failed.';
            errorDiv.classList.remove('hidden');
            return;
        }

        successDiv.textContent = 'Account created successfully! Redirecting to login...';
        successDiv.classList.remove('hidden');

        setTimeout(() => {
            document.getElementById('signup-form').reset();
            navigateTo('login');
            successDiv.classList.add('hidden');
        }, 500);

    } catch (error) {
        errorDiv.textContent = 'Failed to create account. Please try again.';
        errorDiv.classList.remove('hidden');
    }

    btn.textContent = 'Create Account';
    btn.disabled = false;
}

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');
    const btn = document.getElementById('login-btn');

    errorDiv.classList.add('hidden');
    btn.textContent = 'Signing In...';
    btn.disabled = true;

    try {
        const formData = new FormData();
        formData.append("action", "login");
        formData.append("email", email);
        formData.append("password", password);

        const response = await fetch(APP_CONFIG.api.authScript, {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (!result.success) {
            errorDiv.textContent = result.message || 'Invalid email or password.';
            errorDiv.classList.remove('hidden');
            return;
        }

        // لو اللي بيعمل لوجين هو الأدمن
        if (result.isAdmin) {
            // حفظ بيانات الجلسة السرية وتوجيهك لملف الأدمن
            localStorage.setItem('volta_admin', 'true');
            localStorage.setItem('volta_admin_users', JSON.stringify(result.users));
            showToast('Admin Portal Unlocked!', 'success');
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1000);
            return; // عشان ميكملش كود المشتركين العادي
        }

        currentUser = result.user;
        localStorage.setItem('volta_user', JSON.stringify(result.user));

        updateAuthUI();
        updateDashboard();
        navigateTo('dashboard');

        document.getElementById('login-form').reset();
        showToast('Welcome back!', 'success');

    } catch (error) {
        errorDiv.textContent = 'Login failed. Please try again.';
        errorDiv.classList.remove('hidden');
    }

    btn.textContent = 'Sign In';
    btn.disabled = false;
}

function logout() {
    localStorage.removeItem('weightUnlocked');
    localStorage.removeItem('volta_access_code');
    currentUser = null;
    localStorage.removeItem('volta_user');
    localStorage.removeItem('volta_last_user_email');
    isWeightUpdateUnlocked = false;
    lockWeightUpdate();
    updateAuthUI();
    showToast('Logged out successfully.', 'success');
    navigateTo('home');
}

function updateAuthUI() {
    const loggedOut = document.getElementById('auth-nav-logged-out');
    const loggedIn = document.getElementById('auth-nav-logged-in');
    const mobileLoggedOut = document.getElementById('mobile-auth-logged-out');
    const mobileLoggedIn = document.getElementById('mobile-auth-logged-in');

    if (currentUser) {
        loggedOut.classList.add('hidden');
        loggedIn.classList.remove('hidden');
        mobileLoggedOut.classList.add('hidden');
        mobileLoggedIn.classList.remove('hidden');
    } else {
        loggedOut.classList.remove('hidden');
        loggedIn.classList.add('hidden');
        mobileLoggedOut.classList.remove('hidden');
        mobileLoggedIn.classList.add('hidden');
    }
}

function updateDashboard() {
    if (!currentUser) {
        document.getElementById('auth-required').style.display = 'block';
        document.getElementById('dashboard-content').style.display = 'none';
        return;
    }

    document.getElementById('auth-required').style.display = 'none';
    document.getElementById('dashboard-content').style.display = 'block';

    const firstName = currentUser.fullName ? String(currentUser.fullName).split(' ')[0].toUpperCase() : 'ATHLETE';
    document.getElementById('dashboard-name').textContent = firstName;

    document.getElementById('stat-age').textContent = currentUser.age || '--';
    document.getElementById('stat-height').textContent = currentUser.height || '--';
    document.getElementById('stat-weight').textContent = currentUser.currentWeight || currentUser.weight || '--';
    document.getElementById('stat-goal').textContent = currentUser.goal || '--';

    const startWeight = currentUser.weight ? parseFloat(currentUser.weight).toFixed(1) : '--';
    const currentWeight = currentUser.currentWeight || currentUser.weight || '--';
    const targetWeight = currentUser.targetWeight || '--';
    const weightGoalType = currentUser.weightGoalType || '';

    document.getElementById('weight-display-start').textContent = startWeight;
    document.getElementById('weight-display-current').textContent = currentWeight;
    document.getElementById('weight-display-target').textContent = targetWeight;
    document.getElementById('weight-display-new').textContent = '--';

    document.getElementById('weight-start').value = startWeight === '--' ? '' : startWeight;
    document.getElementById('weight-current').value = currentWeight === '--' ? '' : currentWeight;
    document.getElementById('weight-target').value = targetWeight === '--' ? '' : targetWeight;
    const goalSelect = document.getElementById('weight-goal-type');

    if (weightGoalType && goalSelect.querySelector(`option[value="${weightGoalType}"]`)) {
        goalSelect.value = weightGoalType;
    } else {
        goalSelect.value = "";
    }

    document.getElementById('weight-new').value = '';
}

async function verifyAccessCode() {
    const codeInput = document.getElementById('access-code-input');
    const errorDiv = document.getElementById('access-code-error');
    const unlockBtn = document.getElementById('unlock-btn');
    const code = codeInput.value.trim();

    errorDiv.classList.add('hidden');

    if (!code) {
        errorDiv.textContent = 'Please enter an access code';
        errorDiv.classList.remove('hidden');
        return;
    }

    const originalBtnText = unlockBtn.innerHTML;
    unlockBtn.innerHTML = 'Verifying...';
    unlockBtn.disabled = true;

    try {
        const formData = new FormData();
        formData.append("action", "verifyCode");
        formData.append("code", code);

        const response = await fetch(APP_CONFIG.api.weeklyUpdateScript, { method: "POST", body: formData });
        const result = await response.json();

        if (result.success) {
            localStorage.setItem('volta_access_code', code);
            unlockWeightUpdateDirectly();
            codeInput.value = '';
            showToast('Access code verified! Form unlocked.', 'success');
        } else {
            errorDiv.textContent = result.message || 'Invalid access code';
            errorDiv.classList.remove('hidden');
            codeInput.value = '';
        }
    } catch (error) {
        errorDiv.textContent = 'Failed to verify code. Please try again.';
        errorDiv.classList.remove('hidden');
    }

    unlockBtn.innerHTML = originalBtnText;
    unlockBtn.disabled = false;
}

function unlockWeightUpdateDirectly() {
    const contentDiv = document.getElementById('weight-update-content');
    const accessCodeSection = document.getElementById('access-code-section');
    const unlockBtn = document.getElementById('unlock-btn');

    isWeightUpdateUnlocked = true;
    contentDiv.classList.remove('blur-md', 'pointer-events-none', 'opacity-50');
    accessCodeSection.classList.add('hidden');
    unlockBtn.disabled = true;
}

function lockWeightUpdate() {
    const contentDiv = document.getElementById('weight-update-content');
    const accessCodeSection = document.getElementById('access-code-section');
    const unlockBtn = document.getElementById('unlock-btn');

    isWeightUpdateUnlocked = false;

    contentDiv.classList.add('blur-md', 'pointer-events-none', 'opacity-50');
    accessCodeSection.classList.remove('hidden');
    unlockBtn.disabled = false;
}

async function silentVerifyAccessCode(code) {
    try {
        const formData = new FormData();
        formData.append("action", "verifyCode");
        formData.append("code", code);

        const response = await fetch(APP_CONFIG.api.weeklyUpdateScript, { method: "POST", body: formData });
        const result = await response.json();

        if (result.success) {
            unlockWeightUpdateDirectly();
        } else {
            localStorage.removeItem('volta_access_code');
        }
    } catch (error) {
        console.log('Silent verification failed:', error);
    }
}

function enableTargetEdit() {
    const targetInput = document.getElementById('weight-target');
    const editBtn = document.getElementById('target-edit-btn');
    const editStatus = document.getElementById('target-edit-status');

    if (targetInput.readOnly) {
        targetInput.readOnly = false;
        targetInput.focus();
        editBtn.textContent = 'Lock';
        editBtn.classList.add('border-orange-500', 'bg-orange-500/10');
        editStatus.textContent = 'editable';
    } else {
        targetInput.readOnly = true;
        editBtn.textContent = 'Edit';
        editBtn.classList.remove('border-orange-500', 'bg-orange-500/10');
        editStatus.textContent = 'locked';
    }
}

async function handleWeightUpdate(e) {
    e.preventDefault();

    if (!currentUser) {
        showToast('Please login first.', 'error');
        return;
    }

    if (!isWeightUpdateUnlocked) {
        showToast('Please unlock the form with the access code.', 'error');
        return;
    }

    const errorDiv = document.getElementById('weight-update-error');
    const resultDiv = document.getElementById('weight-update-result');
    const btn = document.getElementById('weight-update-btn');

    errorDiv.classList.add('hidden');
    resultDiv.classList.add('hidden');

    const newWeight = parseFloat(document.getElementById('weight-new').value);
    const targetWeight = parseFloat(document.getElementById('weight-target').value);
    const startWeight = parseFloat(currentUser.weight);
    const currentWeight = parseFloat(document.getElementById('weight-current').value);
    const weightGoalType = document.getElementById('weight-goal-type').value;

    if (!newWeight || newWeight <= 0) {
        errorDiv.textContent = 'Please enter a valid new weight.';
        errorDiv.classList.remove('hidden');
        return;
    }

    if (!targetWeight || targetWeight <= 0) {
        errorDiv.textContent = 'Target weight is required.';
        errorDiv.classList.remove('hidden');
        return;
    }

    if (!startWeight || startWeight <= 0) {
        errorDiv.textContent = 'Start weight is missing.';
        errorDiv.classList.remove('hidden');
        return;
    }

    if (!weightGoalType) {
        errorDiv.textContent = 'Please select a weight goal type.';
        errorDiv.classList.remove('hidden');
        return;
    }

    btn.textContent = 'Submitting...';
    btn.disabled = true;

    try {
        const weeklyChange = newWeight - currentWeight;

        let progressPercentage;
        let remainingWeight;
        const goalTypeLower = String(weightGoalType).toLowerCase();
        const isLosingWeight = goalTypeLower.includes('lose');
        const isGainingWeight = goalTypeLower.includes('gain');

        if (isLosingWeight) {
            const totalGoal = startWeight - targetWeight;
            const progressDone = startWeight - newWeight;

            progressPercentage = totalGoal > 0
                ? Math.min(100, Math.max(0, Math.round((progressDone / totalGoal) * 100)))
                : 0;

            remainingWeight = newWeight - targetWeight;
            if (remainingWeight < 0) remainingWeight = 0;
        } else if (isGainingWeight) {
            const totalGoal = targetWeight - startWeight;
            const progressDone = newWeight - startWeight;

            progressPercentage = totalGoal > 0
                ? Math.min(100, Math.max(0, Math.round((progressDone / totalGoal) * 100)))
                : 0;

            remainingWeight = targetWeight - newWeight;
            if (remainingWeight < 0) remainingWeight = 0;
        } else {
            progressPercentage = 0;
            remainingWeight = 0;
        }

        try {
            const googleSheetPayload = {
                action: 'appendWeeklyUpdate',
                fullName: currentUser.fullName || '',
                startWeight: startWeight.toFixed(1),
                targetWeight: targetWeight.toFixed(1),
                previousWeight: currentWeight.toFixed(1),
                currentWeight: newWeight.toFixed(1),
                goalType: weightGoalType,
                goal: currentUser.goal || '',
                totalGoal: (isLosingWeight || isGainingWeight) ? Math.abs(targetWeight - startWeight).toFixed(1) : '0',
                progressPercent: progressPercentage,
                remaining: remainingWeight.toFixed(1),
                timestamp: new Date().toISOString()
            };

            const response = await fetch(APP_CONFIG.api.weeklyUpdateScript, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                },
                body: JSON.stringify(googleSheetPayload)
            });
            const result = await response.json();
            console.log('Google Sheets sync:', result);
        } catch (error) {
            console.log('Google Sheets sync: ', error);
        }

        // Update local user object
        currentUser.currentWeight = newWeight.toFixed(1);
        currentUser.targetWeight = targetWeight.toFixed(1);
        currentUser.weightGoalType = weightGoalType;
        currentUser.goal = weightGoalType;

        localStorage.setItem('volta_user', JSON.stringify(currentUser));

        // حدث الداشبورد الأول
        updateDashboard();

        // بعد ما الداشبورد يخلص اعرض التراكر
        displayWeightUpdateResult(
            weeklyChange,
            progressPercentage,
            remainingWeight,
            weightGoalType
        );

        // فضي خانة الوزن الجديد
        document.getElementById('weight-new').value = '';

    } catch (error) {
        console.error('Weight update error:', error);
        errorDiv.textContent = 'Failed to submit weight update. Please try again.';
        errorDiv.classList.remove('hidden');
    }

    btn.textContent = 'SUBMIT WEIGHT UPDATE';
    btn.disabled = false;
}

function displayWeightUpdateResult(weeklyChange, progressPercentage, remainingWeight, weightGoalType) {
    const resultDiv = document.getElementById('weight-update-result');
    const changeEl = document.getElementById('weight-change');
    const progressEl = document.getElementById('weight-progress');
    const remainingEl = document.getElementById('weight-remaining');
    const messageEl = document.getElementById('weight-message');

    const goalTypeLower = String(weightGoalType).toLowerCase();
    const isLosingWeight = goalTypeLower.includes('lose');
    const isGainingWeight = goalTypeLower.includes('gain');

    let changeDirection, changeColor;
    if (isLosingWeight) {
        changeDirection = weeklyChange < 0 ? '↓' : weeklyChange > 0 ? '↑' : '→';
        changeColor = weeklyChange < 0 ? 'text-green-400' : weeklyChange > 0 ? 'text-red-400' : 'text-yellow-400';
    } else if (isGainingWeight) {
        changeDirection = weeklyChange > 0 ? '↑' : weeklyChange < 0 ? '↓' : '→';
        changeColor = weeklyChange > 0 ? 'text-green-400' : weeklyChange < 0 ? 'text-red-400' : 'text-yellow-400';
    } else {
        changeDirection = '→';
        changeColor = 'text-yellow-400';
    }

    changeEl.innerHTML = `<span class="${changeColor}">${changeDirection} ${Math.abs(weeklyChange).toFixed(1)}kg</span>`;
    progressEl.textContent = `${progressPercentage}%`;

    if (remainingWeight === 0 && (isLosingWeight || isGainingWeight)) {
        remainingEl.textContent = '🎯 GOAL!';
    } else {
        remainingEl.textContent = `${remainingWeight.toFixed(1)}kg`;
    }

    let motivationalMessage = '';

    if (isLosingWeight) {
        if (progressPercentage >= 100) {
            motivationalMessage = '🔥 INCREDIBLE! You\'ve reached your target weight! Time to maintain and build strength!';
        } else if (weeklyChange < 0) {
            if (progressPercentage >= 75) {
                motivationalMessage = '💪 You\'re in the final stretch! Stay focused and keep pushing!';
            } else if (progressPercentage >= 50) {
                motivationalMessage = '⚡ Halfway there! Your consistency is paying off!';
            } else if (progressPercentage >= 25) {
                motivationalMessage = '🎯 Great progress! Keep up the discipline!';
            } else {
                motivationalMessage = '✅ Excellent start! Every kg lost is a win!';
            }
        } else if (weeklyChange === 0) {
            motivationalMessage = '📊 Weight stable this week. Stay consistent with your routine!';
        } else {
            motivationalMessage = '⚠️ Weight increased this week. Review your nutrition and training!';
        }
    } else if (isGainingWeight) {
        if (progressPercentage >= 100) {
            motivationalMessage = '🔥 LEGENDARY! You\'ve surpassed your muscle gain target!';
        } else if (weeklyChange > 0) {
            if (progressPercentage >= 75) {
                motivationalMessage = '💪 Nearly there! Keep hitting those strength targets!';
            } else if (progressPercentage >= 50) {
                motivationalMessage = '🚀 Halfway to your muscle goal! Fuel hard and train harder!';
            } else if (progressPercentage >= 25) {
                motivationalMessage = '🎯 Good gains this week! Keep eating!';
            } else {
                motivationalMessage = '✅ Great start to your bulk! Keep eating!';
            }
        } else if (weeklyChange === 0) {
            motivationalMessage = '📊 Weight stable this week. Adjust calories if needed!';
        } else {
            motivationalMessage = '⚠️ Weight decreased this week. Increase your caloric intake!';
        }
    } else {
        if (Math.abs(weeklyChange) <= 0.5) {
            motivationalMessage = '✅ Perfect! Weight is stable. Keep maintaining!';
        } else if (weeklyChange < -0.5) {
            motivationalMessage = '⚠️ Weight decreased. Slightly increase calories to maintain!';
        } else {
            motivationalMessage = '⚠️ Weight increased. Slightly decrease calories to maintain!';
        }
    }

    messageEl.textContent = motivationalMessage;
    resultDiv.classList.remove('hidden');
    showToast('Weight update submitted successfully!', 'success');
}


document.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('volta_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
        updateDashboard();

        // فحص الكود السري في الخلفية (يستهلك إنترنت لضمان الأمان)
        const savedCode = localStorage.getItem('volta_access_code');
        if (savedCode) {
            silentVerifyAccessCode(savedCode);
        }
    }

    // تشغيل نظام الأنيميشن أول ما الموقع يفتح
    initAnimations();

    // منع اللينكات الفارغة من القفز لأعلى الصفحة وتخريب الهيستوري
    document.querySelectorAll('a[onclick^="navigateTo"]').forEach(a => {
        a.addEventListener('click', function (e) {
            e.preventDefault();
        });
    });

    // استعادة الصفحة اللي المستخدم كان فيها من الرابط وقت الـ Refresh
    const initialPage = window.location.hash.replace('#', '') || 'home';
    renderPage(initialPage);

    // تشغيل كود تسخين السيرفرات أول ما الموقع يفتح
    warmUpServers();

    // تحميل محتوى الموقع المتغير (الصور والأسعار)
    loadDynamicContent();
});