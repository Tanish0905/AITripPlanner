import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
   apiKey: "AIzaSyCbDHHHAcptjKAAKikgk7ufmACilpiRoZI",
  authDomain: "aitripplanner-78e8d.firebaseapp.com",
  projectId: "aitripplanner-78e8d",
  storageBucket: "aitripplanner-78e8d.firebasestorage.app",
  messagingSenderId: "1081297227198",
  appId: "1:1081297227198:web:7c8bf90c1aea36e8bc7def",
  measurementId: "G-SHJNRPE1FY"
};

let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

export { db };


// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import {getFirestore} from "firebase/firestore"
// // import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCbDHHHAcptjKAAKikgk7ufmACilpiRoZI",
//   authDomain: "aitripplanner-78e8d.firebaseapp.com",
//   projectId: "aitripplanner-78e8d",
//   storageBucket: "aitripplanner-78e8d.firebasestorage.app",
//   messagingSenderId: "1081297227198",
//   appId: "1:1081297227198:web:7c8bf90c1aea36e8bc7def",
//   measurementId: "G-SHJNRPE1FY"
// };

// // Initialize Firebase
// export const app = initializeApp( firebaseConfig );
// export const db =getFirestore(app)
// // const analytics = getAnalytics(app);