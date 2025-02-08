import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAMt5p0ybZ0wJvyo2Vg9iGqIbSjGk-GtDA",
  authDomain: "farmcareai-cf013.firebaseapp.com",
  databaseURL: "https://farmcareai-cf013-default-rtdb.firebaseio.com",
  projectId: "farmcareai-cf013",
  storageBucket: "farmcareai-cf013.firebasestorage.app",
  messagingSenderId: "186608854030",
  appId: "1:186608854030:web:bcdc7d113e95bff30f485f",
  measurementId: "G-02DD1L2Q1D"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getDatabase(app);

// Initialize Analytics only if supported
export const analytics = await isSupported().then(yes => yes ? getAnalytics(app) : null);

// Database references
export const dbRefs = {
  soilTests: 'soil_tests',
  cropRecommendations: 'crop_recommendations',
  diseaseDetections: 'disease_detections',
  treatmentPlans: 'treatment_plans',
  yieldPredictions: 'yield_predictions',
  marketInsights: 'market_insights'
};