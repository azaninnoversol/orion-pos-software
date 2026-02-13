import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getMessaging, isSupported } from "firebase/messaging";
import { getDatabase } from "firebase/database";

export const BASE_URL = "https://restcountries.com/v3.1";
export const BASE_URL_CITIES = "https://countriesnow.space/api/v0.1";
// export const BASE_URL_CITIES = "https://wft-geo-db.p.rapidapi.com/v1/geo/cities";
export const CITY = "https://api.teleport.org/api/cities";

const firebaseConfig = {
  apiKey: "AIzaSyD8pXMIe8zgghQ9ux5q6MalYDhRT8LEoa8",
  authDomain: "orion-pos-9dcd7.firebaseapp.com",
  projectId: "orion-pos-9dcd7",
  storageBucket: "orion-pos-9dcd7.firebasestorage.app",
  messagingSenderId: "450309014173",
  appId: "1:450309014173:web:b95b3c8d3379ef6fc0ca74",
  measurementId: "G-8REXJP3KX7",
  databaseURL: "https://orion-pos-9dcd7-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);

export const messaging = (async () => {
  return (await isSupported()) ? getMessaging(app) : null;
})();

export const dbRealtime = getDatabase(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
