import admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

async function resetPassword() {
  try {
    await db.collection('adminConfig').doc('auth').set({ password: 'admin123' }, { merge: true });
    console.log('Password reset to admin123 successful.');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting password:', error);
    process.exit(1);
  }
}

resetPassword();
