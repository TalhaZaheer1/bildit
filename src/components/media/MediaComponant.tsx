import { SubAccountInterfaceWithMedia } from "@/lib/types";
import { SubAccountInterface } from "@/models/SubAccount";
import React from "react";
import MediaUploadButton from "./MediaUploadButton";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import Image from "next/image";
import MediaCard from "./MediaCard";
import { FolderSearch } from "lucide-react";

type Props = {
  data: SubAccountInterfaceWithMedia;
  subAccountId: string;
};

const MediaComponant = ({ data, subAccountId }: Props) => {
  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl">Media Bucket</h1>
        <MediaUploadButton subAccountId={subAccountId} />
      </div>
      <Command className="bg-transparent">
        <CommandInput placeholder="search files..." />
        <CommandList className="pb-40 max-h-full">
          {!!data?.media?.length && <CommandEmpty>No files found</CommandEmpty>}
          <CommandGroup heading="Media files">
            <div className="flex flex-wrap gap-4 pt-4">
              {data?.media.map((mediaFile) => (
                <CommandItem
                  key={mediaFile._id}
                  className="p-0 max-w-[300px] w-full rounded-lg !bg-transparent !font-medium !text-white"
                >
                  <MediaCard media={mediaFile} />
                </CommandItem>
              ))}
              {!data?.media.length && (
                <div className="flex items-center justify-center w-full flex-col">
                  <FolderSearch
                    size={200}
                    className="dark:text-muted text-slate-300"
                  />
                  <p className="text-muted-foreground ">
                    Empty! no files to show.
                  </p>
                </div>
              )}
            </div>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default MediaComponant;
