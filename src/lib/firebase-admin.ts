
import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function getServiceAccount() {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccount) {
    // This error should be caught during development if the .env.local file is missing
    // or the variable is not set in the deployment environment.
    throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set.');
  }
  return JSON.parse(serviceAccount);
}

// Initialize the Firebase Admin SDK.
// This block will only run on the server, where process.env.FIREBASE_SERVICE_ACCOUNT is available.
if (!getApps().length) {
  try {
    const serviceAccount = getServiceAccount();
    initializeApp({
      credential: cert(serviceAccount),
    });
  } catch (e: any) {
    console.error('Firebase Admin SDK initialization error:', e.stack);
    // We throw an error here because the app cannot function without a properly initialized Admin SDK.
    // This makes it clear that the environment is not configured correctly.
    throw new Error('Failed to initialize Firebase Admin SDK. Check your service account credentials.');
  }
}

// Export the initialized Firestore instance.
// getApps()[0] is safe to use here because of the initialization block above.
export const adminDb = getFirestore(getApps()[0]);
