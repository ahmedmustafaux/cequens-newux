# Clear Auth State Instructions

## Problem
If you're being redirected to onboarding without signing in, it means there's cached authentication data in localStorage that doesn't match a real user in the database.

## Solution: Clear Auth State

### Method 1: Browser Console (Easiest)
1. Open your browser's Developer Console (F12 or Cmd+Option+I)
2. Type this command:
```javascript
clearAuth()
```
3. Press Enter
4. Refresh the page (F5 or Cmd+R)

### Method 2: Clear localStorage Manually
1. Open your browser's Developer Console (F12)
2. Go to the "Application" or "Storage" tab
3. Find "Local Storage" → your domain (localhost:3000)
4. Delete these keys:
   - `isAuthenticated`
   - `userEmail`
   - `userName`
   - `userType`
   - `userId`
   - `onboardingCompleted`
5. Refresh the page

### Method 3: Clear All Site Data
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

## After Clearing

You should now be able to:
1. Go to `/signup` - Create a new account
2. Complete email confirmation - User created in database
3. Go to `/login` - Sign in with your credentials
4. Complete onboarding - Mark as complete in database
5. Access dashboard - Should stay on dashboard

## New Flow

The app now validates users against the database, so:
- Cached auth without a database user = redirects to login
- Valid database user with incomplete onboarding = redirects to onboarding
- Valid database user with completed onboarding = stays on dashboard

