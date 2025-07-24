import { Screen } from "@/components/Screen/Screen";
import { getNotifications } from "@/lib/getNotifications";
import { GlobalNotification } from "@/types/notifications";
import { getServerUser } from "@/utils/getServerUser";
import { redirect } from "next/navigation";

export default async function NotificationsPage() {
  const user = await getServerUser();
  console.log("user = ", user);
  if (!user) {
    redirect("/login");
  }

  const notifications = await getNotifications();
  console.log("notifications = ", notifications);
  return (
    <Screen heading="Notifications">
      <div>
        {notifications.map((notification: GlobalNotification) => (
          <div key={notification.id} className="flex flex-col gap-2">
            <div className="flex flex-col">
              <h3>{notification.title}</h3>
              <p className="text-color-text-secondary">{notification.date}</p>
            </div>
            <p>{notification.content}</p>
          </div>
        ))}
      </div>
    </Screen>
  );
}
