import { firebaseConfig, appConfig, isFirebaseConfigured } from "./firebase-config.js";
export { appConfig, isFirebaseConfigured };
let app, auth, db, storage, googleProvider;
if (isFirebaseConfigured) {
  const [appMod, authMod, fsMod, storageMod] = await Promise.all([
    import("https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js"),
    import("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js"),
    import("https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js")
  ]);
  app = appMod.initializeApp(firebaseConfig);
  auth = authMod.getAuth(app);
  db = fsMod.getFirestore(app);
  storage = storageMod.getStorage(app);
  googleProvider = new authMod.GoogleAuthProvider();
  Object.assign(window, { __fmAuth: auth, __fmDb: db });
}
export { app, auth, db, storage, googleProvider };
