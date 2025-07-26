import SignupForm from "@/components/SignupForm/SignupForm";
import Image from "next/image";
import Link from "next/link";

export default function Signup() {
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
            Create your account
          </h2>
        </div>
        <SignupForm />
        <p className="mt-2 text-gray-600 text-sm text-center">
          Or
          <Link
            href="/login"
            className="ml-1 font-medium text-primary hover:text-primary/80"
          >
            sign in to your existing account
          </Link>
        </p>
      </div>
    </div>
  );
}
