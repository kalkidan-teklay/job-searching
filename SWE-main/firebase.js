// firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('./chatapp-4f052-firebase-adminsdk-k1vl5-faf353b881.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

module.exports = { admin, db };
