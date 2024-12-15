import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
    credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
}

const adminApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(adminApp);
export const firebaseFirestore = getFirestore(adminApp);