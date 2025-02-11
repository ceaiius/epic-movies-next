"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type AddPostModalProps = {
  onPostAdded: () => void;
  postToEdit?: {
    _id: string;
    title: string;
    quote: string;
  };
  onClose: () => void;
};


export default function AddPostModal({ onPostAdded, postToEdit, onClose }: AddPostModalProps) {
  const [title, setTitle] = useState("");
  const [quote, setQuote] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setQuote(postToEdit.quote);
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
          { title, quote },
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
          { title, quote },
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
            <Label htmlFor="title">Quote</Label>
            <Input
              id="quote"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              required
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