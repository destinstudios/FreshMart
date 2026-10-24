// Add your Firebase web-app configuration here. These are public client config values;
// database security must be enforced by Firestore/Storage Rules (see firebase/).
export const firebaseConfig = {
  apiKey: "AIzaSyBAa1M0VDtwLQE_XwYcree5w80wzrf-XlE",
  authDomain: "freshmart-ds.firebaseapp.com",
  projectId: "freshmart-ds",
  storageBucket: "freshmart-ds.firebasestorage.app",
  messagingSenderId: "888173656066",
  appId: "1:888173656066:web:102666ffa434886e134f1b"
};
export const appConfig = {
  adminEmail: "adityasinghzrx@gmail.com", // exact Google account allowed to administer this store
  storeName: "FreshMart",
  storeTagline: "Your Neighbourhood General Store",
  whatsapp: "918840583727", // international format digits only, e.g. 91XXXXXXXXXX
  storeAddress: "",
  latitude: "",
  longitude: "",
  mapsEmbedUrl: "",
  currency: "INR",
  demoMode: true // stays in local demo mode until Firebase config is replaced and demoMode=false
};
export const isFirebaseConfigured = !appConfig.demoMode &&
  firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY" &&
  firebaseConfig.projectId !== "YOUR_PROJECT_ID";
