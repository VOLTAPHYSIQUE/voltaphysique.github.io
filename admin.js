let adminPackages = [];
let adminOverviewChartInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    // 1. حماية الصفحة: طرد أي زائر يحاول يفتح الصفحة مباشرة بدون إذن
    const isAdmin = localStorage.getItem('volta_admin');
    if (!isAdmin) {
        window.location.href = 'index.html';
        return;
    }

    // 2. قراءة بيانات المشتركين وعرضها
    const usersData = localStorage.getItem('volta_admin_users');
    if (usersData) {
        const users = JSON.parse(usersData);
        updateAdminStats(users);
    }

    // جلب البيانات الجديدة أوتوماتيكياً في الخلفية عند تحميل الصفحة
    fetchFreshAdminData();
});

// تحديث البيانات أوتوماتيكياً لما ترجع تفتح المتصفح أو تمسك الموبايل
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && localStorage.getItem('volta_admin')) {
        fetchFreshAdminData();
    }
});

function updateAdminStats(users) {
    document.getElementById('admin-total-users').textContent = users.length;

    // حساب عدد المشتركين الفعليين (اللي حالتهم Active)
    const activeUsers = users.filter(u => String(u.Status || u.status || '').toLowerCase() === 'active');
    const activeCountEl = document.getElementById('admin-active-users');
    if (activeCountEl) activeCountEl.textContent = activeUsers.length;

    // حساب عدد المنتظرين (اللي لسه مش Active)
    const pendingUsers = users.length - activeUsers.length;
    const pendingCountEl = document.getElementById('admin-pending-users');
    if (pendingCountEl) pendingCountEl.textContent = pendingUsers;

    // رسم الجراف
    const ctx = document.getElementById('adminOverviewChart');
    if (ctx && users.length > 0) {
        if (adminOverviewChartInstance) {
            adminOverviewChartInstance.destroy();
        }
        adminOverviewChartInstance = new Chart(ctx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['VIP Active', 'Pending'],
                datasets: [{
                    data: [activeUsers.length, pendingUsers],
                    backgroundColor: ['#22c55e', '#eab308'],
                    borderColor: ['#141414', '#141414'],
                    borderWidth: 3,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#9ca3af', font: { family: 'Inter', size: 14 }, padding: 20 }
                    }
                }
            }
        });
    }
}

