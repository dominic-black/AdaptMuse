import Image from "next/image";
import { EntityTag } from "./EntityTag";
import { Entity } from "@/types/entities";

export const EntityCard = ({ entity }: { entity: Entity }) => {
  return (
    <div className="bg-white shadow-sm hover:shadow-md p-4 border border-gray-200 rounded-lg transition-shadow duration-200">
      {/* Entity Type Badge */}
      <div className="flex justify-between items-center mb-3">
        {entity.imageUrl && (
          <div className="flex items-center gap-2 rounded-sm w-[30px] h-[30px] overflow-hidden">
            <Image
              src={entity.imageUrl || ""}
              alt={entity.name}
              width={40}
              height={40}
            />
          </div>
        )}
        <div>
          <EntityTag type={entity.type} />
          <span className="text-gray-500 text-xs capitalize">
            {entity.subText}
          </span>
        </div>
      </div>

      {/* Entity Name */}
      <h4 className="mb-2 font-semibold text-gray-900 line-clamp-2">
        {entity.name}
      </h4>

      {/* Popularity Score */}
      {entity.popularity !== undefined && (
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
      )}

      {/* Gender Preference */}
      {entity.gender && (
        <div className="mb-3">
          <p className="mb-1 font-medium text-gray-700 text-xs">
            Gender Appeal
          </p>
          <div className="flex items-center space-x-2 text-xs">
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-1 ${
                  entity.gender.male > 0 ? "bg-blue-500" : "bg-gray-300"
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
                  entity.gender.female > 0 ? "bg-pink-500" : "bg-gray-300"
                }`}
              />
              <span className="text-gray-600">
                Female {entity.gender.female > 0 ? "+" : ""}
                {(entity.gender.female * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Top Age Groups */}
      {entity.age && (
        <div>
          <p className="mb-1 font-medium text-gray-700 text-xs">
            Top Age Groups
          </p>
          <div className="flex flex-wrap gap-1">
            {Object.entries(entity.age)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .slice(0, 2)
              .map(([ageGroup, score]) => (
                <span
                  key={ageGroup}
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                    (score as number) > 0
                      ? "bg-green-100 text-green-700 font-medium"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {ageGroup.replace("_", " ")}{" "}
                  {(score as number) > 0 ? "+" : ""}
                  {((score as number) * 100).toFixed(0)}%
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
