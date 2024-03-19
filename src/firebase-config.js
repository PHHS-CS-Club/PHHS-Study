import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const apiKey = process.env.REACT_APP_API_KEY;
const authDomain = process.env.REACT_APP_AUTH_DOMAIN;
const databaseURL = process.env.REACT_APP_DATABASE_URL;
const projectId = process.env.REACT_APP_PROJECT_ID;
const storageBucket = process.env.REACT_APP_STORAGE_BUCKET;
const messagingSenderId = process.env.REACT_APP_MESSAGING_SENDER_ID;
const appId = process.env.REACT_APP_APP_ID;
const measurementId = process.env.REACT_APP_MEASUREMENT_ID;
const captchaSiteKey = process.env.REACT_APP_CAPTCHA_SITE_KEY;
console.log(captchaSiteKey);
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
export const appCheck = initializeAppCheck(app, {
	provider: new ReCaptchaV3Provider(captchaSiteKey),
	isTokenAutoRefreshEnabled: true,
});
export const database = getDatabase(app);
export const auth = getAuth(app);