async function openEditorModal() {
    const modal = document.getElementById('editor-modal');
    const content = document.getElementById('editor-modal-content');

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        content.classList.remove('scale-95');
    }, 10);

    try {
        const formData = new FormData();
        formData.append("action", "getContent");
        const response = await fetch("https://script.google.com/macros/s/AKfycbzoxWdEfo2AkM97qPmO7a6POIm09htcqZ8uDIufDsA7S-0CXc0zzrEOxFuclfNnTTVUBg/exec", { method: "POST", body: formData });
        const result = await response.json();

        let cData = result.content || {};
        document.getElementById('edit-about-image').value = cData.about_image || '';

        document.getElementById('edit-stat-1-num').value = cData.stat_1_num || '70+';
        document.getElementById('edit-stat-1-text').value = cData.stat_1_text || 'Transformations';
        document.getElementById('edit-stat-2-num').value = cData.stat_2_num || '100+';
        document.getElementById('edit-stat-2-text').value = cData.stat_2_text || 'Clients';
        document.getElementById('edit-stat-3-num').value = cData.stat_3_num || '5+';
        document.getElementById('edit-stat-3-text').value = cData.stat_3_text || 'Years Experience';
        document.getElementById('edit-stat-4-num').value = cData.stat_4_num || '24/7';
        document.getElementById('edit-stat-4-text').value = cData.stat_4_text || 'Support';

        document.getElementById('edit-why-subtitle').value = cData.why_subtitle || "Our methodology combines cutting-edge science with personalized coaching to deliver results that last.";
        document.getElementById('edit-why-1-title').value = cData.why_1_title || 'PERSONALIZED PLANS';
        document.getElementById('edit-why-1-desc').value = cData.why_1_desc || 'Custom training and nutrition protocols designed specifically for your body and goals.';
        document.getElementById('edit-why-2-title').value = cData.why_2_title || 'WEEKLY CHECK-INS';
        document.getElementById('edit-why-2-desc').value = cData.why_2_desc || 'Regular progress reviews and plan adjustments to keep you on track toward your goals.';
        document.getElementById('edit-why-3-title').value = cData.why_3_title || 'COMMUNITY SUPPORT';
        document.getElementById('edit-why-3-desc').value = cData.why_3_desc || 'Join a tribe of like-minded individuals all pushing toward greatness together.';

        const defaultAbout = "Volta Physique was built on one belief:\nMost people don't fail because they lack potential.\nThey fail because they lack structure.\nVolta is not just online coaching.\nIt's a performance driven system for ambitious individuals who are serious about transforming their physique and mindset.\nWe don't sell random workouts.\nWe build discipline.\nWe build structure.\nWe build stronger individuals.\nIf you're tired of starting over…\nIf you want real accountability…\nIf you're ready to upgrade your body and your identity\nVolta is built for you.";
        document.getElementById('edit-about-text').value = cData.about_text || defaultAbout;

        document.getElementById('edit-access-code').value = cData.access_code || '1223';

        if (cData.packages_data) {
            adminPackages = JSON.parse(cData.packages_data);
        } else {
            // تحميل الباقات الافتراضية الخاصة بيك لو الشيت لسه فاضي
            adminPackages = [
                {
                    title: 'RAMADAN 30 DAYS FAT LOSS', price: '750', currency: 'EGP', duration: '30 Days', discount: 'Limited Ramadan Offer',
                    shortFeatures: ['Fat Loss Protocol', 'Personalized Meal Plan', 'Daily Guidance'],
                    fullFeatures: ['Customized 30-day fat loss program', 'Personalized nutrition plan', 'Daily WhatsApp support', 'Weekly progress check-in', 'Form correction videos', 'Supplement recommendations', 'Limited Ramadan offer']
                },
                {
                    title: 'VOLTA NO EXCUSES', price: '999', currency: 'EGP', duration: '3 Months', discount: '',
                    shortFeatures: ['Full Training Program', 'Nutrition Plan', 'Weekly Check-ins'],
                    fullFeatures: ['Personalized workout plan (Gym / Home)', 'Video exercise explanations', 'Detailed nutrition protocol', 'Personalized Nutrition plan', 'Weekly Follow-up with the coach phone', 'Program updates every 10-15 days', '10% discount on supplements', 'VOLTA Customer Supporting if needed']
                },
                {
                    title: 'VOLTA GLOW UP 3.0', price: '1500', currency: 'EGP', duration: '3 Months', discount: 'MOST SELLER',
                    shortFeatures: ['Premium Training', 'Advanced Nutrition', 'Priority Support', 'Body Composition'],
                    fullFeatures: ['personalised workout plan (Gym / Home)', 'Video exercis explanations', 'Personalized Nutrition plan', 'Follow-up every 2-3 days with the coach', 'Program updates every 10 days', 'Food exchanges Guide', 'Recipes E-Book', 'weekly call / Zoom meeting Customer supporting', '15% Discount on supplements', 'Posing Session with Our CMO / Media Team']
                },
                {
                    title: 'VOLTA BEAST MODE', price: '4490', currency: 'EGP', duration: '6 Months', discount: 'VIP',
                    shortFeatures: ['Elite VIP Program', 'Maximum Results', 'Premium Support', 'Complete Transformation'],
                    fullFeatures: ['personalised workoup plan (Gym/Home)', 'Video exercises explanation', 'Personalised Nutrition plan', 'Daily Follow-up with the coach', 'Program updates every 10 days', 'Food exchanges', 'Recipes E-Book', '1-2 Customer Call / Zoom per week', 'Posing Session with Our Cmo / media Team', 'Mindset session / month', '20% discount on Supplements', 'Access call to the Owner(C/Ahmed khaled)']
                }
            ];
        }
        renderAdminPackages();
    } catch (e) {
        document.getElementById('admin-packages-list').innerHTML = '<p class="text-red-500">Failed to load packages.</p>';
    }
}

