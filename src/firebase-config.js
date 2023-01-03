import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const apiKey = process.env.REACT_APP_API_KEY;
console.log(apiKey);
const authDomain = process.env.REACT_APP_AUTH_DOMAIN;
console.log(authDomain);
const databaseURL = process.env.REACT_APP_DATABASE_URL;
console.log(databaseURL);
const projectId = process.env.REACT_APP_PROJECT_ID;
console.log(projectId);
const storageBucket = process.env.REACT_APP_STORAGE_BUCKET;
console.log(storageBucket);
const messagingSenderId = process.env.REACT_APP_MESSAGING_SENDER_ID;
console.log(messagingSenderId);
const appId = secrets.REACT_APP_APP_ID;
console.log(appId);
const measurementId = process.env.REACT_APP_MEASUREMENT_ID;
console.log(measurementId);

const firebaseConfig = {
	apiKey: apiKey,
	authDomain: authDomain,
	databaseURL: databaseURL,
	projectId: projectId,
	storageBucket: storageBucket,
	messagingSenderId: messagingSenderId,
	appId: appId,
	measurementId: measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);
