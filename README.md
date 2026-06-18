# Banking System Frontend

A modern, responsive HTML/CSS/JavaScript front-end for your banking system application.

## 📁 Files Created

1. **index.html** - Main HTML file with all forms and UI
2. **style.css** - Comprehensive styling and responsive design
3. **script.js** - JavaScript logic for form handling and validations
4. **banking_system.py** - Your original Python backend (optional to integrate)

## 🚀 How to Use

### Option 1: Quick Start (No Backend)
1. Open `index.html` in your web browser
2. All features work with in-memory data storage
3. Data will reset when you refresh the page

### Option 2: With Python Backend (Advanced)
To use the provided Flask backend:
1. Install dependencies: `pip install -r requirements.txt`
2. Run the server: `python3 backend.py`
3. Open `http://127.0.0.1:5000` in your browser

The app now stores account data in `account_data.json` so data persists between refreshes.
It also records visitor access data in `visitor_log.json` so you can see who accessed the site.

## 💼 Features

### Available Services:
- ✅ **Create Account** - Register new customer accounts with OTP verification
- ✅ **View Account** - Display all account details
- ✅ **Edit Account** - Modify personal information
- ✅ **Deposit Money** - Add funds to account
- ✅ **Withdraw Money** - Withdraw with balance validation
- ✅ **Check Balance** - View current balance
- ✅ **Reset Password** - Change password with current password verification
- ✅ **Forgot Password** - Reset password with OTP verification
- ✅ **Delete Account** - Permanently delete account with confirmation

## 🎨 Design Features

- **Modern UI** - Clean, professional interface with gradient colors
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Dark Mode Ready** - Easy to customize for dark theme
- **Smooth Animations** - Elegant transitions and effects
- **Real-time Notifications** - Toast notifications for user feedback
- **Form Validation** - Client-side validation for all inputs
- **Accessibility** - Semantic HTML and keyboard navigation support

## 🔧 Customization

### Change Color Scheme:
Edit the CSS variables in `style.css` (lines 7-18):
```css
:root {
    --primary-color: #1e3c72;      /* Main blue */
    --secondary-color: #2a5298;    /* Light blue */
    --accent-color: #00d4ff;       /* Cyan */
    --success-color: #27ae60;      /* Green */
    --warning-color: #e74c3c;      /* Red */
    /* ... more colors ... */
}
```

### Add Local Storage:
Currently uses in-memory storage. To save data:
```javascript
// Add to script.js
localStorage.setItem('accountData', JSON.stringify(accountData));
accountData = JSON.parse(localStorage.getItem('accountData'));
```

### Connect to Backend:
Replace API calls with your Python endpoints:
```javascript
// Example: Connect to Python Flask server
fetch('http://localhost:5000/api/create-account', {
    method: 'POST',
    body: JSON.stringify(accountData),
    headers: {'Content-Type': 'application/json'}
})
```

## 📋 Form Fields

### Create Account:
- Full Name, Age, Gender
- Address, Branch, Phone
- Email, Aadhar Number
- Password (with confirmation)

### Edit Account:
- Select field to edit from dropdown
- Update with new value

### Transactions:
- Deposit/Withdraw amount with validation
- Real-time balance updates

### Security:
- OTP verification on account creation
- Password change confirmation
- Forgot password with email verification

## 🛡️ Security Notes

**Current Implementation (Demo):**
- Uses hardcoded OTP "1234" for forgot password
- Passwords stored in memory (not encrypted)

**For Production:**
1. Use secure backend for password storage
2. Implement real OTP via email service
3. Use HTTPS for all communications
4. Implement JWT token authentication
5. Add rate limiting for security attempts
6. Use proper database for data persistence

## 📱 Browser Compatibility

- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Mobile browsers

## 🎯 Integration with Python Backend

Your `banking_system.py` contains the business logic. To integrate:

1. **Convert to Flask/Django API:**
   ```python
   from flask import Flask, request, jsonify
   
   app = Flask(__name__)
   
   @app.route('/api/create-account', methods=['POST'])
   def create_account():
       data = request.json
       # Call your Create_Account() function
       return jsonify({"success": True, "account_number": ...})
   ```

2. **Update JavaScript to call API:**
   ```javascript
   async function handleCreateAccount(event) {
       // ... validation ...
       const response = await fetch('/api/create-account', {
           method: 'POST',
           body: JSON.stringify(accountData)
       });
       // ... handle response ...
   }
   ```

## 📞 Contact & Support

For any issues or customizations, refer to the HTML/CSS/JS structure in each file.

---

**Enjoy your modern banking system interface!** 🏦
