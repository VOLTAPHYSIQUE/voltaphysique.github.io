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

    // تجهيز كروت المشتركين
    renderClientsCards(users);
}

function toggleClientsView() {
    const grid = document.getElementById('clients-grid');
    const btn = document.getElementById('toggle-clients-btn');

    if (grid.classList.contains('hidden')) {
        grid.classList.remove('hidden');
        btn.textContent = 'Hide Athletes';
        btn.classList.add('bg-orange-500/10');
    } else {
        grid.classList.add('hidden');
        btn.textContent = 'Show Athletes';
        btn.classList.remove('bg-orange-500/10');
    }
}

function renderClientsCards(users) {
    const grid = document.getElementById('clients-grid');
    if (users.length === 0) {
        grid.innerHTML = '<p class="text-gray-500 col-span-2 text-center py-4">No athletes found.</p>';
        return;
    }

    grid.innerHTML = users.reverse().map(user => {
        const isActive = String(user.Status || user.status || '').toLowerCase() === 'active';
        const statusBadge = isActive
            ? '<span class="px-2 py-1 rounded-md bg-green-500/10 text-green-500 text-[10px] font-bold border border-green-500/20">VIP ACTIVE</span>'
            : '<span class="px-2 py-1 rounded-md bg-yellow-500/10 text-yellow-500 text-[10px] border border-yellow-500/20">PENDING</span>';

        return `
        <div class="p-5 rounded-xl bg-[#141414] border border-orange-500/10 hover:border-orange-500/30 transition-all group">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h4 class="font-bold text-lg text-white mb-1">${user.fullName || 'Unknown Athlete'}</h4>
                    <p class="text-gray-400 text-xs uppercase tracking-wider">${user.goal || user.weightGoalType || 'No Goal Set'}</p>
                </div>
                ${statusBadge}
            </div>
            
            <div class="grid grid-cols-3 gap-2 mb-5">
                <div class="bg-[#0a0a0a] p-2 rounded-lg text-center border border-white/5">
                    <p class="text-[10px] text-gray-500 uppercase mb-1">Start</p>
                    <p class="font-bebas text-xl text-gray-300">${user.startWeight || user.weight || '--'}</p>
                </div>
                <div class="bg-[#0a0a0a] p-2 rounded-lg text-center border border-orange-500/20">
                    <p class="text-[10px] text-orange-400 uppercase mb-1">Current</p>
                    <p class="font-bebas text-xl text-orange-500">${user.currentWeight || user.weight || '--'}</p>
                </div>
                <div class="bg-[#0a0a0a] p-2 rounded-lg text-center border border-white/5">
                    <p class="text-[10px] text-gray-500 uppercase mb-1">Target</p>
                    <p class="font-bebas text-xl text-gray-300">${user.targetWeight || '--'}</p>
                </div>
            </div>
            
            <a href="https://wa.me/${String(user.phone || '').replace(/\D/g, '')}" target="_blank" 
               class="w-full py-2.5 rounded-lg bg-[#0a0a0a] border border-green-500/30 text-green-500 hover:bg-green-500/10 flex items-center justify-center gap-2 text-sm font-semibold transition-all">
               <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                   Message on WhatsApp
                </a>
            </div>
            `;
    }).join('');
}

function adminLogout() {
    localStorage.removeItem('volta_admin');
    localStorage.removeItem('volta_admin_users');
    window.location.href = 'index.html'; // قفل اللوحة والرجوع للموقع الأساسي
}