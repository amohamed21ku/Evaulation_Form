# Employee Self-Evaluation & Contribution Assessment System

A production-ready web application for employee self-evaluation with comprehensive admin analytics dashboard.

## Features

### Employee Experience
- **Progressive Multi-Step Form**: 10 carefully designed sections with smooth navigation
- **Auto-Save Functionality**: Progress automatically saved to browser localStorage
- **Psychologically Informed Design**: Non-threatening, growth-oriented questions
- **Interactive Components**: Sliders, radio buttons, conditional questions
- **Mobile Responsive**: Works seamlessly on desktop and mobile devices
- **Estimated Completion Time**: 7-10 minutes

### Admin Dashboard
- **Comprehensive Metrics**: Total responses, average performance scores, commitment levels
- **Visual Analytics**: Bar charts, scatter plots for data visualization
- **Smart Filtering**: Filter by department, salary alignment, engagement level
- **Employee Flags**: Automatic identification of high contributors, low engagement, etc.
- **Export Capabilities**: Export to Excel (all data) or PDF (individual summaries)
- **Detailed Employee View**: Modal with complete evaluation details

## Tech Stack

- **Frontend**: React 18 with Vite
- **Routing**: React Router v6
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Charts**: Recharts
- **Export**: XLSX (Excel), jsPDF (PDF)
- **Styling**: CSS with CSS Variables

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

The Firebase configuration is already set up in `src/firebase/config.js`. However, you need to:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `self-evaulation`
3. Enable **Firestore Database**:
   - Go to Firestore Database
   - Click "Create database"
   - Start in **production mode**
   - Choose your region
4. Enable **Authentication**:
   - Go to Authentication
   - Click "Get started"
   - Enable "Email/Password" sign-in method
   - Add an admin user manually through the Firebase Console

### 3. Firestore Security Rules

Set these rules in Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to write evaluations (employee submissions)
    match /evaluations/{document} {
      allow write: if true;
      allow read: if request.auth != null;
    }
  }
}
```

### 4. Create Admin User

In Firebase Console:
1. Go to Authentication > Users
2. Click "Add user"
3. Enter admin email and password
4. This account will be used to access the admin dashboard

### 5. Run the Application

```bash
npm run dev
```

The application will start on `http://localhost:3000`

## Application Routes

- `/` - Employee Self-Evaluation Form
- `/admin/login` - Admin Login Page
- `/admin/dashboard` - Admin Analytics Dashboard (protected)

## How to Use

### For Employees

1. Navigate to the home page (`/`)
2. Complete the evaluation form (10 sections)
3. Progress is auto-saved in your browser
4. Submit when complete

### For Admins

1. Navigate to `/admin/login`
2. Login with your Firebase credentials
3. View comprehensive dashboard with:
   - Overall metrics
   - Performance charts
   - Employee list with filters
   - Individual employee details
   - Export capabilities

## Key Features Explained

### Employee Form Sections

1. **Employee Information**: Basic identification
2. **Role Awareness**: Understanding of responsibilities
3. **Past Performance**: Last 3 months evaluation
4. **Current Performance**: Current state with visual comparison
5. **Contribution vs Salary**: Self-assessment of value provided
6. **Company Impact**: Areas of impact and clarity
7. **Team Evaluation**: Team performance and relative contribution
8. **Barriers to Performance**: Obstacles and support needed
9. **Future Performance**: Commitments for next 3 months
10. **Identity & Closing**: Engagement level and final thoughts

### Admin Dashboard Features

**Metrics Cards**:
- Total responses
- Average past performance
- Average current performance
- Average commitment level

**Visualizations**:
- Salary vs Contribution bar chart
- Performance scatter plot (Past vs Current)

**Employee Flags**:
- ⚠ Low contribution
- ⭐ High contributor
- 🔺 High potential
- 🔻 Low engagement

**Filters**:
- Search by name, role, or department
- Filter by department
- Filter by salary alignment
- Filter by engagement level

**Export Options**:
- Excel: Export all filtered evaluations
- PDF: Export individual employee summary

## Design Principles

### Psychological Safety
- No judgmental language
- Forward-looking focus
- Neutral framing for sensitive questions
- Optional fields where appropriate
- Growth-oriented micro-copy

### User Experience
- One section at a time (reduced cognitive load)
- Progress indicator
- Auto-save (no data loss)
- Visual feedback (sliders, comparisons)
- Mobile-first responsive design

### Admin Insights
- Actionable metrics
- Visual data representation
- Easy filtering and search
- Quick identification of key patterns
- Export for deeper analysis

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Security Considerations

1. Admin routes are protected with Firebase Authentication
2. Firestore rules ensure only authenticated admins can read evaluations
3. Employee submissions are write-only (they can't read others' data)
4. Passwords are handled by Firebase (never stored in code)

## Future Enhancements (Optional)

- Email notifications to admins on new submissions
- Department-level analytics
- Historical comparison over multiple evaluation periods
- Anonymous submission option
- Multi-language support
- Advanced filtering and sorting
- Custom evaluation templates

## Troubleshooting

### Common Issues

1. **"Error loading evaluations"**
   - Ensure Firestore is enabled in Firebase Console
   - Check Firestore security rules
   - Verify Firebase config in `src/firebase/config.js`

2. **Admin login fails**
   - Ensure Authentication is enabled in Firebase Console
   - Verify admin user exists in Firebase Authentication
   - Check credentials

3. **Auto-save not working**
   - Check browser localStorage is enabled
   - Check browser console for errors

4. **Charts not displaying**
   - Ensure evaluations exist in database
   - Check browser console for errors
   - Verify Recharts is installed

## Support

For issues or questions:
1. Check Firebase Console for configuration
2. Check browser console for errors
3. Verify all dependencies are installed
4. Ensure Firebase project has Firestore and Auth enabled

## License

Proprietary - Internal Company Use Only
