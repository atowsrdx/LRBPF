import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

async function resetPassword() {
  const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

  await setDoc(doc(db, 'adminConfig', 'auth'), { password: 'admin123' }, { merge: true });
  console.log("SUCCESSFULLY RESET PASSWORD TO admin123");
  process.exit(0);
}

resetPassword().catch(console.error);
