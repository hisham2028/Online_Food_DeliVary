# Firebase Setup Guide

This guide walks you through creating a Firebase project and enabling Google and Facebook social login for the Food Delivery app.

---

## 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project**.
3. Enter a project name (e.g. `food-delivery-app`) and click **Continue**.
4. You can disable Google Analytics if you do not need it, then click **Create project**.
5. Wait for the project to be created, then click **Continue**.

---

## 2. Register Your Web App

1. In the Firebase Console, open your project and click the **Web** icon (`</>`) on the project overview page.
2. Enter an app nickname (e.g. `food-delivery-web`) and click **Register app**.
3. Firebase will display a `firebaseConfig` object — copy the values, you will need them in step 5.
4. Click **Continue to console**.

---

## 3. Enable Authentication Providers

### Enable Email/Password (optional — already handled by the backend)

1. In the left sidebar go to **Build → Authentication**.
2. Click **Get started** (first time only).
3. Under the **Sign-in method** tab, click **Email/Password**, toggle it **Enabled**, and click **Save**.

### Enable Google Sign-In

1. Still on the **Sign-in method** tab, click **Google**.
2. Toggle it **Enabled**.
3. Enter a **Project support email** (your Google account).
4. Click **Save**.

### Enable Facebook Sign-In

> Facebook login requires a Facebook Developer account and app.

1. Go to [Facebook for Developers](https://developers.facebook.com/) and create an app (type **Consumer** or **None**).
2. In your Facebook app dashboard, add the **Facebook Login** product and go to its **Settings**.
3. In **Valid OAuth Redirect URIs**, add the redirect URI shown in Firebase:
   - Firebase Console → Authentication → Sign-in method → Facebook → copy the **OAuth redirect URI** (looks like `https://<your-project>.firebaseapp.com/__/auth/handler`).
4. Save the Facebook app settings.
5. Back in Firebase Console, click **Facebook** under Sign-in method, toggle **Enabled**, and enter your Facebook **App ID** and **App Secret** (found in the Facebook app's **Settings → Basic** page).
6. Click **Save**.

---

## 4. Add Authorised Domains

1. In Firebase Console → **Authentication → Settings → Authorized domains**.
2. `localhost` is added by default (for local development).
3. When you deploy to production, click **Add domain** and enter your production domain.

---

## 5. Configure Environment Variables

1. In the `frontend/` directory, copy the example file:

   ```bash
   cd frontend
   cp .env.example .env
   ```

2. Open `frontend/.env` and fill in the values from the `firebaseConfig` object you copied in step 2:

   ```env
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789
   VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

   | Variable | Where to find it |
   |---|---|
   | `VITE_FIREBASE_API_KEY` | Firebase project settings → Your apps → SDK setup |
   | `VITE_FIREBASE_AUTH_DOMAIN` | Same location — `authDomain` field |
   | `VITE_FIREBASE_PROJECT_ID` | Same location — `projectId` field |
   | `VITE_FIREBASE_STORAGE_BUCKET` | Same location — `storageBucket` field |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | Same location — `messagingSenderId` field |
   | `VITE_FIREBASE_APP_ID` | Same location — `appId` field |
   | `VITE_FIREBASE_MEASUREMENT_ID` | Same location — `measurementId` field (if Analytics is enabled) |

---

## 6. Start the App

```bash
# Inside the frontend/ directory
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and try the **Sign in with Google** or **Sign in with Facebook** buttons on the Login page.

---

## Troubleshooting

| Problem | Solution |
|---|---|
| "auth/configuration-not-found" | Make sure `VITE_FIREBASE_PROJECT_ID` is correct and the provider is enabled in Firebase Console. |
| "auth/popup-blocked" | Allow popups for `localhost` in your browser settings. |
| "auth/unauthorized-domain" | Add the current domain under Firebase Console → Authentication → Settings → Authorized domains. |
| "auth/account-exists-with-different-credential" | The email is already registered with a different provider. Ask the user to log in with their original method. |
| Facebook login not working | Double-check that the OAuth redirect URI in your Facebook app matches the one in Firebase Console. |

---

## Security Notes

- **Never commit `frontend/.env`** — it is already listed in `.gitignore`.
- Use `frontend/.env.example` (without real credentials) to document required variables.
- In production, set the `VITE_FIREBASE_*` variables in your hosting provider's environment settings instead of using a `.env` file.
