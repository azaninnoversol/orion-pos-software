importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyD8pXMIe8zgghQ9ux5q6MalYDhRT8LEoa8",
  authDomain: "orion-pos-9dcd7.firebaseapp.com",
  projectId: "orion-pos-9dcd7",
  messagingSenderId: "450309014173",
  appId: "1:450309014173:web:b95b3c8d3379ef6fc0ca74",
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: `${payload.notification.body}`,
    icon: "/vercel.svg",
  });
});
