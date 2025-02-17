"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import FileUpload from "@/components/FileUpload";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Current password must be at least 6 characters"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ currentPassword: string; newPassword: string }>({
    resolver: zodResolver(passwordSchema),
  });


  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatar(user.avatar || "");
    }
  }, [user]);

  const showToast = (title: string, description: string, type: "default" | "destructive") => {
      toast({
        title,
        description,
        variant: type,
      });
    };

  /** 🟠 Handle Name Update */
  const handleNameUpdate = async () => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}profile/update`,
        { name },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      login(response.data.token);
      showToast("Success", "Name updated successfully!", "default");
    } catch {
      showToast("Error", "Failed to update name.", "destructive");
    } finally {
      setIsLoading(false);
    }
  };

  /** 🟠 Handle Password Change */
  const handlePasswordChange = async (data: { currentPassword: string; newPassword: string }) => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}profile/password`,
        data,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      login(response.data.token);
      showToast("Success", "Password updated successfully!", "default");
    } catch {
      showToast("Error", "Failed to change password.", "destructive");
    } finally {
      setIsLoading(false);
    }
  };

  /** 🟠 Handle Avatar Upload */
  const handleAvatarUpload = async (file: File | null) => {
    if (!file) return;
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}profile/avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAvatar(response.data.avatar);
      login(response.data.token);
      showToast("Success", "Avatar updated successfully!", "default");
    } catch {
      showToast("Error", "Failed to upload avatar.", "destructive");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-around p-10">
        {/* 🟡 Left Section - Name & Avatar */}
        <div className="space-y-4 w-1/4">
          <div>
            <Label htmlFor="name">Name</Label>
            <div className="flex space-x-2 items-center">
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              <Button onClick={handleNameUpdate} disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Name"}
              </Button>
            </div>
          </div>

          <div>
            <Input id="email" value={user?.email || ""} disabled />
          </div>

          <div>
            <Label htmlFor="avatar">Avatar</Label>
            <div className="flex items-center space-x-4">
              <FileUpload onChange={(file) => handleAvatarUpload(file)} />
            </div>
          </div>
        </div>

        {/* 🟡 Right Section - Password Update */}
        <div className="space-y-4 w-1/4">
          <h2 className="text-xl font-bold mb-4">Change Password</h2>
          <form onSubmit={handleSubmit(handlePasswordChange)} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" {...register("currentPassword")} />
              {errors.currentPassword && (
                <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" {...register("newPassword")} />
              {errors.newPassword && (
                <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
