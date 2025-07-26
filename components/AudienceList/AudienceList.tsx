import { Audience } from "@/types/audience";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export const AudienceList = ({ audiences }: { audiences: Audience[] }) => {
  return (
    <ul className="space-y-2">
      {audiences.map((audience) => (
        <li key={audience.id}>
          <Link href={`/audience/${audience.id}`}>
            <div className="flex flex-row justify-between items-center hover:bg-gray-100 p-4 rounded-lg transition-colors">
              <div className="flex flex-row items-center gap-2">
                <div className="flex items-center gap-2 rounded-sm w-[30px] h-[30px] overflow-hidden">
                  <Image
                    src="https://cdn-icons-png.flaticon.com/512/1053/1053244.png"
                    alt={audience.name}
                    width={40}
                    height={40}
                  />
                </div>
                <div>{audience.name}</div>
              </div>
              <div>
                <ArrowRight className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};
