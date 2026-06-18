// Account data storage (in-memory for this demo, could use localStorage or backend)
let accountData = {
    name: "",
    age: 0,
    gender: "",
    address: "",
    branch: "",
    phone: 0,
    email: "",
    aadhar: 0,
    password: 0,
    account_number: 0,
    balance: 0,
    accountExists: false
};

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification active ${type}`;
    
    setTimeout(() => {
        notification.classList.remove('active');
    }, 3000);
}

// Show form based on id
function showForm(formId) {
    // Hide all forms
    const forms = document.querySelectorAll('.form-container');
    forms.forEach(form => form.classList.remove('active'));
    
    // Show selected form
    const selectedForm = document.getElementById(formId);
    if (selectedForm) {
        selectedForm.classList.add('active');
    }
    
    // Update menu buttons
    const menuBtns = document.querySelectorAll('.menu-btn');
    menuBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Refresh account details if viewing
    if (formId === 'view-account') {
        displayAccountDetails();
    }
    
    // Refresh balance if checking
    if (formId === 'check-balance') {
        displayBalance();
    }
}

// Handle Create Account
function handleCreateAccount(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const address = document.getElementById('address').value;
    const branch = document.getElementById('branch').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const aadhar = document.getElementById('aadhar').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validate password match
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    // Simulate OTP verification
    const otp = Math.floor(1000 + Math.random() * 9000);
    const userOtp = prompt(`An OTP has been sent to ${email}\nOTP: ${otp}\nEnter the OTP to verify:`);
    
    if (userOtp !== otp.toString()) {
        showNotification('OTP verification failed!', 'error');
        return;
    }
    
    // Store account data
    accountData = {
        name,
        age,
        gender,
        address,
        branch,
        phone: parseInt(phone),
        email,
        aadhar: parseInt(aadhar),
        password,
        account_number: Math.floor(1000000000 + Math.random() * 9000000000),
        balance: 0,
        accountExists: true
    };
    
    // Show success message with account details
    showNotification(`Account created successfully! Account Number: ${accountData.account_number}`, 'success');
    
    // Reset form
    event.target.reset();
    
    // Show view account
    setTimeout(() => {
        showForm('view-account');
    }, 1000);
}

// Display account details
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
        <p><strong>Balance:</strong> <span>$${accountData.balance.toFixed(2)}</span></p>
    `;
}

// Display balance
function displayBalance() {
    const balanceDiv = document.getElementById('balanceDisplay');
    
    if (!accountData.accountExists) {
        balanceDiv.innerHTML = '<p class="no-account">No account created yet.</p>';
        return;
    }
    
    balanceDiv.innerHTML = `
        <h3>Current Account Balance</h3>
        <div class="balance-amount">$${accountData.balance.toFixed(2)}</div>
    `;
}

// Handle Edit Account
function handleEditAccount(event) {
    event.preventDefault();
    
    if (!accountData.accountExists) {
        showNotification('No account exists. Please create an account first.', 'error');
        return;
    }
    
    const field = document.getElementById('edit-field').value;
    const value = document.getElementById('edit-value').value;
    
    if (!field || !value) {
        showNotification('Please select a field and enter a value.', 'error');
        return;
    }
    
    // Update the field
    if (field === 'age') {
        accountData[field] = parseInt(value);
    } else if (field === 'phone') {
        accountData[field] = parseInt(value);
    } else {
        accountData[field] = value;
    }
    
    showNotification('Account details updated successfully!', 'success');
    event.target.reset();
    document.getElementById('edit-input-container').style.display = 'none';
}

// Update edit field input
function updateEditField() {
    const field = document.getElementById('edit-field').value;
    const container = document.getElementById('edit-input-container');
    const input = document.getElementById('edit-value');
    
    if (field) {
        container.style.display = 'block';
        
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
            input.type = 'number';
            input.placeholder = `New ${field}`;
        } else {
            input.type = 'text';
            input.placeholder = `New ${field}`;
        }
    } else {
        container.style.display = 'none';
    }
}

