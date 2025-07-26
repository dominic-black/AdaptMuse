import { Cell } from "@/components/Cell/Cell";
import { Screen } from "@/components/Screen/Screen";
import { DropdownInput } from "@/components/DropdownInput/DropdownInput";
import { useAudiences } from "@/providers/AudienceProvider";

export default function BotPage() {
  const { audiences } = useAudiences();

  return (
    <Screen heading="Bot">
      <div>
        <Cell>
          <div>
            <p>Target Audience.</p>
            <DropdownInput
              options={audiences.map((audience) => ({
                value: audience.id,
                label: audience.name,
              }))}
              onChange={() => {}}
              value={audiences[0].id}
            />
          </div>
          <div></div>
        </Cell>
      </div>
    </Screen>
  );
}
