"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Bell, LogOut } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {formatDistanceToNow} from 'date-fns';

type Notification = {
  _id: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const token = localStorage.getItem("token");
  const config = useMemo(
    () =>
      token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : { withCredentials: true },
    [token]
  );
 
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}notifications`, config);
      setNotifications(response.data);
      setUnreadCount(response.data.filter((n: Notification) => !n.read).length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}notifications/read`,
        null,config
      );
      setUnreadCount(0); 
      fetchNotifications(); 
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleBellClick = () => {
    setIsDropdownOpen((prev) => !prev);
    if (!isDropdownOpen) {
      markAllAsRead();
    }
  };

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-800">
          MyApp
        </Link>
        <div className="flex space-x-4">
          {isAuthenticated ? (
            <>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBellClick}
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                      {unreadCount}
                    </span>
                  )}
                </Button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-2 text-sm text-gray-500">No notifications</p>
                    ) : (
                      notifications.map((notification, index) => (
                        <div
                          key={index}
                          className="p-2 border-b last:border-b-0 hover:bg-gray-50"
                        >
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              {user?.googleId == null && (
                <Link href="/profile">
                  <img
                    src={user?.avatar ? process.env.NEXT_PUBLIC_BASE_URL + user?.avatar : process.env.NEXT_PUBLIC_BASE_URL + 'default'}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                
                </Link>
              )}
              <Button onClick={logout} variant="outline">
                <LogOut className="h-5 w-5" />
              </Button>
              
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}