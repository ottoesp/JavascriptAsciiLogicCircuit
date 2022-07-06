const { getLogicDiagram } = require('./LogicGates/main')

// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVUGXcE_eN5b8Jddl1n1rAjnISsXrL0eo",
  authDomain: "textdiagrams.firebaseapp.com",
  projectId: "textdiagrams",
  storageBucket: "textdiagrams.appspot.com",
  messagingSenderId: "531881366628",
  appId: "1:531881366628:web:156d7eb40344b998133b71"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
