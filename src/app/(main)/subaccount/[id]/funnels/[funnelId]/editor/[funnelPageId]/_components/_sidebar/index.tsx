"use client";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import React from "react";
import TabList from "./tabs";
import clsx from "clsx";
import { useEditor } from "@/providers/editor/EditorProvider";
import SettingsTab from "./tabs/SettingsTab";
import MediaBucketTab from "./tabs/MediaTab";
import ComponentsTab from "./tabs/componants-tab";
import LayersTab from "./tabs/Layers/LayersTab";

type Props = {
  subAccountId:string
};

const EditorSideBar = (props: Props) => {
  const { state, dispatch } = useEditor();
  return (
    <Sheet open={true} modal={false}>
      <Tabs className="w-full " defaultValue="Settings">
        <SheetContent
          showX={false}
          side="right"
          className={clsx(
            "mt-[96px] w-16 z-[80] shadow-none h-[100vh]  p-0 focus:border-none transition-all overflow-hidden",
            { hidden: state.editor.previewMode }
          )}
        >
          <TabList />
        </SheetContent>
        <SheetContent
          showX={false}
          side="right"
          className={clsx(
            "mt-[96px] w-80 z-[40] shadow-none p-0 mr-16 h-[100vh] bg-background transition-all overflow-hidden ",
            { hidden: state.editor.previewMode }
          )}
        >
          <div className="grid gap-4 h-full pb-36 overflow-scroll">
            <TabsContent value="Settings">
                <SheetHeader className="text-left p-6">
                <SheetTitle>Styles</SheetTitle>
                <SheetDescription>
                  Show your creativity! You can customize every component as you
                  like.
                </SheetDescription>
                </SheetHeader>
              <SettingsTab />
            </TabsContent>
            <TabsContent value="Media">
                <SheetHeader className="text-left p-6">
                <SheetTitle>Media</SheetTitle>
                <SheetDescription>
                  Show your creativity! You can select any media you
                  like.
                </SheetDescription>
                </SheetHeader>
              <MediaBucketTab subAccountId={props.subAccountId} />
            </TabsContent>
            <TabsContent value="Components">
              <SheetHeader className="text-left p-6">
              <SheetTitle>Components</SheetTitle>
              <SheetDescription>Add more components</SheetDescription>
              </SheetHeader>
              <ComponentsTab />
            </TabsContent>
            <TabsContent value="Layers">
              <SheetHeader className="text-left p-6">
              <SheetTitle>Layers</SheetTitle>
              <SheetDescription>Manage your componants tree structure</SheetDescription>
              </SheetHeader>
              <LayersTab />
            </TabsContent>
          </div>
        </SheetContent>
      </Tabs>
    </Sheet>
  );
};

export default EditorSideBar;
