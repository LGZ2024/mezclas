importScripts('https://www.gstatic.com/firebasejs/11.9.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/11.9.1/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'AIzaSyD5Cbg1ITITdgzoV6Uw4kw-AD83qriTsUs',
  authDomain: 'soft-mezcla.firebaseapp.com',
  projectId: 'soft-mezcla',
  storageBucket: 'soft-mezcla.appspot.com',
  messagingSenderId: '987312048941',
  appId: '1:987312048941:web:3b24cb7c856bb48537a1a4',
  measurementId: 'G-D0P70PHSG1'
})

const messaging = firebase.messaging()
