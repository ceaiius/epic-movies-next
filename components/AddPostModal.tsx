"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type AddPostModalProps = {
  onPostAdded: () => void;
  postToEdit?: {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
  };
  onClose: () => void;
};


export default function AddPostModal({ onPostAdded, postToEdit, onClose }: AddPostModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setDescription(postToEdit.description);
      setImageUrl(postToEdit.imageUrl);
      setIsOpen(true); // Open the modal when postToEdit is set
    }
  }, [postToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    
    e.preventDefault();
    try {
      if (postToEdit) {
        // Update existing post
        await axios.put(
          `http://localhost:8000/api/posts/${postToEdit._id}`,
          { title, description, imageUrl },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        // Add new post
        await axios.post(
          "http://localhost:8000/api/posts",
          { title, description, imageUrl },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      setIsOpen(false); // Close the modal
      onPostAdded(); // Refresh the posts
      onClose(); // Reset the postToEdit state
    } catch (error) {
      console.error("Failed to save post:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose(); 
      }
      setIsOpen(open);
    }}>
      <DialogTrigger asChild>
        <Button>{postToEdit ? "Edit Post" : "Add Post"}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{postToEdit ? "Edit Post" : "Add a New Post"}</DialogTitle>
          <DialogDescription>
            {postToEdit ? "Update the post details below." : "Fill in the details below to create a new post."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            
            />
          </div>
          <Button type="submit" className="w-full">
            {postToEdit ? "Update Post" : "Add Post"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}