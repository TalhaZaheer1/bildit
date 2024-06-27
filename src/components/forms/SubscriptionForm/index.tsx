"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  selectedPriceId: string;
};

export default function SubscriptionForm({ selectedPriceId }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const elements = useElements();
  const stripe = useStripe();
  const [priceError, setPriceError] = useState<string>("");

  const handleSubmit = async (e:React.FormEvent) => {
    if (!selectedPriceId) {
      setPriceError("You need to select a plan to subscribe.");
      return;
    }
    setPriceError("");
    e.preventDefault();
    if (!elements || !stripe) return;
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_URL}/agency`,
        },
      });
      if (error) throw new Error(error.message);
      toast({
        title: "Success!",
        description: "Payment successful",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Oops!",
        description: "Could not proceed with the payment",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <small className="text-destructive">{priceError}</small>
      <PaymentElement />
      <Button disabled={!stripe} className="mt-4 w-full">
        Submit
      </Button>
    </form>
  );
}
