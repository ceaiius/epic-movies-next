"use client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

type PostCardProps = {
  _id: string;
  title: string;
  author: { _id: string; name: string };
  quote: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function PostCard({ _id, title, quote, author, onEdit, onDelete }: PostCardProps) {
const { user } = useAuth();
  return (
    <Card className="w-full max-w-2xl mx-auto my-4">
      <CardHeader>
        <div className="flex justify-between items-center">
        <CardTitle className="text-[#D91656] font-bold">Author: {author.name}</CardTitle>
        {author._id === user?._id && 
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onEdit(_id)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(_id)}>
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          }
        </div>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle >Movie Title: {title}</CardTitle>
          </div>
        </div>
        <div>
        <CardTitle className="pt-2">Quote: {quote}</CardTitle>
      </div>
      </CardHeader>
      
    </Card>
  );
}