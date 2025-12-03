
import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let adminApp: App | null = null;
let db: ReturnType<typeof getFirestore> | null = null;

function initializeAdminApp() {
  // If already initialized, do nothing.
  if (getApps().some(app => app?.name === 'firebase-admin-app')) {
    if (!adminApp) {
      adminApp = getApps().find(app => app?.name === 'firebase-admin-app') || null;
      if (adminApp) {
        db = getFirestore(adminApp);
      }
    }
    return;
  }

  // Otherwise, try to initialize.
  try {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!serviceAccount) {
      // Don't warn here, will be handled in adminDb()
      return;
    }
    
    const app = initializeApp({
      credential: cert(JSON.parse(serviceAccount)),
    }, 'firebase-admin-app');

    adminApp = app;
    db = getFirestore(app);

  } catch (e: any) {
    console.error('Firebase Admin SDK initialization error:', e.message);
    adminApp = null;
    db = null;
  }
}

// This function will be the single entry point to get the admin DB.
// It ensures initialization is attempted only when needed.
export function adminDb() {
  if (!adminApp) {
    initializeAdminApp();
  }
  return db;
}
