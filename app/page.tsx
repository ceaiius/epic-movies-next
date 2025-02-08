"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to login if no token is found
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem("token");
    // Redirect to the login page
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">Welcome to the Landing Page</h1>
      <p className="mt-2 text-gray-600">You are authenticated!</p>
      <Button onClick={handleLogout} className="mt-4">
        Logout
      </Button>
    </div>
  );
}