import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadIcon, X } from "lucide-react";
import { useFormContext } from "react-hook-form";

export function PhotoUploadCard() {
  const { setValue, watch } = useFormContext();
  const currentFile = watch("photo") as File | undefined;
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (file: File | undefined) => {
    if (file) {
      setValue("photo", file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemove = () => {
    setValue("photo", undefined);
    setPreview(null);
  };

  return (
    <Card className="w-full mb-8">
      <CardHeader>
        <CardTitle>Foto Barang</CardTitle>
        <CardDescription>Unggah foto barang dengan jelas.</CardDescription>
      </CardHeader>
      <CardContent>
        {!preview ? (
          <label
            htmlFor="dropzone-file"
            className="bg-muted hover:bg-muted/70 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition"
          >
            <UploadIcon className="text-muted-foreground h-10 w-10" />
            <p className="text-muted-foreground mt-2 text-sm">
              <span className="font-semibold">Klik untuk unggah</span> atau
              tarik file ke sini
            </p>
            <p className="text-muted-foreground text-xs">
              PNG, JPG, GIF — Max 2MB
            </p>
            <input
              id="dropzone-file"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0])}
            />
          </label>
        ) : (
          <div className="relative h-64 w-full overflow-hidden rounded-lg border">
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 rounded-full bg-main p-1 shadow transition hover:bg-main/80"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {currentFile && (
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="font-medium">{currentFile.name}</p>
              <p className="text-muted-foreground text-xs">
                {(currentFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
            {preview && (
              <Button
                variant="neutral"
                size="sm"
                onClick={handleRemove}
                className="text-xs"
              >
                Hapus Foto
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
