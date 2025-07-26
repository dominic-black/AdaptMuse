"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, getFirestore } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { app } from "@/firebase-config";
import { Button } from "@/components/Button";
import { Cell } from "@/components/Cell/Cell";
import { Screen } from "@/components/Screen/Screen";
import { Audience } from "@/types/audience";
import Link from "next/link";

export default function AudiencePage() {
  const { user } = useAuth();
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const db = getFirestore(app);
    const audiencesRef = collection(db, "users", user.uid, "audiences");

    const unsubscribe = onSnapshot(
      audiencesRef,
      (snapshot) => {
        const newAudiences = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Audience, "id">),
        }));
        console.log("newAudiences = ", newAudiences);
        setAudiences(newAudiences);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching audiences:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return (
    <Screen heading="Saved audiences">
      <div className="flex flex-row gap-4">
        <div className="flex-1">
          <Cell>
            {loading ? (
              <p>Loading audiences...</p>
            ) : audiences.length > 0 ? (
              <ul className="space-y-2">
                {audiences.map((audience) => (
                  <li key={audience.id}>
                    <Link href={`/audience/${audience.id}`}>
                      <div className="block hover:bg-gray-100 p-4 rounded-lg transition-colors">
                        {audience.name}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col justify-center items-center gap-2">
                <p>You have not created any audiences yet.</p>
                <Button href="/audience/create">Create audience</Button>
              </div>
            )}
          </Cell>
        </div>
        <div className="max-w-[340px]">
          <Cell>
            <div className="flex flex-col gap-4">
              <p className="font-bold text-color-text text-2xl">
                What is an audience?
              </p>
              <p className="text-color-text text-sm">
                An audience is a group of people who share similar interests,
                behaviors, or demographics.
              </p>
              <p className="text-color-text text-sm">
                Content can then be generated or altered to be tailored to
                appeal to the target audience.
              </p>
              <Button href="/audience/create" variant="primary">
                Create audience
              </Button>
            </div>
          </Cell>
        </div>
      </div>
    </Screen>
  );
}
