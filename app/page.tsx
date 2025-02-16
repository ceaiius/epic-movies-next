"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import PostCard from "@/components/PostCard";
import AddPostModal from "@/components/AddPostModal";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

type Post = {
  _id: string;
  title: string;
  quote: string;
  author: {
    _id: string;
    name: string;
  };
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { isAuthenticated, isLoading } = useAuth();
  const [postToEdit, setPostToEdit] = useState<Post | undefined>(undefined);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Rename to currentPage for clarity
  const [fetching, setFetching] = useState(false);// Track if there are more posts to load

  const token = localStorage.getItem("token");
  const config = useMemo(
    () =>
      token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : { withCredentials: true },
    [token]
  );

  const fetchPosts = useCallback(async () => {
    if (!hasMore || fetching) return;

    setFetching(true);
    setLoading(true);

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}posts`, {
        params: { page: currentPage },
        ...config,
      });

      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...response.data]);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setFetching(false);
      setLoading(false);
    }
  }, [currentPage, hasMore, config]);

  useEffect(() => {
    // ... authentication check
    if (isAuthenticated && posts.length === 0) {
      fetchPosts();
    }
  }, [isAuthenticated, isLoading, router, fetchPosts, posts.length]);


  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
        if (hasMore && !fetching) {
          setCurrentPage((prevPage) => prevPage + 1); // Increment currentPage
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, fetching]);


  useEffect(() => {
    // This useEffect is now ONLY for fetching when currentPage changes
    if (currentPage > 1) {
      fetchPosts();
    }
  }, [currentPage, fetchPosts]);

  const handleDelete = async (id: string) => {
    console.log("Deleting post with ID:", id);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}posts/${id}`, config);
      setDeleteSuccess(true);
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id)); // Remove the deleted post
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
    if (deleteSuccess) {
      toast({ title: "Success", description: "Post edited successfully!" });
      setDeleteSuccess(false);
    }
  }, [deleteSuccess]);

  return (
    <div className="container mx-auto p-4">
      {isAuthenticated ? (
        <>
          <div className="flex justify-between items-center mb-8">
            <div></div>
            <AddPostModal
              onPostAdded={fetchPosts}
              postToEdit={postToEdit}
              onClose={() => setPostToEdit(undefined)} // Reset the postToEdit state when the modal is closed
            />
          </div>
          <div className="flex flex-col items-center">
            {posts.map((post) => (
              <PostCard
                key={post._id} // Use post._id as the key
                _id={post._id}
                title={post.title}
                author={post.author}
                quote={post.quote}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
            {loading && <p className="text-center my-4">Loading...</p>}
          </div>
        </>
      ) : (
        <p className="text-center">Please login to view the posts</p>
      )}
    </div>
  );
}