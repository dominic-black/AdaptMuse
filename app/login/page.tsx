import Image from "next/image";
import LoginForm from "@/components/LoginForm/LoginForm";

export default function Login() {
  return (
    <div className="flex flex-col items-center h-screen">
      <header className="flex flex-row justify-between items-center p-10 w-full">
        <div className="flex flex-row items-center gap-4">
          <Image src="/logo.png" alt="AdaptMuse" width={40} height={40} />
          <h1>AdaptMuse</h1>
        </div>
      </header>
      <main className="flex flex-col justify-center items-center gap-4 bg-background">
        <div className="flex flex-col gap-4 bg-cell-background shadow-lg p-6 rounded-lg">
          <p>Sign in to your account</p>
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
