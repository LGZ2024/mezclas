import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js'
import { getMessaging, getToken, onMessage } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-messaging.js'

const firebaseConfig = {
  apiKey: 'AIzaSyD5Cbg1ITITdgzoV6Uw4kw-AD83qriTsUs',
  authDomain: 'soft-mezcla.firebaseapp.com',
  projectId: 'soft-mezcla',
  storageBucket: 'soft-mezcla.appspot.com',
  messagingSenderId: '987312048941',
  appId: '1:987312048941:web:3b24cb7c856bb48537a1a4',
  measurementId: 'G-D0P70PHSG1'
}

const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

document.getElementById('btnNotificaciones').addEventListener('click', async () => {
  const permiso = await Notification.requestPermission()
  if (permiso !== 'granted') {
    console.warn('Permiso denegado')
    return
  }

  const registration = await navigator.serviceWorker.register('./firebase-messaging-sw.js')
  console.log('✅ SW registrado:', registration.scope)

  try {
    const token = await getToken(messaging, {
      vapidKey: 'BE_tSTGL6FfiAlFMzGSAkF5eiBrYRUnGg6871BTE3oWDbZSoHTtJOdR_JoXC_9NlgC46LYxD0mtZtHQEy0UWIY8',
      serviceWorkerRegistration: registration
    })

    if (token) {
      console.log('🎯 Token FCM:', token)
    } else {
      console.warn('⚠️ No se pudo obtener token')
    }
  } catch (e) {
    console.error('❌ Error al obtener token:', e)
  }

  // Mensajes en primer plano
  onMessage(messaging, payload => {
    console.log('📨 Mensaje recibido en primer plano:', payload)
    new Notification(payload.notification.title, {
      body: payload.notification.body,
      icon: payload.notification.icon || '/icon.png'
    })
  })
})
