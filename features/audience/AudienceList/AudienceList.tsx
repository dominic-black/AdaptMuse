import { Audience } from "@/types/audience";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export const AudienceList = ({ audiences }: { audiences: Audience[] }) => {
  return (
    <ul className="space-y-4">
      {audiences.map((audience) => (
        <li key={audience.id}>
          <Link href={`/audience/${audience.id}`} className="block">
            <div className="flex justify-between items-center hover:bg-gray-50 p-4 border-2 border-gray-200 hover:border-gray-300 rounded-lg transition-all duration-200 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="flex justify-center items-center bg-gray-100 rounded-full w-10 h-10 overflow-hidden overflow-hidden">
                  <Image
                    src={
                      audience?.imageUrl ||
                      "https://cdn-icons-png.flaticon.com/512/1053/1053244.png"
                    }
                    alt={audience.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{audience.name}</h3>
                  <p className="text-gray-500 text-sm">
                    {audience.entities.length} entities
                  </p>
                </div>
              </div>
              <div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};