function closeEditorModal() {
    const modal = document.getElementById('editor-modal');
    const content = document.getElementById('editor-modal-content');
    modal.classList.add('opacity-0');
    content.classList.add('scale-95');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

function renderAdminPackages() {
    const container = document.getElementById('admin-packages-list');
    if (adminPackages.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-sm">No packages found. Add one to get started.</p>';
        return;
    }

    container.innerHTML = adminPackages.map((pkg, index) => `
        <div class="p-4 bg-[#0a0a0a] border border-orange-500/20 rounded-xl mb-4">
            <div class="flex justify-between items-center mb-3">
                <h4 class="font-bold text-white text-lg">${pkg.title || 'Untitled Package'}</h4>
                <div class="flex gap-2">
                    <button type="button" onclick="editPackage(${index})" class="px-3 py-1.5 bg-blue-500/20 text-blue-500 rounded-lg hover:bg-blue-500/30 text-xs uppercase font-bold tracking-wider">Edit</button>
                    <button type="button" onclick="deletePackage(${index})" class="px-3 py-1.5 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 text-xs uppercase font-bold tracking-wider">Delete</button>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm text-gray-400 mb-3">
                <p>Price: <span class="text-orange-500">${pkg.price} ${pkg.currency || 'EGP'}</span></p>
                <p>Duration: <span class="text-white">${pkg.duration}</span></p>
                <p class="col-span-2">Discount: <span class="text-green-500">${pkg.discount || 'None'}</span></p>
            </div>
            
            <div id="edit-form-${index}" class="hidden pt-4 border-t border-orange-500/20 space-y-3">
                <div>
                    <label class="block text-xs text-gray-400 mb-1">Package Title</label>
                    <input type="text" id="pkg-title-${index}" value="${pkg.title || ''}" class="w-full px-3 py-2 rounded-lg input-dark text-sm">
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-[10px] sm:text-xs text-gray-400 mb-1">Price</label>
                        <input type="number" id="pkg-price-${index}" value="${pkg.price || ''}" class="w-full px-3 py-2 rounded-lg input-dark text-sm">
                    </div>
                    <div>
                        <label class="block text-[10px] sm:text-xs text-gray-400 mb-1">Duration (e.g. 3 Months)</label>
                        <input type="text" id="pkg-duration-${index}" value="${pkg.duration || ''}" class="w-full px-3 py-2 rounded-lg input-dark text-sm">
                    </div>
                </div>
                <div>
                    <label class="block text-[10px] sm:text-xs text-gray-400 mb-1">Discount Badge (Optional)</label>
                    <input type="text" id="pkg-discount-${index}" value="${pkg.discount || ''}" placeholder="e.g. 20% OFF or VIP" class="w-full px-3 py-2 rounded-lg input-dark text-sm border-green-500/30">
                </div>
                <div>
                    <label class="block text-[10px] sm:text-xs text-gray-400 mb-1">Short Features (One per line - Shown on card)</label>
                    <textarea id="pkg-short-${index}" rows="3" class="w-full px-3 py-2 rounded-lg input-dark text-sm leading-tight">${Array.isArray(pkg.shortFeatures) ? pkg.shortFeatures.join('\n') : (pkg.shortFeatures || '')}</textarea>
                </div>
                <div>
                    <label class="block text-[10px] sm:text-xs text-gray-400 mb-1">Full Features (One per line - Shown in details)</label>
                    <textarea id="pkg-full-${index}" rows="4" class="w-full px-3 py-2 rounded-lg input-dark text-sm leading-tight">${Array.isArray(pkg.fullFeatures) ? pkg.fullFeatures.join('\n') : (pkg.fullFeatures || '')}</textarea>
                </div>
                <div class="flex justify-end gap-2 mt-5">
                    <button type="button" onclick="editPackage(${index})" class="px-3 sm:px-4 py-2 text-gray-400 hover:text-white text-xs sm:text-sm">Cancel</button>
                    <button type="button" onclick="savePackage(event, ${index})" class="px-3 sm:px-4 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 text-[10px] sm:text-sm uppercase tracking-wider">Save Package</button>
                </div>
            </div>
        </div>
    `).join('');
}

function editPackage(index) {
    const form = document.getElementById(`edit-form-${index}`);
    form.classList.toggle('hidden');
}

function addNewPackage() {
    adminPackages.push({
        title: 'New Package', price: '0', currency: 'EGP', duration: '1 Month', discount: '', shortFeatures: [], fullFeatures: []
    });
    renderAdminPackages();
    editPackage(adminPackages.length - 1);
}

async function savePackage(e, index) {
    const btn = e.target;
    const originalText = btn.textContent;
    btn.textContent = 'Saving...';

    adminPackages[index] = {
        title: document.getElementById(`pkg-title-${index}`).value,
        price: document.getElementById(`pkg-price-${index}`).value,
        currency: 'EGP',
        duration: document.getElementById(`pkg-duration-${index}`).value,
        discount: document.getElementById(`pkg-discount-${index}`).value,
        shortFeatures: document.getElementById(`pkg-short-${index}`).value.split('\n').filter(f => f.trim()),
        fullFeatures: document.getElementById(`pkg-full-${index}`).value.split('\n').filter(f => f.trim()),
    };

    await saveContentToDB({ packages_data: JSON.stringify(adminPackages) });
    btn.textContent = originalText;
    renderAdminPackages();
}

async function deletePackage(index) {
    const pkgName = adminPackages[index].title || 'this package';
    const pass = prompt(`Are you sure you want to permanently delete "${pkgName}"?\n\nEnter Admin Password to confirm:`);
    if (pass !== "VoltaAdmin123") {
        if (pass) alert("Incorrect Password");
        return;
    }

    adminPackages.splice(index, 1);
    await saveContentToDB({ packages_data: JSON.stringify(adminPackages) });
    renderAdminPackages();
}

async function saveGeneralSettings(e) {
    if (e) e.preventDefault();

    const pass = prompt("Enter Admin Password to save website content & security settings:");
    if (pass !== "VoltaAdmin123") {
        if (pass) alert("Incorrect Password");
        return;
    }

    const btn = document.getElementById('save-general-btn');
    btn.textContent = 'Saving...';
    await saveContentToDB({
        about_image: document.getElementById('edit-about-image').value.trim(),
        stat_1_num: document.getElementById('edit-stat-1-num').value.trim(),
        stat_1_text: document.getElementById('edit-stat-1-text').value.trim(),
        stat_2_num: document.getElementById('edit-stat-2-num').value.trim(),
        stat_2_text: document.getElementById('edit-stat-2-text').value.trim(),
        stat_3_num: document.getElementById('edit-stat-3-num').value.trim(),
        stat_3_text: document.getElementById('edit-stat-3-text').value.trim(),
        stat_4_num: document.getElementById('edit-stat-4-num').value.trim(),
        stat_4_text: document.getElementById('edit-stat-4-text').value.trim(),
        why_subtitle: document.getElementById('edit-why-subtitle').value.trim(),
        why_1_title: document.getElementById('edit-why-1-title').value.trim(),
        why_1_desc: document.getElementById('edit-why-1-desc').value.trim(),
        why_2_title: document.getElementById('edit-why-2-title').value.trim(),
        why_2_desc: document.getElementById('edit-why-2-desc').value.trim(),
        why_3_title: document.getElementById('edit-why-3-title').value.trim(),
        why_3_desc: document.getElementById('edit-why-3-desc').value.trim(),
        about_text: document.getElementById('edit-about-text').value.trim(),
        access_code: document.getElementById('edit-access-code').value.trim()
    });
    btn.textContent = 'Save Content';
    alert("Content updated successfully!");
}

async function saveContentToDB(updates) {
    try {
        const formData = new FormData();
        formData.append("action", "updateContent");
        formData.append("adminPassword", "VoltaAdmin123");
        formData.append("updates", JSON.stringify(updates));

        const response = await fetch("https://script.google.com/macros/s/AKfycbzoxWdEfo2AkM97qPmO7a6POIm09htcqZ8uDIufDsA7S-0CXc0zzrEOxFuclfNnTTVUBg/exec", { method: "POST", body: formData });
        const result = await response.json();

        if (!result.success) {
            alert("Failed to save: " + result.message);
        }
    } catch (e) {
        alert("Network error while saving.");
    }
}

async function refreshAdminData(event) {
    const btn = event.currentTarget;
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<span class="text-xs">Refreshing...</span>';
    btn.disabled = true;

    await fetchFreshAdminData();

    btn.innerHTML = originalHtml;
    btn.disabled = false;
}

async function fetchFreshAdminData() {
    try {
        const formData = new FormData();
        formData.append("action", "login");
        formData.append("email", "admin");
        formData.append("password", "VoltaAdmin123");

        const response = await fetch("https://script.google.com/macros/s/AKfycbzoxWdEfo2AkM97qPmO7a6POIm09htcqZ8uDIufDsA7S-0CXc0zzrEOxFuclfNnTTVUBg/exec", { method: "POST", body: formData });
        const result = await response.json();

        if (result.success && result.isAdmin) {
            localStorage.setItem('volta_admin_users', JSON.stringify(result.users));
            updateAdminStats(result.users);

            // تحديث الجداول لو كانت مفتوحة قدامك
            const titleEl = document.getElementById('admin-modal-title');
            if (titleEl && !document.getElementById('admin-modal').classList.contains('hidden')) {
                const title = titleEl.textContent;
                if (title.includes('UPDATES')) openAdminModal('updates');
                else if (title.includes('TRACKER')) openAdminModal('tracker');
            }
        }
    } catch (e) {
        console.log("Failed to auto-refresh data.", e);
    }
}

function openAdminModal(type) {
    const modal = document.getElementById('admin-modal');
    const modalContent = document.getElementById('admin-modal-content');
    const title = document.getElementById('admin-modal-title');
    const thead = document.getElementById('admin-modal-thead');
    const tbody = document.getElementById('admin-modal-tbody');
    const modalLink = document.getElementById('admin-modal-link');
    const statsEl = document.getElementById('admin-modal-stats');

    const usersData = localStorage.getItem('volta_admin_users');
    const users = usersData ? JSON.parse(usersData).reverse() : [];

    if (type === 'tracker') {
        title.innerHTML = 'CLIENT <span class="text-orange-500">TRACKER</span>';

        const activeCount = users.filter(u => String(u.Status || u.status || '').toLowerCase() === 'active').length;
        const pendingCount = users.length - activeCount;

        if (statsEl) {
            statsEl.classList.remove('hidden');
            statsEl.innerHTML = `
                <span class="px-2 py-1 rounded-md bg-gray-500/10 text-gray-400 border border-gray-500/20">TOTAL: <span class="text-white">${users.length}</span></span>
                <span class="px-2 py-1 rounded-md bg-green-500/10 text-green-500 border border-green-500/20">VIP ACTIVE: <span class="text-white">${activeCount}</span></span>
                <span class="px-2 py-1 rounded-md bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">PENDING: <span class="text-white">${pendingCount}</span></span>
            `;
        }

        modalLink.href = 'https://docs.google.com/spreadsheets/d/1pdd45vYARIzzCXc3WJCgLUASPDCifca2FnLKA-ATISY/edit?usp=sharing';

        thead.innerHTML = `
            <tr class="bg-[#1a1a1a] border-b border-orange-500/20 text-[10px] sm:text-xs uppercase tracking-wider text-gray-400">
                <th class="p-3 sm:p-4 font-medium">Name</th>
                <th class="p-3 sm:p-4 font-medium text-center">Contact</th>
                <th class="p-3 sm:p-4 font-medium">Age</th>
                <th class="p-3 sm:p-4 font-medium">Height</th>
                <th class="p-3 sm:p-4 font-medium">Exp.</th>
                <th class="p-3 sm:p-4 font-medium text-center">Status</th>
                <th class="p-3 sm:p-4 font-medium">Joined</th>
                <th class="p-3 sm:p-4 font-medium text-center">Action</th>
            </tr>
        `;
        tbody.innerHTML = users.map(user => {
            const isActive = String(user.Status || user.status || '').toLowerCase() === 'active';
            const statusBadge = isActive
                ? `<button onclick="toggleUserStatus(event, '${user.email}', 'Pending')" class="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md bg-green-500/10 text-green-500 text-[9px] sm:text-[10px] font-bold border border-green-500/20 hover:bg-green-500/20 transition-colors">VIP ACTIVE</button>`
                : `<button onclick="toggleUserStatus(event, '${user.email}', 'Active')" class="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md bg-yellow-500/10 text-yellow-500 text-[9px] sm:text-[10px] border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors">PENDING</button>`;
            return `
            <tr class="hover:bg-white/5 transition-colors admin-table-row" data-status="${isActive ? 'active' : 'pending'}">
                <td class="p-2 sm:p-4 font-semibold text-white whitespace-normal min-w-[90px] sm:min-w-[120px] text-[11px] sm:text-sm">${user.fullName || '--'}</td>
                <td class="p-2 sm:p-4 text-center">
                    <a href="https://wa.me/${String(user.phone || '').replace(/\D/g, '')}" target="_blank" class="text-green-500 hover:text-green-400 inline-flex items-center justify-center p-1.5 sm:p-0 bg-green-500/10 sm:bg-transparent rounded-lg sm:rounded-none">
                        <svg class="w-4 h-4 sm:hidden" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        <span class="hidden sm:inline text-xs sm:text-sm hover:underline ml-1">${user.phone || '--'}</span>
                    </a>
                </td>
                <td class="p-3 sm:p-4 text-xs">${user.age || '--'}</td>
                <td class="p-3 sm:p-4 text-xs">${user.height || '--'}</td>
                <td class="p-3 sm:p-4 text-[10px] sm:text-xs">${user.experience || '--'}</td>
                <td class="p-3 sm:p-4 text-center">${statusBadge}</td>
                <td class="p-3 sm:p-4 text-[10px] sm:text-xs text-gray-500">${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '--'}</td>
                <td class="p-2 sm:p-4 text-center flex justify-center gap-1 sm:gap-2">
                    <button onclick="openEditAthleteModal('${user.email}')" class="p-1.5 sm:p-2 bg-yellow-500/10 text-yellow-500 rounded-lg hover:bg-yellow-500/20 transition-colors inline-flex items-center justify-center" title="Edit Athlete Data">
                        <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button onclick="deleteClient(event, '${user.email}', '${(user.fullName || '').replace(/['"]/g, '')}')" class="p-1.5 sm:p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors inline-flex items-center justify-center" title="Remove Client">
                        <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </td>
            </tr>
            `;
        }).join('') || '<tr><td colspan="8" class="p-4 text-center text-gray-500">No clients found.</td></tr>';

    } else if (type === 'updates') {
        title.innerHTML = 'WEEKLY <span class="text-orange-500">UPDATES</span>';
        if (statsEl) statsEl.classList.add('hidden');
        modalLink.href = 'https://docs.google.com/spreadsheets/d/1JjwXxEUpFrNZPXNyx25GCYV9DuXt86TmQVaWqy8QFSU/edit?usp=sharing';

        thead.innerHTML = `
            <tr class="bg-[#1a1a1a] border-b border-orange-500/20 text-[9px] sm:text-xs uppercase tracking-wider text-gray-400">
                <th class="p-3 sm:p-4 font-medium">Date</th>
                <th class="p-3 sm:p-4 font-medium">Name</th>
                <th class="p-3 sm:p-4 font-medium">Goal</th>
                <th class="p-3 sm:p-4 font-medium hidden sm:table-cell">Previous</th>
                <th class="p-3 sm:p-4 font-medium text-center">Current</th>
                <th class="p-3 sm:p-4 font-medium hidden sm:table-cell">Target</th>
                <th class="p-3 sm:p-4 font-medium text-center">Action</th>
            </tr>
        `;
        tbody.innerHTML = '<tr><td colspan="7" class="p-4 text-center text-gray-500">Loading updates from server...</td></tr>';

        // استدعاء البيانات من شيت التحديثات
        loadWeeklyUpdates();
    }

    const filterEl = document.getElementById('admin-filter');
    if (filterEl) {
        filterEl.value = 'all';
        filterEl.style.display = type === 'updates' ? 'none' : 'block'; // إخفاء الفلتر في التحديثات
    }

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modalContent.classList.remove('scale-95');
    }, 10);
}

