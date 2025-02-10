"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

type PostCardProps = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function PostCard({ _id, title, description, imageUrl, onEdit, onDelete }: PostCardProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto my-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
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
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="rounded-lg object-cover"
          />
        </div>
      </CardContent>
    </Card>
  );
}