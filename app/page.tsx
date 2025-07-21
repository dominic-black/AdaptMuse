export default function Home() {
  return (
    <main className="flex-1 gap-16 bg-background overflow-scroll font-[family-name:var(--font-inter)]">
      <div className="flex flex-col gap-10 p-10 max-h-screen overflow-scroll">
        <h1 className="font-bold text-color-text text-4xl">Home</h1>
        <div>
          <p className="text-color-text">Home page content goes here.</p>
        </div>
      </div>
    </main>
  );
}