async function loadWeeklyUpdates() {
    const tbody = document.getElementById('admin-modal-tbody');
    try {
        const formData = new FormData();
        formData.append("action", "getWeeklyUpdates");
        formData.append("adminPassword", "VoltaAdmin123");

        // استدعاء سكريبت التحديثات الأسبوعية
        const response = await fetch("https://script.google.com/macros/s/AKfycbxO9QnDSGkTrnvWDhLTnTe9wkOxA6GdyVG0w4eDD9uZacteLbO2f2nzikecr2y8syhN/exec", { method: "POST", body: formData });
        const result = await response.json();

        if (result.success) {
            const updates = result.data.reverse(); // الأحدث فوق
            tbody.innerHTML = updates.map(update => {
                const dateStr = update.timestamp ? new Date(update.timestamp).toLocaleDateString() : '--';
                return `
                <tr class="hover:bg-white/5 transition-colors">
                    <td class="p-3 sm:p-4 text-[10px] sm:text-xs text-gray-500">${dateStr}</td>
                    <td class="p-3 sm:p-4 font-semibold text-white whitespace-normal min-w-[90px] sm:min-w-[120px] text-[11px] sm:text-sm">${update.fullName || '--'}</td>
                    <td class="p-3 sm:p-4 text-[10px] sm:text-xs">${update.goalType || '--'}</td>
                    <td class="p-3 sm:p-4 hidden sm:table-cell">${update.previousWeight || '--'}</td>
                    <td class="p-3 sm:p-4 text-orange-400 font-bold text-center">${update.currentWeight || '--'}</td>
                    <td class="p-3 sm:p-4 hidden sm:table-cell">${update.targetWeight || '--'}</td>
                    <td class="p-3 sm:p-4 flex justify-center gap-1 sm:gap-2">
                        <button onclick="viewAthleteGraph('${update.email}')" class="p-1.5 sm:px-3 sm:py-1.5 bg-blue-500/10 text-blue-500 text-[10px] sm:text-xs rounded-lg hover:bg-blue-500/20 transition-colors inline-flex items-center justify-center" title="Graph">
                            <svg class="w-4 h-4 sm:hidden pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4m8 4v8m-4-4v4m-4-8v8M4 20h16"></path></svg>
                            <span class="hidden sm:inline font-semibold">Graph</span>
                        </button>
                    </td>
                </tr>
                `;
            }).join('') || '<tr><td colspan="7" class="p-4 text-center text-gray-500">No updates found.</td></tr>';
        } else {
            tbody.innerHTML = `<tr><td colspan="7" class="p-4 text-center text-red-500">Error: ${result.message}</td></tr>`;
        }
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="7" class="p-4 text-center text-red-500">Failed to load from server.</td></tr>';
    }
}

