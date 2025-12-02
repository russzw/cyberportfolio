import { initializeFirebase } from "@/firebase";

const { firestore: db, firebaseApp: app } = initializeFirebase();

export { app, db };
