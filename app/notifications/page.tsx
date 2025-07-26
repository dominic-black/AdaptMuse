import { Screen } from "@/components/Screen/Screen";
import { getNotifications } from "@/lib/getNotifications";
import { GlobalNotification } from "@/types/notifications";
import { getServerUser } from "@/utils/getServerUser";
import { redirect } from "next/navigation";
import { Megaphone, Newspaper, Zap } from "lucide-react";

const updateTags = {
  announcement: {
    label: "Announcement",
    icon: <Megaphone className="w-4 h-4" />,
    color: "bg-blue-100 text-blue-800",
  },
  feature: {
    label: "New Feature",
    icon: <Zap className="w-4 h-4" />,
    color: "bg-green-100 text-green-800",
  },
  default: {
    label: "Update",
    icon: <Newspaper className="w-4 h-4" />,
    color: "bg-gray-100 text-gray-800",
  },
};

export default async function NewsAndUpdatesPage() {
  const user = await getServerUser();
  if (!user) {
    redirect("/login");
  }

  const updates = await getNotifications();

  return (
    <Screen heading="Notifications">
      <div className="mx-auto w-full">
        <div className="space-y-8">
          {updates.length > 0 ? (
            updates.map((update: GlobalNotification) => {
              const tag =
                updateTags[update.type as keyof typeof updateTags] ||
                updateTags.default;
              return (
                <article
                  key={update.id}
                  className="bg-white shadow-sm hover:shadow-md border border-gray-200/80 rounded-lg overflow-hidden transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${tag.color}`}
                      >
                        {tag.icon}
                        {tag.label}
                      </span>
                      <p className="text-gray-500 text-sm">
                        {new Date(update.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <h2 className="mb-2 font-bold text-gray-900 text-xl">
                      {update.title}
                    </h2>
                    <div className="text-gray-600 leading-relaxed prose prose-sm">
                      <p>{update.content}</p>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="bg-white px-6 py-24 border-2 border-gray-200 border-dashed rounded-lg text-center">
              <div className="flex justify-center items-center bg-gray-100 mx-auto rounded-full w-12 h-12 text-gray-400">
                <Newspaper className="w-6 h-6" />
              </div>
              <h3 className="mt-4 font-medium text-gray-900 text-lg">
                No Recent Updates
              </h3>
              <p className="mt-1 text-gray-500 text-sm">
                Check back soon for the latest news and announcements.
              </p>
            </div>
          )}
        </div>
      </div>
    </Screen>
  );
}
