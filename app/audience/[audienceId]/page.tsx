"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";

import { Screen } from "@/components/Screen/Screen";
import { db } from "@/firebase-config";
import { useAuth } from "@/hooks/useAuth";
import { Audience } from "@/types/audience";

export default function AudiencePage() {
  const { audienceId } = useParams();
  const { user } = useAuth();
  const [audience, setAudience] = useState<Audience | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && audienceId) {
      const getAudience = async () => {
        try {
          const docRef = doc(
            db,
            "users",
            user.uid,
            "audiences",
            audienceId as string
          );
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setAudience({ id: docSnap.id, ...docSnap.data() } as Audience);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error getting document:", error);
        } finally {
          setLoading(false);
        }
      };

      getAudience();
    }
  }, [user, audienceId]);

  return (
    <Screen heading={audience ? audience.name : "Audience"}>
      {loading ? (
        <p>Loading...</p>
      ) : audience ? (
        <div>
          {/* Render your audience data here */}
          <pre>{JSON.stringify(audience, null, 2)}</pre>
        </div>
      ) : (
        <p>Audience not found.</p>
      )}
    </Screen>
  );
}
