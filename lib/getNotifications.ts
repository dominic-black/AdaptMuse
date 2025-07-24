// lib/getNotifications.ts
import { db } from "@/lib/firebaseAdmin";
import { GlobalNotification } from "@/types/notifications";

export async function getNotifications() {
  const notifications = await db.collection('global_notifications').get();
  return notifications.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // convert Timestamp to ISO string
      date: data.date?.toDate ? data.date.toDate().toISOString() : data.date,
    } as GlobalNotification;
  });
}
