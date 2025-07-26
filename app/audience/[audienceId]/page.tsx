"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { Screen } from "@/components/Screen/Screen";
import { db } from "@/firebase-config";
import { useAuth } from "@/hooks/useAuth";
import { Audience, RecommendedEntity } from "@/types/audience";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Cell } from "@/components/Cell/Cell";

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
            {/* Age Distribution Chart */}
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

            {/* Gender Distribution Chart */}
            <Cell>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    Gender Distribution
                  </h3>
                  <span className="text-gray-500 text-sm">Total Audience</span>
                </div>
                <div className="w-full h-72">
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
          </div>
          <Cell>
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg">
                Recommended Entities
              </h3>
              <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-3">
                {audience.recommendedEntities.map(
                  (entity: RecommendedEntity) => (
                    <div
                      key={entity.id}
                      className="bg-white shadow-sm hover:shadow-md p-4 border border-gray-200 rounded-lg transition-shadow duration-200"
                    >
                      {/* Entity Type Badge */}
                      <div className="flex justify-between items-center mb-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            entity.type === "MOVIE"
                              ? "bg-blue-100 text-blue-800"
                              : entity.type === "PERSON"
                              ? "bg-green-100 text-green-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {entity.type}
                        </span>
                        <span className="text-gray-500 text-xs capitalize">
                          {entity.subText}
                        </span>
                      </div>

                      {/* Entity Name */}
                      <h4 className="mb-2 font-semibold text-gray-900 line-clamp-2">
                        {entity.name}
                      </h4>

                      {/* Popularity Score */}
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1 text-gray-600 text-sm">
                          <span>Popularity</span>
                          <span className="font-medium">
                            {(entity.popularity * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="bg-gray-200 rounded-full w-full h-2">
                          <div
                            className="bg-indigo-600 rounded-full h-2"
                            style={{ width: `${entity.popularity * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Gender Preference */}
                      <div className="mb-3">
                        <p className="mb-1 font-medium text-gray-700 text-xs">
                          Gender Appeal
                        </p>
                        <div className="flex items-center space-x-2 text-xs">
                          <div className="flex items-center">
                            <div
                              className={`w-3 h-3 rounded-full mr-1 ${
                                entity.gender.male > 0
                                  ? "bg-blue-500"
                                  : "bg-gray-300"
                              }`}
                            />
                            <span className="text-gray-600">
                              Male {entity.gender.male > 0 ? "+" : ""}
                              {(entity.gender.male * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div
                              className={`w-3 h-3 rounded-full mr-1 ${
                                entity.gender.female > 0
                                  ? "bg-pink-500"
                                  : "bg-gray-300"
                              }`}
                            />
                            <span className="text-gray-600">
                              Female {entity.gender.female > 0 ? "+" : ""}
                              {(entity.gender.female * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Top Age Groups */}
                      <div>
                        <p className="mb-1 font-medium text-gray-700 text-xs">
                          Top Age Groups
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(entity.age)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 2)
                            .map(([ageGroup, score]) => (
                              <span
                                key={ageGroup}
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                                  score > 0
                                    ? "bg-green-100 text-green-700 font-medium"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {ageGroup.replace("_", " ")}{" "}
                                {score > 0 ? "+" : ""}
                                {(score * 100).toFixed(0)}%
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  )
                )}
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
