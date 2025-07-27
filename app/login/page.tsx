import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/features/auth/LoginForm/LoginForm";

export default function Login() {
  return (
    <div className="flex justify-center items-center bg-gray-100 px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="space-y-8 bg-white shadow-lg p-10 border border-gray-200 rounded-xl w-full max-w-md">
        <div>
          <Image
            className="mx-auto w-auto h-12"
            src="/logo.png"
            alt="AdaptMuse Logo"
            width={48}
            height={48}
          />
          <h2 className="mt-6 font-extrabold text-gray-900 text-3xl text-center">
            Sign in to your account
          </h2>
          <p className="mt-2 text-gray-600 text-sm text-center">
            Or
            <Link
              href="/signup"
              className="ml-1 font-medium text-primary hover:text-primary/80"
            >
              create a new account
            </Link>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
