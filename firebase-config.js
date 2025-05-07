// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3POYal7VNbh4s8jKz9IYFtJvffW-M4X4",
  authDomain: "recipeebook-1318d.firebaseapp.com",
  projectId: "recipeebook-1318d",
  storageBucket: "recipeebook-1318d.firebasestorage.app",
  messagingSenderId: "110930401201",
  appId: "1:110930401201:web:c0f704135539edb3d0cf90",
  measurementId: "G-7WZTMMG3P8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();

// Enable offline data persistence
db.enablePersistence()
  .catch(err => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.log('Persistence failed: Multiple tabs open');
    } else if (err.code == 'unimplemented') {
      // The current browser does not support persistence
      console.log('Persistence not supported in this browser');
    }
  });