const firebaseConfig = {
  apiKey: "AIzaSyCH9-DnhuYmzhvgWEOaaJW45djtof689FE",
  authDomain: "hawa-jordan.firebaseapp.com",
  projectId: "hawa-jordan",
  storageBucket: "hawa-jordan.firebasestorage.app",
  messagingSenderId: "676019340049",
  appId: "1:676019340049:web:ba595e196de9bdb4d942b0",
  measurementId: "G-MXC4ELQ467"
};

let servicesPromise;

export function isFirebaseConfigured() {
  return Object.values(firebaseConfig).every((value) => value && !value.startsWith("REPLACE_WITH"));
}

export async function getFirebaseServices() {
  if (!isFirebaseConfigured()) {
    return null;
  }

  if (!servicesPromise) {
    servicesPromise = Promise.all([
      import("https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js"),
      import("https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js"),
      import("https://www.gstatic.com/firebasejs/11.3.1/firebase-storage.js"),
      import("https://www.gstatic.com/firebasejs/11.3.1/firebase-functions.js")
    ]).then(([appSdk, authSdk, firestoreSdk, storageSdk, functionsSdk]) => {
      const app = appSdk.getApps().length ? appSdk.getApp() : appSdk.initializeApp(firebaseConfig);
      return {
        app,
        auth: authSdk.getAuth(app),
        db: firestoreSdk.getFirestore(app),
        storage: storageSdk.getStorage(app),
        functions: functionsSdk.getFunctions(app),
        authSdk,
        firestoreSdk,
        storageSdk,
        functionsSdk
      };
    }).catch((error) => {
      servicesPromise = undefined;
      throw error;
    });
  }

  return servicesPromise;
}

export { firebaseConfig };
