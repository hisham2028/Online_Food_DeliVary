import admin from 'firebase-admin';

class FirebaseAdmin {
  constructor() {
    this.initialized = false;
  }

  getPrivateKey() {
    const key = process.env.FIREBASE_PRIVATE_KEY;
    if (!key) {
      return null;
    }
    return key.replace(/\\n/g, '\n');
  }

  initialize() {
    if (this.initialized) {
      return admin.auth();
    }

    if (admin.apps.length > 0) {
      this.initialized = true;
      return admin.auth();
    }

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = this.getPrivateKey();

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('Firebase Admin is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });

    this.initialized = true;
    return admin.auth();
  }

  getAuth() {
    return this.initialize();
  }
}

export default new FirebaseAdmin();