async function loadWeeklyUpdates() {
    const tbody = document.getElementById('admin-modal-tbody');
    try {
        const formData = new FormData();
        formData.append("action", "getWeeklyUpdates");
        formData.append("adminPassword", "VoltaAdmin123");

        // استدعاء سكريبت التحديثات الأسبوعية
        const response = await fetch("https://script.google.com/macros/s/AKfycbwJLHda0hAjvHnr84kSlSYfez_6bzIrWnWJGpHH6jwa1zCiNIp1G-fWKpG8eeCF4nWa/exec", { method: "POST", body: formData });
        const result = await response.json();

        if (result.success) {
            const updates = result.data.reverse(); // الأحدث فوق
            tbody.innerHTML = updates.map(update => {
                const dateStr = update.timestamp ? new Date(update.timestamp).toLocaleDateString() : '--';
                return `
                <tr class="hover:bg-white/5 transition-colors">
                    <td class="p-3 sm:p-4 text-[10px] sm:text-xs text-gray-500">${dateStr}</td>
                    <td class="p-3 sm:p-4 font-semibold text-white whitespace-normal min-w-[90px] sm:min-w-[120px] text-[11px] sm:text-sm">${update.fullName || '--'}</td>
                    <td class="p-3 sm:p-4 text-[10px] sm:text-xs">${update.goalType || '--'}</td>
                    <td class="p-3 sm:p-4 hidden sm:table-cell">${update.previousWeight || '--'}</td>
                    <td class="p-3 sm:p-4 text-orange-400 font-bold text-center">${update.currentWeight || '--'}</td>
                    <td class="p-3 sm:p-4 hidden sm:table-cell">${update.targetWeight || '--'}</td>
                    <td class="p-3 sm:p-4 flex justify-center gap-1 sm:gap-2">
                        <button onclick="viewAthleteGraph('${update.email}')" class="p-1.5 sm:px-3 sm:py-1.5 bg-blue-500/10 text-blue-500 text-[10px] sm:text-xs rounded-lg hover:bg-blue-500/20 transition-colors inline-flex items-center justify-center" title="Graph">
                            <svg class="w-4 h-4 sm:hidden pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4m8 4v8m-4-4v4m-4-8v8M4 20h16"></path></svg>
                            <span class="hidden sm:inline font-semibold">Graph</span>
                        </button>
                    </td>
                </tr>
                `;
            }).join('') || '<tr><td colspan="7" class="p-4 text-center text-gray-500">No updates found.</td></tr>';
        } else {
            tbody.innerHTML = `<tr><td colspan="7" class="p-4 text-center text-red-500">Error: ${result.message}</td></tr>`;
        }
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="7" class="p-4 text-center text-red-500">Failed to load from server.</td></tr>';
    }
}

