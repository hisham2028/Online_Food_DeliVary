// src/services/authService.js
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../firebase/config';
import axios from 'axios';

class AuthService {
  constructor() {
    this.url = import.meta.env.VITE_API_URL || "http://localhost:4000";
  }

  // Google Sign In
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      // Send ID token to backend for verification and JWT issuance
      const payload = {
        idToken,
        provider: 'google'
      };

      const response = await axios.post(`${this.url}/api/user/social-login`, payload);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        return {
          success: true,
          token: response.data.token,
          user: response.data.user
        };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Google Sign In Error:", error);
      throw error;
    }
  }

  // Facebook Sign In
  async signInWithFacebook() {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const idToken = await result.user.getIdToken();

      // Send ID token to backend for verification and JWT issuance
      const payload = {
        idToken,
        provider: 'facebook'
      };

      const response = await axios.post(`${this.url}/api/user/social-login`, payload);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        return {
          success: true,
          token: response.data.token,
          user: response.data.user
        };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Facebook Sign In Error:", error);
      throw error;
    }
  }

  // Sign Out
  async signOut() {
    try {
      await firebaseSignOut(auth);
      localStorage.removeItem("token");
      return { success: true };
    } catch (error) {
      console.error("Sign Out Error:", error);
      throw error;
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
  }

  // Get current user token
  getCurrentToken() {
    return localStorage.getItem("token");
  }
}

export const authService = new AuthService();
export default authService;
