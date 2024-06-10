"use client";
import React from "react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { deleteSubAccount } from "@/lib/queries";
import { useRouter } from "next/navigation";

type Props = {
  subAccountId: string;
};

const DeleteSubAccountButton = ({ subAccountId }: Props) => {
  const router = useRouter()
  const { toast } = useToast();
  const deleteAcc = async () => {
    try {
      const res = await deleteSubAccount(subAccountId);
      if (res.isDeleted)
        toast({
          title: "Sub Account deleted",
        });
        router.refresh()
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Oopsie",
        description: "Could not delete Sub Account",
      });
    }
  };
  return <Button 
  variant="destructive"
  className="text-white"
  onClick={deleteAcc}>Delete</Button>;
};

export default DeleteSubAccountButton;
