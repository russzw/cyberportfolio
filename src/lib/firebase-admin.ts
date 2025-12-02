
import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let adminApp: App | null = null;

function initializeAdminApp() {
  if (getApps().some(app => app?.name === 'firebase-admin-app')) {
     adminApp = getApps().find(app => app?.name === 'firebase-admin-app') || null;
     return;
  }

  try {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!serviceAccount) {
      // Don't throw here, let getAdminDb handle the null case
      console.warn('FIREBASE_SERVICE_ACCOUNT is not set. Admin features will be disabled.');
      return;
    }
    
    adminApp = initializeApp({
      credential: cert(JSON.parse(serviceAccount)),
    }, 'firebase-admin-app');

  } catch (e: any) {
    console.error('Firebase Admin SDK initialization error:', e.message);
    // Don't throw, allow the app to run without admin features
    adminApp = null;
  }
}


function getAdminDb() {
    if (!adminApp) {
        initializeAdminApp();
    }
    if (!adminApp) {
        // Return null if initialization failed
        return null;
    }
    return getFirestore(adminApp);
}

export const adminDb = getAdminDb();
