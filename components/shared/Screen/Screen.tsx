import { ScreenHeader } from "./ScreenHeader";

export const Screen = ({
  children,
  heading,
}: {
  children: React.ReactNode;
  heading: string;
}) => {
  return (
    <main className="flex-1 gap-16 bg-background pl-[100px] min-h-screen font-[family-name:var(--font-inter)]">
      <div className="flex flex-col gap-10 p-10 max-h-screen overflow-scroll">
        <ScreenHeader heading={heading} />
        {children}
      </div>
    </main>
  );
};
