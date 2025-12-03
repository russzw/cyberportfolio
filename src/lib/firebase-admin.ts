
import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let adminApp: App | null = null;

function initializeAdminApp() {
  // If already initialized, do nothing.
  if (getApps().some(app => app?.name === 'firebase-admin-app')) {
    adminApp = getApps().find(app => app?.name === 'firebase-admin-app') || null;
    return;
  }

  // Otherwise, try to initialize.
  try {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!serviceAccount) {
      console.warn('FIREBASE_SERVICE_ACCOUNT is not set. Admin features will be disabled.');
      adminApp = null;
      return;
    }
    
    adminApp = initializeApp({
      credential: cert(JSON.parse(serviceAccount)),
    }, 'firebase-admin-app');

  } catch (e: any) {
    console.error('Firebase Admin SDK initialization error:', e.message);
    adminApp = null;
  }
}

// This function will be the single entry point to get the admin DB.
// It ensures initialization is attempted only when needed.
export function adminDb() {
  if (!adminApp) {
    initializeAdminApp();
  }
  if (!adminApp) {
    return null; // Return null if initialization failed.
  }
  return getFirestore(adminApp);
}
