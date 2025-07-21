import { Cell } from "@/components/Cell/Cell";

export default function Home() {
  return (
    <main className="flex-1 gap-16 bg-background overflow-scroll font-[family-name:var(--font-inter)]">
      <div className="flex flex-col gap-10 p-10 max-h-screen overflow-scroll">
        <h1 className="font-bold text-color-text text-4xl">Home</h1>
        <div className="gap-4 grid grid-cols-2">
          <Cell>
            <h2 className="font-bold text-color-text text-2xl">
              Content generation jobs
            </h2>
            <p>All previous and processing jobs.</p>
          </Cell>
          <Cell>
            <h2 className="font-bold text-color-text text-2xl">
              Saved Audiences
            </h2>
          </Cell>
          <Cell>
            <h2 className="font-bold text-color-text text-2xl">Usage</h2>
          </Cell>
          <Cell>
            <h2 className="font-bold text-color-text text-2xl">Usage</h2>
          </Cell>
        </div>
      </div>
    </main>
  );
}
