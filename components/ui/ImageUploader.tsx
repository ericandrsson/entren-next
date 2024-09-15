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

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      maxSize: 1000000,
      accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
    });

  return (
    <div
      {...getRootProps()}
      className="mx-auto flex cursor-pointer flex-col items-center justify-center gap-y-2 rounded-lg border border-foreground p-8 shadow-sm shadow-foreground"
    >
      {preview && (
        <img
          src={preview as string}
          alt="Uploaded image"
          className="max-h-[400px] rounded-lg"
        />
      )}
      <ImagePlus className={`size-40 ${preview ? "hidden" : "block"}`} />
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the image!</p>
      ) : (
        <p>Click here or drag an image to upload it</p>
      )}
      {fileRejections.length !== 0 && (
        <p className="text-red-500">
          Image must be less than 1MB and of type png, jpg, or jpeg
        </p>
      )}
    </div>
  );
};

export default ImageUploader;
