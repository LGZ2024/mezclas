// public/app/notificaciones/firebase-config.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js'
import { getMessaging, getToken, onMessage } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js'

const firebaseConfig = {
  apiKey: 'TU_API_KEY',
  authDomain: 'TU_PROJECT.firebaseapp.com',
  projectId: 'TU_PROJECT_ID',
  storageBucket: 'TU_PROJECT.appspot.com',
  messagingSenderId: 'TU_SENDER_ID',
  appId: 'TU_APP_ID'
}

const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

export { messaging, getToken, onMessage }
