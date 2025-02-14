"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import FileUpload from "@/components/FileUpload";
import { toast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [isLoading, setIsLoading] = useState(false);
  const [avatarSuccess, setAvatarSuccess] = useState(false);

  useEffect(() => {
    if (avatarSuccess) {
      toast({ title: "Success", description: "Avatar updated successfully!" });
      setAvatarSuccess(false);
    }
  }, [avatarSuccess]);


  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatar(user.avatar || "");
    }
  }, [user]);

  const handleNameUpdate = async () => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        "http://localhost:8000/api/profile/update",
        { name },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      login(response.data.token);
    } catch (error) {
      console.error("Failed to update name:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File | null) => {
    if (!file) return;
  
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("avatar", file);
  
      const response = await axios.post(
        "http://localhost:8000/api/profile/avatar",
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
    } catch (error) {
      console.error("Failed to upload avatar:", error);
    } finally {
      setIsLoading(false);
      setAvatarSuccess(true);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="space-y-4 w-1/4">
        <div>
          <Label htmlFor="name">Name</Label>
          <div className="flex space-x-2 items-center">
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            onClick={handleNameUpdate}
            disabled={isLoading}
          >
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
          <h2>asdd</h2>
        </div>
      </div>
    </div>
  );
}