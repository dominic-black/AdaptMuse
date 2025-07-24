import { Cell } from "@/components/Cell/Cell";
import { Screen } from "@/components/Screen/Screen";

export default function AudiencePage() {
  return (
    <Screen heading="Saved audiences">
      <div className="gap-4 grid grid-cols-2">
        <Cell>
          <div>1</div>
        </Cell>
        <Cell>
          <p>What is an audience?</p>
        </Cell>
      </div>
    </Screen>
  );
}
