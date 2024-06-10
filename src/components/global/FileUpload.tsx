"use client";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { UploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";

type Props = {
  apiEndpoint: "agencyLogo" | "subAccountLogo" | "avatar" | "media";
  onChange: (url?: string) => void;
  value?: string;
};

const FileUpload = ({ apiEndpoint, onChange, value }: Props) => {
  const type = value?.split(".").pop();
  if (value) {
    return (
      <div className="flex flex-col justify-center items-center">
        {type !== "pdf" ? (
          <div className="relative w-40 h-40">
            <Image
              src={value}
              alt="uploaded image"
              className="object-contain"
              fill
            />
          </div>
        ) : (
          <div>
            <FileIcon />
            <a
              target="_blank"
              rel="noopener_noreferrer"
              className=" ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              href={value}
            >
              View PDF
            </a>
          </div>
        )}
        <Button onClick={() => onChange("")} variant="ghost" type="button">
          <X className="h-4 w-4" />
          Remove Logo
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-muted/30">
      <UploadDropzone<OurFileRouter>
        endpoint={apiEndpoint}
        onClientUploadComplete={(res: any) => {
          onChange(res?.[0].url);
        }}
        onUploadError={(err: Error) => console.log(err)}
      />
    </div>
  );
};

export default FileUpload;
