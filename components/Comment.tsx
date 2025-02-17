"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

type CommentProps = {
  _id: string;
};

type Comment = {
  _id: string;
  text: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
};

export default function Comment({ _id }: CommentProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const { isAuthenticated, user } = useAuth();
  const token = localStorage.getItem("token");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedCommentText, setEditedCommentText] = useState("");

  const config = useMemo(
    () =>
      token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : { withCredentials: true },
    [token]
  );

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}comments/${_id}`);
      setComments(response.data);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}comments`,
        { postId: _id, text: newComment },
        config
      );
      setComments((prevComments) => [response.data, ...prevComments]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleCommentDelete = async (id: string) => {
    console.log("Deleting post with ID:", id);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}comments/${id}`, config);
      setComments((prevComments) => prevComments.filter((comment) => comment._id !== id));
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const handleCommentEdit = async (id: string) => {
    setEditingCommentId(id);
    const commentToEdit = comments.find((comment) => comment._id === id);
    if (commentToEdit) {
      setEditedCommentText(commentToEdit.text);
    }
  };

  const handleSaveEdit = async (id: string) => {
    if (!editedCommentText.trim()) return;

    try {
        await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}comments/${id}`,
        { text: editedCommentText },
        config
      );

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === id ? { ...comment, text: editedCommentText } : comment
        )
      );
      
      setEditingCommentId(null);
      setEditedCommentText("");
    } catch (error) {
      console.error("Failed to edit comment:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="mt-4 p-6">
      <h3 className="font-bold mb-2">Comments</h3>
      {comments.map((comment, index) => (
        <div key={index} className="mt-2 p-2 border rounded">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <img
                  src={comment.author.avatar ? process.env.NEXT_PUBLIC_BASE_URL + comment.author.avatar : process.env.NEXT_PUBLIC_BASE_URL + 'uploads/default'}
                  alt={comment.author.name}
                  className="w-6 h-6 rounded-full"
                />
              <p className="font-bold">{comment.author.name}</p>
            </div>

            <div>
              {comment.author._id === user?._id && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleCommentEdit(comment._id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCommentDelete(comment._id)}>
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {editingCommentId === comment._id ? (
            <div className="mt-2 flex gap-2">
              <Input
                value={editedCommentText}
                onChange={(e) => setEditedCommentText(e.target.value)}
              />
              <Button onClick={() => handleSaveEdit(comment._id)}>Save</Button>
            </div>
          ) : (
            <p className="mt-1">{comment.text}</p>
          )}
        </div>
      ))}

      {isAuthenticated && (
        <div className="flex gap-2 mt-4">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <Button onClick={handleAddComment}>Post</Button>
        </div>
      )}
    </div>
  );
}