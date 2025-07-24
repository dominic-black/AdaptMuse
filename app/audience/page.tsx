import { Cell } from "@/components/Cell/Cell";
import { Screen } from "@/components/Screen/Screen";
import Link from "next/link";

export default function AudiencePage() {
  return (
    <Screen heading="Saved audiences">
      <div className="flex flex-row gap-4">
        <div className="flex-1">
          <Cell>
            <div className="flex flex-col justify-center items-center gap-2">
              <p>You have not created any audiences yet.</p>
              <Link
                href="/audience/create"
                className="inline-flex justify-center items-center bg-primary hover:bg-blue-700 disabled:opacity-50 shadow-md px-4 py-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 h-10 font-medium text-white text-sm whitespace-nowrap transition-colors disabled:pointer-events-none"
              >
                Create audience
              </Link>
            </div>
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
              <Link
                href="/audience/create"
                className="inline-flex justify-center items-center bg-primary hover:bg-blue-700 disabled:opacity-50 shadow-md rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 h-10 font-medium text-white text-sm whitespace-nowrap transition-colors disabled:pointer-events-none"
              >
                Create audience
              </Link>
            </div>
          </Cell>
        </div>
      </div>
    </Screen>
  );
}
