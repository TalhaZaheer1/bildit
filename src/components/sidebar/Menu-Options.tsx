"use client";
import { SidebarOption } from "@/lib/types";
import { AgencyInterface } from "@/models/Agency";
import { SubAccountInterface } from "@/models/SubAccount";
import { UserInterface } from "@/models/User";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { ChevronsUpDown, Compass, Menu, PlusCircleIcon } from "lucide-react";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import clsx from "clsx";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { CommandGroup } from "cmdk";
import Link from "next/link";
import { useModal } from "@/providers/ModalProvider";
import CustomModal from "@/components/global/CustomModal"
import SubAccountDetails from "../forms/SubAccountDetails";
import { Separator } from "../ui/separator";
import { icons } from "@/lib/constants";


type Props = {
  defaultOpen?: boolean;
  sidebarOptions: SidebarOption[];
  subAccounts: SubAccountInterface[];
  details: SubAccountInterface | AgencyInterface;
  logo: string;
  user: UserInterface;
};

const MenuOptions = ({
  defaultOpen,
  details,
  sidebarOptions,
  subAccounts,
  logo,
  user,
}: Props) => {
  const { setOpen } = useModal()
  const [isMounted, setIsMounted] = useState(false);
  const agency = user?.agency as AgencyInterface;
  const defaultOption = useMemo(
    () => (defaultOpen ? { open: true } : {}),
    [defaultOpen]
  );
  useEffect(() => {
    setIsMounted(true);
  }, []);


  if (!isMounted) return;

  return (
    <Sheet modal={false} {...defaultOption}>
      <SheetTrigger
        className="absolute left-4 top-4 z-[100] md:!hidden"
        asChild
      >
        <Button variant="outline" size={"icon"}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={"left"}
        className={clsx(
          " bg-background/80 backdrop-blur-xl fixed top-0 border-r-[1px] p-6",
          {
            "hidden md:inline-block z-0 w-[300px]": defaultOpen,
            "inline-block md:hidden z-[20] w-full": !defaultOpen,
          }
        )}
        showX={!defaultOpen}
      >
        <AspectRatio ratio={16 / 5}>
          <Image
            src={logo}
            alt="logo"
            fill
            className="rounded-md object-contain"
          />
        </AspectRatio>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="flex justify-between items-center my-4 w-full py-8"
            >
              <div className="flex gap-2 items-center text-left">
                <Compass />
                <div className="flex flex-col">
                  {details.name}
                  <span className="text-muted-foreground">
                    {details.address}
                  </span>
                </div>
              </div>
              <ChevronsUpDown size={16} className="text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 h-80 mt-4 z-[200]">
            <Command className="rounded-lg">
              <CommandInput placeholder="Search Accounts" />
              <CommandList className="pb-16 commandList">
                <CommandEmpty>No results found...</CommandEmpty>
                {(user?.role === "AGENCY_ADMIN" ||
                  user?.role === "AGENCY_OWNER") &&
                  user?.agency && (
                    <CommandGroup heading="Agency">
                      <CommandItem
                        className="!bg-transparent my-2 text-primary broder-[1px] border-border p-2 rounded-md hover:!bg-muted cursor-pointer transition-all"
                      >
                        {defaultOpen ? (
                          <Link
                            className="flex gap-4 w-full h-full"
                            href={`/agency/${agency?._id}`}
                          >
                            <div className="relative w-16">
                              <Image
                                alt="agencyLogo"
                                src={agency?.agencyLogo as string}
                                fill
                                className="rounded-md object-contain"
                              />
                            </div>
                            <div className="flex flex-col flex-1">
                              {agency.name}
                              <span className="text-muted-foreground">
                                {agency.address}
                              </span>
                            </div>
                          </Link>
                        ) : (
                          <SheetClose asChild>
                            <Link
                              className="flex gap-4 w-full h-full"
                              href={`/agency/${agency?._id}`}
                            >
                              <div className="relative w-16">
                                <Image
                                  alt="agencyLogo"
                                  src={agency?.agencyLogo as string}
                                  fill
                                  className="rounded-md object-contain"
                                />
                              </div>
                              <div className="flex flex-col flex-1">
                                {agency.name}
                                <span className="text-muted-foreground">
                                  {agency.address}
                                </span>
                              </div>
                            </Link>
                          </SheetClose>
                        )}
                      </CommandItem>
                    </CommandGroup>
                  )}
                <CommandGroup heading="Accounts">
                  {!!subAccounts && subAccounts.length > 0
                    ? subAccounts.map((subAccount) => (
                        <CommandItem key={subAccount._id} className="!bg-transparent my-2 text-primary broder-[1px] border-border p-2 rounded-md hover:!bg-muted cursor-pointer transition-all">
                          {defaultOpen ? (
                            <Link
                              className="flex gap-4 w-full h-full"
                              href={`/subaccount/${subAccount._id}`}
                            >
                              <div className="relative w-16">
                                <Image 
                                alt="sub account logo"
                                src={subAccount.subAccountLogo as string}
                                fill
                                className="rounded-md object-contain"
                                />
                              </div>
                              <div className="flex flex-col flex-1">
                                {subAccount.name}
                                <span className="text-muted-foreground">{subAccount.address}</span>
                              </div>
                            </Link>
                          ) : (
                            <SheetClose asChild>
                            <Link
                              className="flex gap-4 w-full h-full"
                              href={`/subaccount/${subAccount._id}`}
                            >
                              <div className="relative w-16">
                                <Image 
                                alt="sub account logo"
                                src={subAccount.subAccountLogo as string}
                                fill
                                className="rounded-md object-contain"
                                />
                              </div>
                              <div className="flex flex-col flex-1">
                                {subAccount.name}
                                <span className="text-muted-foreground">{subAccount.address}</span>
                              </div>
                            </Link>
                            </SheetClose>
                          )}
                        </CommandItem>
                      ))
                    : <p className="text-muted-foreground">No sub accounts...</p>}
                </CommandGroup>
              </CommandList>
              {user.role === "AGENCY_ADMIN" || user.role === "AGENCY_OWNER" && (
                <Button className="w-full flex gap-2"
                  onClick={() => setOpen((<CustomModal 
                    title="Create a SubAccount"
                    subheading="You can switch between your agency account and subaccount from the side bar"
                    defaultOpen={false}
                    >
                      <SubAccountDetails 
                      agency={user.agency as AgencyInterface}
                      userId={user._id as string}
                      userName={user.name}
                      />
                    </CustomModal>))}
                >
                  <PlusCircleIcon size={15} />
                  Create Sub Account
                </Button>
              )}
            </Command>
          </PopoverContent>
        </Popover>
        <p className="text-muted-foreground text-xs mb-2">MENU LINKS</p>
        <Separator className="mb-4" />
        <nav className="relative overflow-visible">
          <Command className="rounded-lg overflow-visible bg-transparent">
            <CommandInput placeholder="Search..."/>
            <CommandList className="pb-16 mt-4 overflow-visible">
              <CommandEmpty className="text-muted-foreground">No results...</CommandEmpty>
              <CommandGroup className="overflow-visible">
                { sidebarOptions.map((option,index) => {
                  const icon = icons.find(icon => icon.value === option.icon)
                  return(
                    
                   <CommandItem 
                   className="md:w-[320px] w-full"
                   key={index}>
                    <SheetClose asChild>
                    <Link 
                    className="flex items-center gap-2 hover:bg-transparent rounded-md transition-all md:w-full w-[380px]"
                    href={option.link}>
                      {icon?.path && <icon.path />}
                      {option.name}
                    </Link>
                    </SheetClose>
                   </CommandItem>
                  )
                }
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MenuOptions;
