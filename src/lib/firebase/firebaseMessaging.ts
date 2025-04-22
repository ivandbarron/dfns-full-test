import * as admin from "firebase-admin";

import serviceAccountJson from "@/../firebase_credentials.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      serviceAccountJson as admin.ServiceAccount
    ),
  });
}

export async function sendPushNotification({
  fcmToken,
  title,
  body,
  data,
}: {
  fcmToken: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}) {
  try {
    const message = {
      token: fcmToken,
      notification: {
        title,
        body,
      },
      data: data || {},
    };

    const response = await admin.messaging().send(message);
    console.log("✅ Notificación enviada con ID:", response);
  } catch (error) {
    console.error("❌ Error enviando notificación:", error);
  }
}
