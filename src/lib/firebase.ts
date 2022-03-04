import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  projectId: import.meta.env.VITE_PROJECT_ID,
};

initializeApp(firebaseConfig);
