"use client";
import ContactForm from "@/components/forms/ContactForm";
import CustomModal from "@/components/global/CustomModal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/ModalProvider";
import { CirclePlus } from "lucide-react";
import React from "react";

type Props = {
  subAccountId: string;
};

const CreateContactButton = ({ subAccountId }: Props) => {
  const { setOpen } = useModal();
  const openForm = () => {
    setOpen(
      <CustomModal
        title="Create a contact"
        subheading="you can create and manage your leads as contacts"
        defaultOpen={false}
      >
        <ContactForm subAccountId={subAccountId} />
      </CustomModal>
    );
  };
  return (
    <Button className="flex gap-2 ml-5" onClick={openForm}>
      <CirclePlus size={15} />
      Create
    </Button>
  );
};

export default CreateContactButton;
