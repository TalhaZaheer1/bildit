"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { saveActivityLogsNotifications, upsertFunnelPage } from "@/lib/queries";
import { FunnelPageInterface } from "@/models/FunnelPage";
import { DeviceTypes, useEditor } from "@/providers/editor/EditorProvider";
import clsx from "clsx";
import {
  ArrowLeftCircle,
  EyeIcon,
  Laptop,
  Redo2,
  Smartphone,
  Tablet,
  Undo2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

type Props = {
  subAccountId: string;
  pageDetails: FunnelPageInterface;
  funnelId: string;
};

const EditorNav = ({ subAccountId, pageDetails, funnelId }: Props) => {
  const { state, dispatch } = useEditor();
  const router = useRouter();
  useEffect(() => {
    dispatch({
      type: "SET_FUNNELPAGE_ID",
      payload: {
        funnelPageId: pageDetails._id,
      },
    });
  }, [pageDetails]);

  const handleOnSave = async () => {
    try {
    const response = await upsertFunnelPage(subAccountId,{
        content:JSON.stringify(state.editor.elements)
    },
    funnelId,
    pageDetails._id
)
toast("Success!", {
    description: "Saved Page Updates",
  });
    } catch (err) {
      toast("Oppse!", {
        description: "Failed to save page updates",
      });
    }
  };

  const handleTitleChange = async (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === pageDetails.name) return;
    if (!e.target.value) return;
    try {
      const response = await upsertFunnelPage(
        subAccountId,
        {
          name: e.target.value,
        },
        funnelId,
        pageDetails._id
      );
      if (response)
        toast("Success!", {
          description: "Saved Funnel Page title",
        });
      router.refresh();
    } catch (err) {
      toast("Oppse!", {
        description: "You need to have a title",
      });
    }
  };

  const handlePreviewClick = () => {
    dispatch({ type: "TOGGLE_PREVIEW_MODE" });
  };
  const handleLiveClick = () => {
    dispatch({ type: "TOGGLE_LIVE_MODE" });
  };
  const handleUndo = () => {
    dispatch({ type: "UNDO" });
  };
  const handleRedo = () => {
    dispatch({ type: "REDO" });
  };

  return (
    <TooltipProvider>
      <nav
        className={clsx(
          "border-b-[1px] flex items-center justify-between p-6 gap-2 transition-all",
          { "!h-0 !p-0 !overflow-hidden": state.editor.previewMode }
        )}
      >
        <aside className="flex items-center gap-4 max-w-[260px] w-[300px]">
          <Link href={`/subaccount/${subAccountId}/funnels/${funnelId}`}>
            <ArrowLeftCircle />
          </Link>
          <div className="flex flex-col w-full">
            <Input
              defaultValue={pageDetails.name}
              className="border-none h-5 m-0 p-0 text-lg"
              onBlur={handleTitleChange}
            />
            <span className="text-sm text-muted-foreground">
              Path: /{pageDetails.pathName}
            </span>
          </div>
        </aside>
        <aside>
          <Tabs
            defaultValue="Desktop"
            value={state.editor.device}
            onValueChange={(value: string) => {
              dispatch({
                type: "CHANGE_DEVICE",
                payload: {
                  device: value as DeviceTypes,
                },
              });
            }}
          >
            <TabsList className="grid w-full grid-cold-3 bg-transparent h-fit">
              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger
                    value="Desktop"
                    className="data-[state=active]:bg-muted w-10 h-10 p-0"
                  >
                    <Laptop />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Desktop</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger
                    value="Tablet"
                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                  >
                    <Tablet />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tablet</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger
                    value="Mobile"
                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                  >
                    <Smartphone />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mobile</p>
                </TooltipContent>
              </Tooltip>
            </TabsList>
          </Tabs>
        </aside>
        <aside className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-slate-800"
            onClick={handlePreviewClick}
          >
            <EyeIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-slate-800"
            onClick={handleUndo}
          >
            <Undo2 />
          </Button>
          <Button
            disabled={
              state.history.currentIndex >= state.history.stack.length - 1
            }
            variant="ghost"
            size="icon"
            className="hover:bg-slate-800"
            onClick={handleRedo}
          >
            <Redo2 />
          </Button>
          <div className="flex flex-col items-center mr-4">
            <div className="flex flex-row items-center gap-4">
              Draft
              <Switch disabled defaultChecked={true} />
              Publish
            </div>
            <span className="text-muted-foreground text-sm">
              <Button onClick={handleOnSave}>Save</Button>
            </span>
          </div>
        </aside>
      </nav>
    </TooltipProvider>
  );
};

export default EditorNav;
