let accountData = {
    name: '',
    age: 0,
    gender: '',
    address: '',
    branch: '',
    phone: 0,
    email: '',
    aadhar: 0,
    password: '',
    account_number: 0,
    balance: 0,
    accountExists: false
};

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification active ${type}`;
    setTimeout(() => {
        notification.classList.remove('active');
    }, 3000);
}

async function showForm(formId) {
    const forms = document.querySelectorAll('.form-container');
    forms.forEach(form => form.classList.remove('active'));

    const selectedForm = document.getElementById(formId);
    if (selectedForm) {
        selectedForm.classList.add('active');
    }

    const menuBtns = document.querySelectorAll('.menu-btn');
    menuBtns.forEach(btn => btn.classList.remove('active'));
    const clicked = document.querySelector(`.menu-btn[onclick="showForm('${formId}')"]`);
    if (clicked) {
        clicked.classList.add('active');
    }

    if (formId === 'view-account') {
        displayAccountDetails();
    }

    if (formId === 'check-balance') {
        displayBalance();
    }

    if (formId === 'visitor-log') {
        await loadVisitors();
    }
}

async function apiRequest(url, method = 'GET', body = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (body) options.body = JSON.stringify(body);
    const response = await fetch(url, options);
    return response.json().then(data => ({ status: response.status, data }));
}

let visitorData = [];

async function loadAccount() {
    const result = await apiRequest('/api/account');
    if (result.status === 200 && result.data.success) {
        accountData = result.data.account;
        accountData.accountExists = true;
    } else {
        accountData.accountExists = false;
    }
}

async function logVisit() {
    await apiRequest('/api/visit', 'POST', { page: window.location.pathname });
}

async function loadVisitors() {
    const result = await apiRequest('/api/visitors');
    if (result.status === 200 && result.data.success) {
        visitorData = result.data.visitors.slice().reverse();
    } else {
        visitorData = [];
    }
    displayVisitors();
}

function displayVisitors() {
    const container = document.getElementById('visitorLogContent');
    if (!visitorData.length) {
        container.innerHTML = '<p class="no-account">No visitor data available yet.</p>';
        return;
    }

    const rows = visitorData.map(visitor => `
        <tr>
            <td>${visitor.timestamp}</td>
            <td>${visitor.ip}</td>
            <td>${visitor.path}</td>
            <td>${visitor.userAgent}</td>
            <td>${visitor.referrer || '-'}</td>
        </tr>
    `).join('');

    container.innerHTML = `
        <div class="visitor-table-wrapper">
            <table class="visitor-table">
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>IP</th>
                        <th>Path</th>
                        <th>User Agent</th>
                        <th>Referrer</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}

async function handleCreateAccount(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const age = parseInt(document.getElementById('age').value, 10);
    const gender = document.getElementById('gender').value;
    const address = document.getElementById('address').value.trim();
    const branch = document.getElementById('branch').value;
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const aadhar = document.getElementById('aadhar').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    const userOtp = prompt(`An OTP has been sent to ${email}\nOTP: ${otp}\nEnter the OTP to verify:`);
    if (userOtp !== otp.toString()) {
        showNotification('OTP verification failed!', 'error');
        return;
    }

    const payload = {
        name,
        age,
        gender,
        address,
        branch,
        phone,
        email,
        aadhar,
        password
    };

    const result = await apiRequest('/api/account', 'POST', payload);
    if (result.status !== 200 || !result.data.success) {
        showNotification(result.data.message || 'Unable to create account.', 'error');
        return;
    }

    accountData = result.data.account;
    accountData.accountExists = true;

    showNotification(`Account created successfully! Account Number: ${accountData.account_number}`, 'success');
    event.target.reset();
    displayAccountDetails();
    setTimeout(() => showForm('view-account'), 500);
}

function displayAccountDetails() {
    const detailsDiv = document.getElementById('accountDetails');
    if (!accountData.accountExists) {
        detailsDiv.innerHTML = '<p class="no-account">No account created yet.</p>';
        return;
    }

    detailsDiv.innerHTML = `
        <p><strong>Account Number:</strong> <span>${accountData.account_number}</span></p>
        <p><strong>Name:</strong> <span>${accountData.name}</span></p>
        <p><strong>Age:</strong> <span>${accountData.age}</span></p>
        <p><strong>Gender:</strong> <span>${accountData.gender}</span></p>
        <p><strong>Address:</strong> <span>${accountData.address}</span></p>
        <p><strong>Branch:</strong> <span>${accountData.branch}</span></p>
        <p><strong>Phone:</strong> <span>${accountData.phone}</span></p>
        <p><strong>Email:</strong> <span>${accountData.email}</span></p>
        <p><strong>Aadhar:</strong> <span>${accountData.aadhar}</span></p>
        <p><strong>Balance:</strong> <span>$${parseFloat(accountData.balance).toFixed(2)}</span></p>
    `;
}

function displayBalance() {
    const balanceDiv = document.getElementById('balanceDisplay');
    if (!accountData.accountExists) {
        balanceDiv.innerHTML = '<p class="no-account">No account created yet.</p>';
        return;
    }

    balanceDiv.innerHTML = `
        <h3>Current Account Balance</h3>
        <div class="balance-amount">$${parseFloat(accountData.balance).toFixed(2)}</div>
    `;
}

