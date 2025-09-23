# 🔐 Google OAuth Setup for Residents - Complete Guide

## Overview
This implementation adds Google Sign-In functionality specifically for **Residents** using OAuth 2.0. Residents can now:
- Sign in with their Google account
- Auto-create accounts using Google profile information
- Link existing accounts to Google
- Bypass traditional username/password authentication

## 🚀 Quick Setup Instructions

### 1. **Google Cloud Console Configuration**

#### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google+ API** and **Google OAuth API**

#### Step 2: Configure OAuth Consent Screen
1. Navigate to **APIs & Services > OAuth consent screen**
2. Choose **External** user type
3. Fill in required information:
   - App name: `Waste Management System`
   - User support email: Your email
   - Developer contact: Your email
4. Add scopes: `email`, `profile`
5. Add test users (during development)

#### Step 3: Create OAuth Credentials
1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth 2.0 Client IDs**
3. Application type: **Web application**
4. Name: `Waste Management Web Client`
5. **Authorized redirect URIs**:
   ```
   http://localhost:2025/auth/google/callback
   ```
6. Save and copy **Client ID** and **Client Secret**

### 2. **Backend Configuration**

#### Update Environment Variables (`backend/.env`):
```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_actual_google_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:2025/auth/google/callback

# Session Configuration
SESSION_SECRET=your_secure_session_secret_here
```

#### Dependencies Installed:
```bash
npm install passport passport-google-oauth20 express-session
```

### 3. **Frontend Configuration**

#### Dependencies Installed:
```bash
npm install @google-cloud/local-auth google-auth-library
```

## 🔧 Implementation Details

### **Backend Implementation**

#### 1. **Updated Resident Model** (`/backend/src/models/users/resident.js`):
```javascript
// New fields added:
googleId: { type: String, unique: true, sparse: true },
profilePicture: { type: String },
emailVerified: { type: Boolean, default: false },
authProvider: { type: String, enum: ['local', 'google'], default: 'local' }

// Made conditional requirements:
username: { required: function() { return !this.googleId; } }
password: { required: function() { return !this.googleId; } }
address: { required: function() { return this.authProvider === 'local'; } }
contactNumber: { required: function() { return this.authProvider === 'local'; } }
```

#### 2. **Passport Configuration** (`/backend/src/config/passport.js`):
- Handles Google OAuth strategy
- Creates new users from Google profile
- Links existing accounts by email
- Manages user serialization/deserialization

#### 3. **OAuth Routes** (`/backend/src/routes/auth/oauth.js`):
- `GET /auth/google` - Initiates Google OAuth
- `GET /auth/google/callback` - Handles OAuth callback
- `GET /auth/user` - Gets authenticated user info
- `POST /auth/logout` - Logs out user

### **Frontend Implementation**

#### 1. **Updated ResidentLogin** (`/front1/src/views/resident/ResidentLogin.js`):
- Added "Continue with Google" button
- Handles OAuth callback parameters
- Processes authentication tokens
- Enhanced error handling

#### 2. **OAuth Success/Error Pages**:
- `/oauth/success` - Handles successful authentication
- `/oauth/error` - Handles authentication failures

## 🔄 OAuth Flow

```
1. User clicks "Continue with Google" button
   ↓
2. Redirects to: http://localhost:2025/auth/google
   ↓
3. Google authentication page opens
   ↓
4. User grants permissions
   ↓
5. Google redirects to: http://localhost:2025/auth/google/callback
   ↓
6. Backend processes authentication:
   - Creates new user OR links existing account
   - Generates JWT token
   ↓
7. Redirects to frontend: http://localhost:3000/oauth/success?token=...&user=...
   ↓
8. Frontend stores token and user data
   ↓
9. Redirects to: /resident/home
```

## 🧪 Testing Instructions

### **Manual Testing Steps**:

1. **Start Backend**: `npm start` in `/backend`
2. **Start Frontend**: `npm start` in `/front1`
3. **Navigate**: Go to `http://localhost:3000/resident`
4. **Test Google Sign-In**: Click "Continue with Google"
5. **Verify**: Check if user is redirected to resident home

### **Test Scenarios**:

#### **New User**:
- Email: `newuser@gmail.com`
- Expected: Creates new resident account with Google data

#### **Existing User**:
- Email: `existing@resident.com` 
- Expected: Links Google account to existing resident

#### **Authentication**:
- Check localStorage for `authToken` and `resident` data
- Verify JWT token is valid

## 🔒 Security Features

### **Authentication Security**:
- ✅ JWT tokens for session management
- ✅ Secure session configuration
- ✅ HTTPS enforcement in production
- ✅ Email verification through Google

### **Authorization Security**:
- ✅ Resident-only Google OAuth (managers/employees use traditional login)
- ✅ Account linking prevents duplicate accounts
- ✅ Profile data validation from Google

### **Data Security**:
- ✅ Secure environment variable storage
- ✅ Password not required for OAuth users
- ✅ Google profile picture URLs
- ✅ Email uniqueness enforcement

## 🚨 Important Notes

### **Production Deployment**:
1. **Update Redirect URIs** in Google Console:
   ```
   https://yourdomain.com/auth/google/callback
   ```

2. **Environment Variables**:
   ```env
   GOOGLE_CLIENT_ID=production_client_id
   GOOGLE_CLIENT_SECRET=production_client_secret
   GOOGLE_CALLBACK_URL=https://yourdomain.com/auth/google/callback
   CLIENT_URL=https://yourdomain.com
   SESSION_SECRET=very_secure_random_string
   NODE_ENV=production
   ```

3. **HTTPS Requirements**:
   - Google OAuth requires HTTPS in production
   - Update session cookies to `secure: true`

### **Resident-Specific Implementation**:
- **Only Residents** can use Google OAuth
- **Managers and Employees** continue using traditional username/password
- **Account Separation** maintained between user types

## ✅ Verification Checklist

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] Client ID and Client Secret obtained
- [ ] Environment variables updated
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Redirect URIs match exactly
- [ ] Test with real Google account
- [ ] Verify JWT token generation
- [ ] Check resident data storage
- [ ] Test account linking
- [ ] Verify error handling

## 🎯 Ready to Use!

Once you complete the Google Cloud Console setup and update the environment variables, the Google OAuth integration will be fully functional for resident authentication!