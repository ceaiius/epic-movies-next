"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
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
  const [editSuccess, setEditSuccess] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setQuote(postToEdit.quote);
      setIsOpen(true);
    }
    if(editSuccess){
      toast({ title: "Success", description: "Post edited successfully!" });
      setEditSuccess(false);
    }else if(addSuccess){
      toast({ title: "Success", description: "Post added successfully!" });
      setAddSuccess(false);
    }
  }, [postToEdit, editSuccess, addSuccess]);

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
          `${process.env.NEXT_PUBLIC_API_URL}posts/${postToEdit._id}`,
          { title, quote },
          config
        );
        setEditSuccess(true);
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}posts`,
          { title, quote },
          config
        );
        setAddSuccess(true);
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