function applyAdminFilter() {
    const filterVal = document.getElementById('admin-filter').value;
    const rows = document.querySelectorAll('.admin-table-row');

    rows.forEach(row => {
        if (filterVal === 'all') {
            row.style.display = '';
        } else if (filterVal === 'active' && row.dataset.status === 'active') {
            row.style.display = '';
        } else if (filterVal === 'pending' && row.dataset.status === 'pending') {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function closeAdminModal() {
    const modal = document.getElementById('admin-modal');
    const modalContent = document.getElementById('admin-modal-content');

    modal.classList.add('opacity-0');
    modalContent.classList.add('scale-95');

    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

function adminLogout() {
    localStorage.removeItem('volta_admin');
    localStorage.removeItem('volta_admin_users');
    window.location.href = 'index.html'; // قفل اللوحة والرجوع للموقع الأساسي
}

async function deleteClient(event, email, name) {
    // 1. طلب الباسورد كخطوة تأكيدية للحماية
    const adminPass = prompt(`Are you sure you want to permanently remove ${name}?\n\nEnter Admin Password to confirm:`);

    if (!adminPass) return; // لو داس كنسل أو مدخلش حاجة

    const btn = event.target.closest('button');
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<span class="text-xs">...</span>';
    btn.disabled = true;

    try {
        const formData = new FormData();
        formData.append("action", "deleteUser");
        formData.append("email", email);
        formData.append("adminPassword", adminPass);

        // استخدام رابط السكريبت الخاص بالـ Login/Signup
        const response = await fetch("https://script.google.com/macros/s/AKfycbzoxWdEfo2AkM97qPmO7a6POIm09htcqZ8uDIufDsA7S-0CXc0zzrEOxFuclfNnTTVUBg/exec", {
            method: "POST",
            body: formData
        });
        const result = await response.json();

        if (result.success) {
            // تحديث الذاكرة واللوحة بدون ريفرش
            const usersData = localStorage.getItem('volta_admin_users');
            if (usersData) {
                let users = JSON.parse(usersData);
                users = users.filter(u => u.email !== email); // شيل العميل من القائمة
                localStorage.setItem('volta_admin_users', JSON.stringify(users));

                updateAdminStats(users); // تحديث الأرقام اللي فوق

                const title = document.getElementById('admin-modal-title').textContent;
                if (title && title.includes('UPDATES')) openAdminModal('updates');
                else if (title && title.includes('TRACKER')) openAdminModal('tracker');
            }
        } else {
            alert('Failed to remove user: ' + result.message);
            btn.innerHTML = originalHtml;
            btn.disabled = false;
        }
    } catch (error) {
        alert('Connection error while trying to remove user.');
        btn.innerHTML = originalHtml;
        btn.disabled = false;
    }
}

function openEditAthleteModal(email) {
    const usersData = localStorage.getItem('volta_admin_users');
    const users = usersData ? JSON.parse(usersData) : [];
    const user = users.find(u => u.email === email);
    if (!user) return;

    document.getElementById('edit-athlete-email').value = user.email;
    document.getElementById('edit-athlete-goal').value = user.weightGoalType || user.goal || '';
    document.getElementById('edit-athlete-current').value = user.currentWeight || user.weight || '';
    document.getElementById('edit-athlete-target').value = user.targetWeight || '';

    const modal = document.getElementById('edit-athlete-modal');
    const content = document.getElementById('edit-athlete-modal-content');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        content.classList.remove('scale-95');
    }, 10);
}

function closeEditAthleteModal() {
    const modal = document.getElementById('edit-athlete-modal');
    const content = document.getElementById('edit-athlete-modal-content');
    modal.classList.add('opacity-0');
    content.classList.add('scale-95');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

async function saveAthleteData(e) {
    const btn = e.currentTarget;
    const originalText = btn.textContent;
    btn.textContent = 'Saving...';
    btn.disabled = true;

    const email = document.getElementById('edit-athlete-email').value;
    const goalType = document.getElementById('edit-athlete-goal').value;
    const currentWeight = document.getElementById('edit-athlete-current').value;
    const targetWeight = document.getElementById('edit-athlete-target').value;

    try {
        const formData = new FormData();
        formData.append("action", "syncWeights");
        formData.append("email", email);
        formData.append("currentWeight", currentWeight);
        formData.append("targetWeight", targetWeight);
        formData.append("goalType", goalType);

        const response = await fetch("https://script.google.com/macros/s/AKfycbzoxWdEfo2AkM97qPmO7a6POIm09htcqZ8uDIufDsA7S-0CXc0zzrEOxFuclfNnTTVUBg/exec", { method: "POST", body: formData });
        const result = await response.json();

        if (result.success) {
            const usersData = localStorage.getItem('volta_admin_users');
            if (usersData) {
                let users = JSON.parse(usersData);
                const userIndex = users.findIndex(u => u.email === email);
                if (userIndex !== -1) {
                    users[userIndex].currentWeight = currentWeight;
                    users[userIndex].targetWeight = targetWeight;
                    users[userIndex].weightGoalType = goalType;
                    users[userIndex].goal = goalType;
                    localStorage.setItem('volta_admin_users', JSON.stringify(users));

                    const title = document.getElementById('admin-modal-title').textContent;
                    if (title && title.includes('UPDATES')) openAdminModal('updates');
                    else if (title && title.includes('TRACKER')) openAdminModal('tracker');
                }
            }
            closeEditAthleteModal();
        } else {
            alert("Failed to update: " + (result.message || "Unknown error"));
        }
    } catch (e) {
        alert("Network error while saving athlete data.");
    }
    btn.textContent = originalText;
    btn.disabled = false;
}

let adminChartInstance = null;

function viewAthleteGraph(email) {
    const usersData = localStorage.getItem('volta_admin_users');
    const users = usersData ? JSON.parse(usersData) : [];
    const user = users.find(u => u.email === email);
    if (!user) return;

    document.getElementById('graph-athlete-name').textContent = user.fullName || 'Athlete';
    document.getElementById('graph-athlete-goal').textContent = user.goal || user.weightGoalType || 'No Goal Set';

    const modal = document.getElementById('graph-modal');
    const content = document.getElementById('graph-modal-content');

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        content.classList.remove('scale-95');
    }, 10);

    const canvas = document.getElementById('adminWeightChart');
    if (!canvas) return;

    const startW = parseFloat(user.startWeight || user.weight) || 0;
    const currentW = parseFloat(user.currentWeight || user.weight) || 0;
    const targetW = parseFloat(user.targetWeight) || 0;

    if (adminChartInstance) {
        adminChartInstance.destroy();
    }

    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(255, 107, 0, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 107, 0, 0.0)');

    adminChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Start', 'Current', 'Target'],
            datasets: [{
                label: 'Weight (kg)',
                data: [startW, currentW, targetW],
                borderColor: '#ff6b00',
                backgroundColor: gradient,
                borderWidth: 3,
                pointBackgroundColor: '#0a0a0a',
                pointBorderColor: '#ff6b00',
                pointBorderWidth: 3,
                pointRadius: 6,
                pointHoverRadius: 8,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#141414', titleColor: '#ff6b00', bodyColor: '#fff', borderColor: 'rgba(255,107,0,0.2)',
                    borderWidth: 1, padding: 12, displayColors: false, callbacks: { label: (ctx) => ctx.parsed.y + ' kg' }
                }
            },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } },
                x: { grid: { display: false }, ticks: { color: '#9ca3af', font: { family: 'Inter', weight: 'bold' } } }
            }
        }
    });
}

