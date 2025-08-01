import { ScreenHeader } from "./ScreenHeader";

export const Screen = ({
  children,
  heading,
}: {
  children: React.ReactNode;
  heading: string;
}) => {
  return (
    <main className="pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(4rem,env(safe-area-inset-top))] lg:pl-[max(100px,env(safe-area-inset-left))] flex-1 gap-16 bg-background lg:pt-0 min-h-[100dvh] font-[family-name:var(--font-inter)]">
      <div className="flex flex-col gap-10 p-4 lg:p-10 h-full overflow-y-auto custom-scrollbar">
        <ScreenHeader heading={heading} />
        {children}
      </div>
    </main>
  );
};