async function handleEditAccount(event) {
    event.preventDefault();
    if (!accountData.accountExists) {
        showNotification('No account exists. Please create an account first.', 'error');
        return;
    }

    const field = document.getElementById('edit-field').value;
    const value = document.getElementById('edit-value').value.trim();
    if (!field || !value) {
        showNotification('Please select a field and enter a value.', 'error');
        return;
    }

    const result = await apiRequest('/api/account', 'PATCH', { field, value });
    if (result.status !== 200 || !result.data.success) {
        showNotification(result.data.message || 'Unable to update account.', 'error');
        return;
    }

    accountData = result.data.account;
    accountData.accountExists = true;
    showNotification('Account details updated successfully!', 'success');
    event.target.reset();
    document.getElementById('edit-input-container').style.display = 'none';
}

function updateEditField() {
    const field = document.getElementById('edit-field').value;
    const container = document.getElementById('edit-input-container');
    if (!field) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';
    const input = document.getElementById('edit-value');

    if (field === 'gender') {
        input.outerHTML = `
            <select id="edit-value" name="edit-value" required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
            </select>
        `;
    } else if (field === 'branch') {
        input.outerHTML = `
            <select id="edit-value" name="edit-value" required>
                <option value="">Select Branch</option>
                <option value="Downtown">Downtown</option>
                <option value="Midtown">Midtown</option>
                <option value="Uptown">Uptown</option>
                <option value="Airport">Airport</option>
            </select>
        `;
    } else if (field === 'address') {
        input.outerHTML = `<textarea id="edit-value" name="edit-value" rows="3" required></textarea>`;
    } else if (field === 'age' || field === 'phone') {
        input.outerHTML = `<input type="number" id="edit-value" name="edit-value" required>`;
    } else {
        input.outerHTML = `<input type="text" id="edit-value" name="edit-value" required>`;
    }
}

async function handleDeposit(event) {
    event.preventDefault();
    if (!accountData.accountExists) {
        showNotification('No account exists. Please create an account first.', 'error');
        return;
    }

    const amount = parseFloat(document.getElementById('deposit-amount').value);
    if (amount <= 0 || Number.isNaN(amount)) {
        showNotification('Please enter a valid amount.', 'error');
        return;
    }

    const result = await apiRequest('/api/account/deposit', 'POST', { amount });
    if (result.status !== 200 || !result.data.success) {
        showNotification(result.data.message || 'Unable to deposit.', 'error');
        return;
    }

    accountData = result.data.account;
    showNotification(result.data.message, 'success');
    event.target.reset();
}

async function handleWithdraw(event) {
    event.preventDefault();
    if (!accountData.accountExists) {
        showNotification('No account exists. Please create an account first.', 'error');
        return;
    }

    const amount = parseFloat(document.getElementById('withdraw-amount').value);
    if (amount <= 0 || Number.isNaN(amount)) {
        showNotification('Please enter a valid amount.', 'error');
        return;
    }

    const result = await apiRequest('/api/account/withdraw', 'POST', { amount });
    if (result.status !== 200 || !result.data.success) {
        showNotification(result.data.message || 'Unable to withdraw.', 'error');
        return;
    }

    accountData = result.data.account;
    showNotification(result.data.message, 'success');
    event.target.reset();
}

async function handleResetPassword(event) {
    event.preventDefault();
    if (!accountData.accountExists) {
        showNotification('No account exists. Please create an account first.', 'error');
        return;
    }

    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-new-password').value;

    const result = await apiRequest('/api/account/reset-password', 'POST', {
        currentPassword,
        newPassword,
        confirmPassword
    });

    if (result.status !== 200 || !result.data.success) {
        showNotification(result.data.message || 'Unable to reset password.', 'error');
        return;
    }

    accountData = result.data.account;
    showNotification(result.data.message, 'success');
    event.target.reset();
}

async function handleForgotPassword(event) {
    event.preventDefault();
    if (!accountData.accountExists) {
        showNotification('No account exists. Please create an account first.', 'error');
        return;
    }

    const email = document.getElementById('forgot-email').value.trim();
    const otp = document.getElementById('otp').value.trim();
    const newPassword = document.getElementById('new-forgot-password').value;
    const confirmPassword = document.getElementById('confirm-forgot-password').value;

    const result = await apiRequest('/api/account/forgot-password', 'POST', {
        email,
        otp,
        newPassword,
        confirmPassword
    });

    if (result.status !== 200 || !result.data.success) {
        showNotification(result.data.message || 'Unable to reset password.', 'error');
        return;
    }

    accountData = result.data.account;
    showNotification(result.data.message, 'success');
    event.target.reset();
}

async function handleDeleteAccount(event) {
    event.preventDefault();
    if (!accountData.accountExists) {
        showNotification('No account exists.', 'error');
        return;
    }

    const confirmText = document.getElementById('delete-confirm').value;
    if (confirmText.toUpperCase() !== 'DELETE') {
        showNotification('Please type "DELETE" to confirm account deletion.', 'error');
        return;
    }

    const result = await apiRequest('/api/account', 'DELETE');
    if (result.status !== 200 || !result.data.success) {
        showNotification(result.data.message || 'Unable to delete account.', 'error');
        return;
    }

    accountData = {
        name: '',
        age: 0,
        gender: '',
        address: '',
        branch: '',
        phone: 0,
        email: '',
        aadhar: 0,
        password: '',
        account_number: 0,
        balance: 0,
        accountExists: false
    };

    showNotification(result.data.message, 'success');
    event.target.reset();
    setTimeout(() => showForm('create-account'), 500);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        showNotification('Logged out successfully!', 'success');
        setTimeout(() => location.reload(), 500);
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    await loadAccount();
    await logVisit();
    showForm('create-account');
});
