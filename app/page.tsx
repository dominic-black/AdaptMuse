import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div>
      <header className="flex justify-between items-center p-4">
        <div className="flex justify-between items-center gap-2 w-full">
          <div className="flex items-center gap-2">
            <div className="overflow-hidden roudned-md">
              <Image src="/logo.png" alt="logo" width={50} height={50} />
            </div>
            <h1>AdaptMuse</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Link href="/login">Login</Link>
            </Button>
            <Button variant="primary">
              <Link href="/signup">Create Account</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 gap-16 bg-background overflow-scroll font-[family-name:var(--font-inter)]">
        <div className="flex flex-col gap-10 p-10 max-h-screen overflow-scroll">
          <h1 className="font-bold text-color-text text-4xl">Home</h1>
          <div>
            <p className="text-color-text">Home page content goes here.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
