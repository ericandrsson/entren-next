import React from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus } from "lucide-react";

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
}) => {
  const [preview, setPreview] = React.useState<string | ArrayBuffer | null>("");

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const reader = new FileReader();
      try {
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(acceptedFiles[0]);
        onImageSelected(acceptedFiles[0]);
      } catch (error) {
        setPreview(null);
      }
    },
    [onImageSelected]
  );

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "image/png": [],
      "image/jpg": [],
      "image/jpeg": [],
      "image/heic": [],
      "image/heif": [],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex items-center justify-between border border-input bg-background px-3 py-2 text-sm ring-offset-background rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="flex items-center gap-2">
        <ImagePlus className="h-5 w-5 text-muted-foreground" />
        <span className="text-muted-foreground">
          {preview ? "Image selected" : "Upload image"}
        </span>
      </div>
      <input {...getInputProps()} className="sr-only" />
      {preview && (
        <img
          src={preview as string}
          alt="Preview"
          className="h-8 w-8 object-cover rounded"
        />
      )}
      {fileRejections.length !== 0 && (
        <p className="text-xs text-destructive">
          Please upload a valid image file (png, jpg, jpeg, heic, or heif)
        </p>
      )}
    </div>
  );
};

export default ImageUploader;
