"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}auth/login`, {
        email,
        password,
      });
      // Call the login function from AuthContext
      login(response.data.token);
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth route
    window.location.href =`${process.env.NEXT_PUBLIC_API_URL}auth/google`;
  };


  return (
    <div className="flex flex-col items-center pt-20 min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <div className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full bg-[#D91656] text-white">
          Login
        </Button>
        <Button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-white mt-4 hover:bg-gray-100 text-gray-700 font-bold py-2 rounded-lg border border-gray-300 flex items-center justify-center gap-2"
        >
          <FcGoogle className="w-5 h-5" />
          <span>Continue with Google</span>
        </Button>
      </form>
    </div>
  );
}