"use client";
import SubscriptionFormWrapper from "@/components/forms/SubscriptionForm/SubscriptionFormWrapper";
import CustomModal from "@/components/global/CustomModal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useModal } from "@/providers/ModalProvider";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import Stripe from "stripe";

type Props = {
  agencyId:string
  title: string;
  prices: Stripe.Response<Stripe.ApiList<Stripe.Price>>["data"];
  amount: string;
  features: string[];
  buttonText: string;
  description: string;
  duration: string;
  highlightTitle: string;
  highlightDescription: string;
  planExists: boolean;
  customerId: string;
};

const PricingCard = ({
  agencyId,
  title,
  prices,
  amount,
  features,
  buttonText,
  description,
  duration,
  highlightTitle,
  highlightDescription,
  planExists,
  customerId,
}: Props) => {
  const { setOpen } = useModal();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  useEffect(() => {
    if(plan)
      handleManagePlan()
  },[plan])
  const handleManagePlan = () => {
    setOpen(
      <CustomModal
        title="Pick your plan"
        subheading="We have many options to choose from"
        defaultOpen={false}
      >
        <SubscriptionFormWrapper
          customerId={customerId}
          planExists={planExists}
          agencyId={agencyId}
        />
      </CustomModal>,async () => ({
        plans:{
            defaultPriceId:plan ? plan : "",
            plans:prices
        }
      })
    );
  };
  return (
    <Card className="flex flex-col justify-between lg:w-1/2">
      <div>
        <CardHeader className="flex flex-col md:!flex-row justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <p className="text-6xl font-bold">
            {amount}
            <small className="text-xs font-light text-muted-foreground">
              {duration}
            </small>
          </p>
        </CardHeader>
        <CardContent>
          <ul>
            {features.map((feature) => (
              <li
                className="list-disc ml-4 text-muted-foreground"
                key={feature}
              >
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </div>
      <CardFooter>
        <Card >
        <div className="flex flex-col md:!flex-row items-center justify-between rounded-lg border gap-4 p-4">
          <div>
            <p>{highlightTitle}</p>
            <p className="text-sm text-muted-foreground">
              {highlightDescription}
            </p>
          </div>
        <Button className="md:w-fit mt-4 w-full" onClick={handleManagePlan}>
          {buttonText}
        </Button>
        </div>
        </Card>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