// Handle Deposit
function handleDeposit(event) {
    event.preventDefault();
    
    if (!accountData.accountExists) {
        showNotification('No account exists. Please create an account first.', 'error');
        return;
    }
    
    const amount = parseFloat(document.getElementById('deposit-amount').value);
    
    if (amount <= 0) {
        showNotification('Please enter a valid amount.', 'error');
        return;
    }
    
    accountData.balance += amount;
    showNotification(`Deposited $${amount.toFixed(2)} successfully! New Balance: $${accountData.balance.toFixed(2)}`, 'success');
    event.target.reset();
}

// Handle Withdraw
function handleWithdraw(event) {
    event.preventDefault();
    
    if (!accountData.accountExists) {
        showNotification('No account exists. Please create an account first.', 'error');
        return;
    }
    
    const amount = parseFloat(document.getElementById('withdraw-amount').value);
    
    if (amount <= 0) {
        showNotification('Please enter a valid amount.', 'error');
        return;
    }
    
    if (amount > accountData.balance) {
        showNotification(`Insufficient balance! Your balance is $${accountData.balance.toFixed(2)}`, 'error');
        return;
    }
    
    accountData.balance -= amount;
    showNotification(`Withdrew $${amount.toFixed(2)} successfully! New Balance: $${accountData.balance.toFixed(2)}`, 'success');
    event.target.reset();
}

// Handle Reset Password
function handleResetPassword(event) {
    event.preventDefault();
    
    if (!accountData.accountExists) {
        showNotification('No account exists. Please create an account first.', 'error');
        return;
    }
    
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-new-password').value;
    
    if (currentPassword !== accountData.password) {
        showNotification('Current password is incorrect!', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match!', 'error');
        return;
    }
    
    if (newPassword === currentPassword) {
        showNotification('New password must be different from current password!', 'error');
        return;
    }
    
    accountData.password = newPassword;
    showNotification('Password updated successfully!', 'success');
    event.target.reset();
}

// Handle Forgot Password
function handleForgotPassword(event) {
    event.preventDefault();
    
    if (!accountData.accountExists) {
        showNotification('No account exists. Please create an account first.', 'error');
        return;
    }
    
    const email = document.getElementById('forgot-email').value;
    const otp = document.getElementById('otp').value;
    const newPassword = document.getElementById('new-forgot-password').value;
    const confirmPassword = document.getElementById('confirm-forgot-password').value;
    
    if (email !== accountData.email) {
        showNotification('Email does not match registered email!', 'error');
        return;
    }
    
    // In a real app, verify OTP from backend
    if (otp !== '1234') { // Demo OTP
        showNotification('Invalid OTP!', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    accountData.password = newPassword;
    showNotification('Password reset successfully!', 'success');
    event.target.reset();
}

// Handle Delete Account
function handleDeleteAccount(event) {
    event.preventDefault();
    
    if (!accountData.accountExists) {
        showNotification('No account exists!', 'error');
        return;
    }
    
    const confirmText = document.getElementById('delete-confirm').value;
    
    if (confirmText.toUpperCase() !== 'DELETE') {
        showNotification('Please type "DELETE" to confirm account deletion.', 'error');
        return;
    }
    
    // Reset account data
    accountData = {
        name: "",
        age: 0,
        gender: "",
        address: "",
        branch: "",
        phone: 0,
        email: "",
        aadhar: 0,
        password: 0,
        account_number: 0,
        balance: 0,
        accountExists: false
    };
    
    showNotification('Account deleted successfully!', 'success');
    event.target.reset();
    
    setTimeout(() => {
        showForm('create-account');
    }, 1000);
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        accountData = {
            name: "",
            age: 0,
            gender: "",
            address: "",
            branch: "",
            phone: 0,
            email: "",
            aadhar: 0,
            password: 0,
            account_number: 0,
            balance: 0,
            accountExists: false
        };
        showNotification('Logged out successfully!', 'success');
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    showForm('create-account');
});
