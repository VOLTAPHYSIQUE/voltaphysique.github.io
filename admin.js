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
        populateAdminTable(users);
    }
});

function populateAdminTable(users) {
    document.getElementById('admin-total-users').textContent = users.length;

    // حساب عدد المشتركين الفعليين (اللي حالتهم Active)
    const activeUsers = users.filter(u => String(u.Status || u.status || '').toLowerCase() === 'active');
    const activeCountEl = document.getElementById('admin-active-users');
    if (activeCountEl) activeCountEl.textContent = activeUsers.length;

    const tbody = document.getElementById('admin-users-table');

    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="p-4 text-center text-gray-500">No athletes found</td></tr>';
        return;
    }

    tbody.innerHTML = users.reverse().map(user => `
        ${(() => {
            const isActive = String(user.Status || user.status || '').toLowerCase() === 'active';
            const statusBadge = isActive
                ? '<span class="px-2 py-1 rounded-md bg-green-500/10 text-green-500 text-xs font-bold">VIP Active</span>'
                : '<span class="px-2 py-1 rounded-md bg-gray-500/10 text-gray-400 text-xs">Pending</span>';
            return `
        <tr class="hover:bg-white/5 transition-colors">
            <td class="p-4 font-semibold text-white">${user.fullName || '--'}</td>
            <td class="p-4">
                <a href="https://wa.me/${String(user.phone || '').replace(/\D/g, '')}" target="_blank" class="text-orange-500 hover:text-orange-400 hover:underline flex items-center gap-2">
                    ${user.phone || '--'} 💬
                </a>
            </td>
            <td class="p-4"><span class="px-2 py-1 rounded-md bg-orange-500/10 text-orange-500 text-xs">${user.goal || user.weightGoalType || '--'}</span></td>
            <td class="p-4">${user.startWeight || user.weight || '--'} kg</td>
            <td class="p-4 text-orange-400 font-bold">${user.currentWeight || user.weight || '--'} kg</td>
            <td class="p-4">${user.targetWeight || '--'} kg</td>
            <td class="p-4">${statusBadge}</td>
            <td class="p-4 text-xs text-gray-500">${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '--'}</td>
        </tr>
            `;
        })()}
    `).join('');
}

function adminLogout() {
    localStorage.removeItem('volta_admin');
    localStorage.removeItem('volta_admin_users');
    window.location.href = 'index.html'; // قفل اللوحة والرجوع للموقع الأساسي
}