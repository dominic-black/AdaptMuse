"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { Screen } from "@/components/shared/Screen/Screen";
import { db } from "@/firebase/firebase-config";
import { useAuth } from "@/hooks/useAuth";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Cell } from "@/components/ui/Cell/Cell";
import { Audience, QlooEntity } from "@/types/audience";
import { EntityCard } from "@/features/audience/EntityCard/EntityCard";

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

  console.log("audience = ", audience);

  return (
    <Screen heading={audience ? audience.name : "Audience"}>
      {loading ? (
        <p>Loading...</p>
      ) : audience ? (
        <div className="flex flex-col gap-4">
          <div className="gap-6 grid grid-cols-1 lg:grid-cols-2">
            <Cell>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    Age Distribution
                  </h3>
                  <span className="text-gray-500 text-sm">Total Audience</span>
                </div>
                <div className="w-full h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={Object.entries(audience.ageTotals)
                        .sort(([a], [b]) => {
                          // Extract the starting age from ranges like "18-24", "25-34", etc.
                          const getStartingAge = (ageRange: string) => {
                            const match = ageRange.match(/(\d+)/);
                            return match ? parseInt(match[1], 10) : 0;
                          };
                          return getStartingAge(a) - getStartingAge(b);
                        })
                        .map(([key, value]) => ({
                          name: key.replace("_", " ").replace(" and ", "+ "),
                          value,
                          percentage: (
                            (value /
                              Object.values(audience.ageTotals).reduce(
                                (a, b) => a + b,
                                0
                              )) *
                            100
                          ).toFixed(1),
                        }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#f1f5f9"
                        horizontal={true}
                        vertical={false}
                      />
                      <XAxis
                        type="number"
                        domain={[0, "dataMax"]}
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        axisLine={{ stroke: "#e2e8f0" }}
                        tickLine={{ stroke: "#e2e8f0" }}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={80}
                        tick={{ fontSize: 12, fill: "#475569" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          fontSize: "14px",
                        }}
                        formatter={(value, name, props) => [
                          `${value} (${props.payload.percentage}%)`,
                          "Count",
                        ]}
                        labelStyle={{ color: "#374151", fontWeight: "600" }}
                      />
                      <Bar
                        dataKey="value"
                        fill="#4f46e5"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Cell>
            <div className="flex flex-col gap-4">
              <Cell>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      Gender Distribution
                    </h3>
                    <span className="text-gray-500 text-sm">
                      Total Audience
                    </span>
                  </div>
                  <div className="w-full h-36">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={Object.entries(audience.genderTotals).map(
                          ([key, value]) => ({
                            name: key.charAt(0).toUpperCase() + key.slice(1),
                            value,
                            percentage: (
                              (value /
                                Object.values(audience.genderTotals).reduce(
                                  (a, b) => a + b,
                                  0
                                )) *
                              100
                            ).toFixed(1),
                          })
                        )}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#f1f5f9"
                          horizontal={true}
                          vertical={false}
                        />
                        <XAxis
                          type="number"
                          domain={[0, "dataMax"]}
                          tick={{ fontSize: 12, fill: "#64748b" }}
                          axisLine={{ stroke: "#e2e8f0" }}
                          tickLine={{ stroke: "#e2e8f0" }}
                        />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={80}
                          tick={{ fontSize: 12, fill: "#475569" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#ffffff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            fontSize: "14px",
                          }}
                          formatter={(value, name, props) => [
                            `${value} (${props.payload.percentage}%)`,
                            "Count",
                          ]}
                          labelStyle={{ color: "#374151", fontWeight: "600" }}
                        />
                        <Bar
                          dataKey="value"
                          fill="#ec4899"
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Cell>
              <Cell>
                <div className="space-y-4 h-36">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      Demographic tags
                    </h3>
                    {audience.demographics.length > 0 ? (
                      <div className="flex flex-row flex-wrap gap-4 h-28 overflow-y-scroll">
                        {audience.demographics.map((demographic: any) => (
                          <div
                            key={demographic.value}
                            className="flex items-center gap-2"
                          >
                            <div className="bg-gray-100 px-2 py-1 rounded-md text-gray-500 text-sm">
                              {demographic.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex justify-center items-center h-full">
                        <p className="mt-6 text-gray-500 text-sm">
                          No demographics
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Cell>
            </div>
          </div>
          <Cell>
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg">
                Input Entities
              </h3>
              <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-3">
                {audience.entities.map((entity: QlooEntity) => (
                  <EntityCard key={entity.id} entity={entity} />
                ))}
              </div>
            </div>
          </Cell>
          <Cell>
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg">
                Expanded Entities
              </h3>
              <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-3">
                {audience.recommendedEntities.map((entity: QlooEntity) => (
                  <EntityCard key={entity.id} entity={entity} />
                ))}
              </div>
            </div>
          </Cell>
        </div>
      ) : (
        <p>Audience not found.</p>
      )}
    </Screen>
  );
}
