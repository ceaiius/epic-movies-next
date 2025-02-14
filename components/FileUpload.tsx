"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function FileUpload({
  onChange,
}: {
  onChange: (file: File | null) => void;
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="avatar" className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <span>
            <Upload className="h-4 w-4 mr-2" />
            Upload Avatar
          </span>
        </Button>
        <Input
          id="avatar"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </Label>
    </div>
  );
}