# Quick Setup Guide

## Firebase Setup (REQUIRED)

### Step 1: Enable Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **self-evaulation**
3. Click on **Firestore Database** in the left menu
4. Click **Create database**
5. Choose **Start in production mode**
6. Select your preferred region
7. Click **Enable**

### Step 2: Set Firestore Security Rules

1. In Firestore Database, go to the **Rules** tab
2. Replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /evaluations/{document} {
      allow write: if true;
      allow read: if request.auth != null;
    }
  }
}
```

3. Click **Publish**

### Step 3: Enable Authentication

1. Click on **Authentication** in the left menu
2. Click **Get started**
3. Click on **Email/Password** under Sign-in method
4. Toggle **Enable** to ON
5. Click **Save**

### Step 4: Create Admin User

1. In Authentication, go to the **Users** tab
2. Click **Add user**
3. Enter:
   - Email: `admin@yourcompany.com` (or your preferred email)
   - Password: `your-secure-password` (min 6 characters)
4. Click **Add user**
5. **IMPORTANT**: Save these credentials - you'll need them to login!

## Run the Application

1. Open terminal in the project directory
2. Run:

```bash
npm run dev
```

3. Open browser to: `http://localhost:3000`

## Test the Application

### Test Employee Form

1. Go to `http://localhost:3000`
2. Fill out the employee evaluation form
3. Progress is auto-saved as you go
4. Submit the evaluation

### Test Admin Dashboard

1. Go to `http://localhost:3000/admin/login`
2. Login with the admin credentials you created
3. View the dashboard with metrics and charts
4. Click "View" on any employee to see details
5. Try exporting to Excel or PDF

## Default Structure

```
/                          → Employee Evaluation Form
/admin/login              → Admin Login
/admin/dashboard          → Admin Dashboard (protected)
```

## Troubleshooting

### "Error loading evaluations"
- Ensure Firestore is enabled
- Check security rules are published

### "Failed to login"
- Ensure Authentication is enabled
- Verify admin user exists in Firebase Console
- Check email/password are correct

### Dependencies errors
Run: `npm install` again

## Quick Firebase Console Links

- Firebase Console: https://console.firebase.google.com/
- Your Project: https://console.firebase.google.com/project/self-evaulation
- Firestore: https://console.firebase.google.com/project/self-evaulation/firestore
- Authentication: https://console.firebase.google.com/project/self-evaulation/authentication

## Admin Credentials Template

Save your admin credentials here:

```
Email: _____________________
Password: _____________________
```

## Next Steps

1. ✅ Enable Firestore Database
2. ✅ Set Firestore Security Rules
3. ✅ Enable Email/Password Authentication
4. ✅ Create Admin User
5. ✅ Run `npm run dev`
6. ✅ Test employee form at `/`
7. ✅ Test admin login at `/admin/login`
8. ✅ Test admin dashboard features

## Support

If you encounter issues:
1. Check the Firebase Console for errors
2. Check browser console (F12) for error messages
3. Verify all setup steps were completed
4. Ensure you're using a modern browser (Chrome, Firefox, Safari, Edge)
