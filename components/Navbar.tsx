"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-[#D91656]">
          Epic movie quotes
        </Link>
        <div className="flex space-x-4">
          {isAuthenticated ? (
            <div className="flex space-x-4">
              <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
            <Link href="/profile">
                {user?.avatar ? (
                  <img
                    src={'http://localhost:8000/' + user.avatar}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <Button variant="outline">Profile</Button>
                )}
              </Link>
            </div>
            
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-[#D91656]">Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}