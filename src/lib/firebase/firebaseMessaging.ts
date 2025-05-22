import * as admin from "firebase-admin";

import serviceAccountJson from "@/lib/auth/firebase_credentials.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      serviceAccountJson as admin.ServiceAccount
    ),
  });
}

export default admin;
