import React from "react";
import { Users, Sparkles } from "lucide-react";
import { Cell as UICell } from "@/components/ui/Cell/Cell";
import { EntityCard } from "../EntityCard/EntityCard";
import { Entity } from "@/types/entities";
import { ExplainationToolTip } from "@/components/shared/ExplainationToolTip/ExplainationToolTip";

interface EntitiesSectionProps {
  entities: Entity[];
  recommendedEntities: Entity[];
  isEnhanced: boolean;
}

export const EntitiesSection: React.FC<EntitiesSectionProps> = ({
  entities,
  recommendedEntities,
  isEnhanced,
}) => {
  return (
    <div className="space-y-8">
      {/* Input Entities */}
      <UICell>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    Selected Interests
                  </h3>
                  <ExplainationToolTip label="Input Entities" />
                </div>
                <p className="text-gray-600 text-sm">
                  User-defined interests and preferences
                </p>
              </div>
            </div>
            <span className="bg-green-100 px-3 py-1 rounded-full font-medium text-green-700 text-sm">
              {entities.length}
            </span>
          </div>

          <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
            {entities.map((entity: Entity, index: number) => (
              <EntityCard key={`input-${entity.id}-${index}`} entity={entity} />
            ))}
          </div>
        </div>
      </UICell>

      {/* Recommended Entities */}
      <UICell>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-lg">
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    AI Recommendations
                  </h3>
                  <ExplainationToolTip label="Recommended Entities" />
                </div>
                <p className="text-gray-600 text-sm">
                  {isEnhanced
                    ? "Intelligent recommendations based on cultural insights"
                    : "Algorithmically generated insights"}
                </p>
              </div>
            </div>
            <span className="bg-amber-100 px-3 py-1 rounded-full font-medium text-amber-700 text-sm">
              {recommendedEntities.length}
            </span>
          </div>

          <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
            {recommendedEntities.map((entity: Entity, index: number) => (
              <EntityCard
                key={`recommended-${entity.id}-${index}`}
                entity={entity}
              />
            ))}
          </div>
        </div>
      </UICell>
    </div>
  );
};
