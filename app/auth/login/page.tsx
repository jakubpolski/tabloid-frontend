"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    await signIn("google", {
      callbackUrl: "/", // gdzie przekierować po udanym logowaniu
    });
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-semibold">
          Zaloguj się
        </h1>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 p-3 text-gray-700 hover:bg-gray-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 48 48"
          >
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.3 5.7-6.2 7.4l6.2 4.8C40.1 36.3 44 29.1 44 21c0-1-.1-1.9-.4-2.8z"
            />
            <path
              fill="#FF3D00"
              d="M24 44c6.5 0 12.1-2.1 16.1-5.7l-6.2-4.8C31 35.8 27.7 37 24 37c-7.1 0-13.1-4.6-15.2-10.9l-6.4 5C6.8 38.1 14.9 44 24 44z"
            />
            <path
              fill="#4CAF50"
              d="M8.8 26.1C8.3 24.7 8 23.1 8 21.5S8.3 18.3 8.8 17l-6.4-5C1.5 14.3 1 17.1 1 20c0 2.9.5 5.7 1.4 8.3l6.4-5z"
            />
            <path
              fill="#1976D2"
              d="M24 10c3.4 0 6.4 1.2 8.7 3.6l6.5-6.5C36.1 3.1 30.5 1 24 1 14.9 1 6.8 6.9 3.8 15.9l6.4 5C10.9 14.6 16.9 10 24 10z"
            />
          </svg>
          {loading ? "Ładowanie..." : "Zaloguj przez Google"}
        </button>
      </div>
    </div>
  );
}
