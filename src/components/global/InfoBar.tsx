"use client";

import { NotificationInterface } from "@/models/Notification";
import { UserButton } from "@clerk/nextjs";
import React, { useMemo, useState } from "react";
import { ModeToggle } from "./mode-toggle";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import Image from "next/image";
import { UserInterface } from "@/models/User";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { twMerge } from "tailwind-merge";
import { Card } from "../ui/card";
import { Switch } from "../ui/switch";

type Props = {
  notifications: NotificationInterface[];
  role?: string;
  className?: string;
  subAccountId?: string;
};

const InfoBar = ({ notifications, role, className, subAccountId }: Props) => {
  const [allNotifications, setAllNotifications] = useState(
    notifications || []
  );
  const [showAll, setShowAll] = useState(true);

  const handleClick = () => {
    if (!showAll) setAllNotifications(notifications);
    else {
      if (notifications.length !== 0) {
        setAllNotifications(
          notifications?.filter(
            (noti) => noti.subAccount === subAccountId
          ) ?? []
        );
      }
    }
    setShowAll((prev) => !prev);
  };
  return (
    <nav
      className={twMerge(
        "fixed z-[20] md:left-[300px] overflow-y-scroll left-0 right-0 top-0 p-4 bg-background/80 backdrop-blur-md flex  gap-4 items-center border-b-[1px] ",
        className
      )}
    >
      <div className="flex items-center gap-2 ml-auto">
        <UserButton afterSignOutUrl="/" />
        <Sheet>
          <SheetTrigger>
            <div className="rounded-full w-8 h-8 bg-primary flex items-center justify-center text-white">
              <Bell size={17} />
            </div>
          </SheetTrigger>
          <SheetContent showX={true} className="mt-4 mr-4 pr-4 h-fit flex flex-col overflow-y-scroll" side="right">
            <SheetHeader className="text-left">
              <SheetTitle>Notifications</SheetTitle>
              
                {((role === "AGENCY_ADMIN" || role === "AGENCY_OWNER") && subAccountId) && (
                <Card className="flex items-center justify-between p-4">
                  Current Subaccount
                  <Switch checked={!showAll} onCheckedChange={handleClick} />
                </Card>
                )}
              
            </SheetHeader>
            {allNotifications?.length === 0 ? (
              <p className="mb-4 text-muted-foreground">Nothing to see here...</p>
            ) : (
              allNotifications?.map((notification: any, index) => {
                const user = notification.user as UserInterface;
                return (
                  <div
                    key={index}
                    className="flex flex-col gap-y-2 mb-2 overflow-x-scroll commandList text-ellipsis"
                  >
                    <div className="flex gap-2">
                      <Avatar>
                        <AvatarImage src={user?.avatarUrl} alt="avatar" />
                        <AvatarFallback>
                          {user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p>
                          <span className="font-bold">
                            {notification.notification.split("|")[0]}
                          </span>
                          <span className="text-muted-foreground">
                            {notification.notification.split("|")[1]}
                          </span>
                          <span className="font-bold">
                            {notification.notification.split("|")[2]}
                          </span>
                        </p>
                        <small className="text-xs text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleString()}
                        </small>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </SheetContent>
        </Sheet>
        <ModeToggle />
      </div>
    </nav>
  );
};

export default InfoBar;
