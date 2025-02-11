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
      setIsOpen(true);
    }
  }, [postToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
  
      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {
            withCredentials: true,
          };
  
      if (postToEdit) {
        await axios.put(
          `http://localhost:8000/api/posts/${postToEdit._id}`,
          { title, quote },
          config
        );
      } else {
        await axios.post(
          "http://localhost:8000/api/posts",
          { title, quote },
          config
        );
      }
  
      setIsOpen(false);
      onPostAdded();
      onClose();
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
        <Button className="bg-[#D91656] text-white">{postToEdit ? "Edit Post" : "Add Post"}</Button>
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
   
          <Button type="submit" className="w-full bg-[#D91656] text-white">
            {postToEdit ? "Update Post" : "Add Post"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}