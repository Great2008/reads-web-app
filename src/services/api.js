import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    signInAnonymously, 
    signInWithCustomToken, 
    onAuthStateChanged,
    signOut 
} from 'firebase/auth';
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    onSnapshot, 
} from 'firebase/firestore';

// Global variables provided by the Canvas environment
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Initialize Firebase
let app, auth, db;
let currentUserId = null;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase initialized successfully.");

    // Set up Auth State Listener and initial authentication
    const authenticate = async () => {
        // Sign in using the custom token provided by the environment
        if (initialAuthToken) {
            try {
                await signInWithCustomToken(auth, initialAuthToken);
            } catch (error) {
                console.error("Error signing in with custom token, signing anonymously:", error);
                await signInAnonymously(auth);
            }
        } else {
            // Fallback to anonymous sign-in
            await signInAnonymously(auth);
        }
    };

    // Listen for auth state changes to set the current user ID
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUserId = user.uid;
            console.log("User authenticated. UID:", currentUserId);
        } else {
            currentUserId = null;
            console.log("User signed out.");
        }
    });

    // Run authentication on startup
    authenticate();

} catch (error) {
    console.error("Firebase initialization failed:", error);
    // In case of failure, set up placeholder service
    auth = { 
        currentUser: { uid: 'placeholder-user', displayName: 'Mock User' },
        onAuthStateChanged: (callback) => { 
            callback({ uid: 'placeholder-user' }); 
            return () => {};
        },
        logout: async () => console.log("Mock Logout")
    };
    db = {};
}

// Utility function to get the base path for user-private data
const getUserDocPath = (collectionName, docId) => {
    const userId = auth.currentUser?.uid || currentUserId;
    if (!userId) {
        // This should theoretically not happen if isAuthReady is checked in App.jsx
        throw new Error("Authentication not ready or user is not signed in.");
    }
    // Path: /artifacts/{appId}/users/{userId}/[collectionName]/[docId]
    return `artifacts/${appId}/users/${userId}/${collectionName}/${docId}`;
};

// --- API Service Functions ---
export const api = {
    // Expose auth instance for onAuthStateChanged listener in App.jsx
    auth: {
        onAuthStateChanged: (callback) => onAuthStateChanged(auth, callback),
        // Mocked login/signup, relying on anonymous sign-in for persistence
        login: async (email, password) => ({ user: { uid: auth.currentUser?.uid, email, displayName: "Mock User" } }),
        signup: async (formData) => ({ user: { uid: auth.currentUser?.uid, email: formData.email, displayName: formData.name } }),
        resetPassword: async (email) => console.log(`Mock password reset for ${email}`),
        logout: async () => {
            if (auth && auth.currentUser) {
                await signOut(auth);
            }
        }
    },

    // WALLET (Firestore implementation)
    wallet: {
        // Fetches balance from Firestore
        getBalance: async () => {
            const walletDocRef = doc(db, getUserDocPath('wallet', 'balance'));
            try {
                const docSnap = await getDoc(walletDocRef);
                const balance = docSnap.exists() ? docSnap.data().tokens : 500; // Default to 500 if new
                return { balance };
            } catch (e) {
                console.error("Error fetching balance, defaulting to 500:", e);
                return { balance: 500 };
            }
        },
        // Update balance in Firestore
        updateBalance: async (amount) => {
            const walletDocRef = doc(db, getUserDocPath('wallet', 'balance'));
            await setDoc(walletDocRef, { tokens: amount }, { merge: true });
        }
    },

    // PROFILE (Real Firestore Example)
    profile: {
        // Fetches real-time profile data
        getProfileData: (callback) => {
            const userId = auth.currentUser?.uid || currentUserId;
            if (!userId) return console.log("Cannot fetch profile: User not authenticated.");

            const userDocRef = doc(db, getUserDocPath('profile', 'data'));

            // Set initial mock data if the document doesn't exist
            setDoc(userDocRef, {
                uid: userId,
                name: auth.currentUser?.displayName || 'New User',
                joined: new Date().toISOString(),
                displayId: userId, 
            }, { merge: true }).catch(e => console.error("Error setting initial profile data:", e));

            // Setup real-time listener
            return onSnapshot(userDocRef, (docSnap) => {
                if (docSnap.exists()) {
                    callback(docSnap.data());
                } else {
                    callback(null);
                }
            }, (error) => {
                console.error("Error listening to profile data:", error);
                callback(null);
            });
        }
    }
};