function closeGraphModal() {
    const modal = document.getElementById('graph-modal');
    const content = document.getElementById('graph-modal-content');
    modal.classList.add('opacity-0');
    content.classList.add('scale-95');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

async function saveAccessCode(e) {
    if (e) e.preventDefault();

    const pass = prompt("Enter Admin Password to update the Access Code:");
    if (pass !== "VoltaAdmin123") {
        if (pass) alert("Incorrect Password");
        return;
    }

    const btn = e.currentTarget;
    const originalText = btn.textContent;
    btn.textContent = 'Saving...';
    btn.disabled = true;

    await saveContentToDB({
        access_code: document.getElementById('edit-access-code').value.trim()
    });

    btn.textContent = originalText;
    btn.disabled = false;
    alert("Access Code updated successfully!");
}

async function toggleUserStatus(event, email, newStatus) {
    event.stopPropagation();
    const btn = event.currentTarget;
    const originalHtml = btn.innerHTML;
    const originalClass = btn.className;

    // تأثير سريع جداً (Optimistic UI) عشان يقلب معاك في نفس اللحظة بدون ريفرش
    if (newStatus === 'Active') {
        btn.innerHTML = 'VIP ACTIVE';
        btn.className = "px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md bg-green-500/10 text-green-500 text-[9px] sm:text-[10px] font-bold border border-green-500/20 hover:bg-green-500/20 transition-colors";
        btn.setAttribute('onclick', `toggleUserStatus(event, '${email}', 'Pending')`);
    } else {
        btn.innerHTML = 'PENDING';
        btn.className = "px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md bg-yellow-500/10 text-yellow-500 text-[9px] sm:text-[10px] border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors";
        btn.setAttribute('onclick', `toggleUserStatus(event, '${email}', 'Active')`);
    }
    btn.disabled = true;

    try {
        const formData = new FormData();
        formData.append("action", "updateUserStatus");
        formData.append("email", email);
        formData.append("status", newStatus);
        formData.append("adminPassword", "VoltaAdmin123");

        // الاتصال بسكريبت جوجل الخاص بالتسجيل والبيانات
        const response = await fetch("https://script.google.com/macros/s/AKfycbzoxWdEfo2AkM97qPmO7a6POIm09htcqZ8uDIufDsA7S-0CXc0zzrEOxFuclfNnTTVUBg/exec", {
            method: "POST",
            body: formData
        });
        const result = await response.json();

        if (result.success) {
            const usersData = localStorage.getItem('volta_admin_users');
            if (usersData) {
                let users = JSON.parse(usersData);
                const userIndex = users.findIndex(u => u.email === email);
                if (userIndex !== -1) {
                    users[userIndex].Status = newStatus;
                    users[userIndex].status = newStatus;
                    localStorage.setItem('volta_admin_users', JSON.stringify(users));
                    updateAdminStats(users);

                    const title = document.getElementById('admin-modal-title').textContent;
                    if (title && title.includes('UPDATES')) { openAdminModal('updates'); }
                    else if (title && title.includes('TRACKER')) { openAdminModal('tracker'); }
                }
            }
        } else {
            alert("Failed to update status: " + result.message);
            btn.innerHTML = originalHtml;
            btn.disabled = false;
        }
    } catch (e) {
        alert("Connection error while updating status.");
        btn.innerHTML = originalHtml;
        btn.disabled = false;
    }
}