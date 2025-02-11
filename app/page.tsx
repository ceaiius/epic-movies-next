"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import PostCard from "@/components/PostCard";
import AddPostModal from "@/components/AddPostModal";

type Post = {
  _id: string;
  title: string;
  quote: string;
  author: {
    _id: string;
  };
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { isAuthenticated } = useAuth();
  const [postToEdit, setPostToEdit] = useState<Post | undefined>(undefined);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const handleDelete = async (id: string) => {
    console.log("Deleting post with ID:", id); // Add this line
    try {
      await axios.delete(`http://localhost:8000/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchPosts(); // Refresh the posts
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const handleEdit = (id: string) => {
    const postToEdit = posts.find((post) => post._id === id);
    if (postToEdit) {
      setPostToEdit(postToEdit);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);


  return (
    <div className="container mx-auto p-4">
      {isAuthenticated ? 
      <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold pt-6">News Feed</h1>
        <AddPostModal
          onPostAdded={fetchPosts}
          postToEdit={postToEdit}
          onClose={() => setPostToEdit(undefined)} // Reset the postToEdit state when the modal is closed
        />
      </div><div className="flex flex-col items-center">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              _id={post._id}
              title={post.title}
              author={post.author}
              quote={post.quote}
              onEdit={handleEdit}
              onDelete={handleDelete} />
          ))}
        </div>
      </> : <p className="text-center">Please login to view the posts</p>}
    </div>
  );
}