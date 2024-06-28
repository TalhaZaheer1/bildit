//this is a client componant because one of parents is a client componant which is ModalProvider.tsx 
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { pricingCards } from "@/lib/constants";
import { useModal } from "@/providers/ModalProvider";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe/stripeClient";
import Loading from "@/components/global/loading";
import SubscriptionForm from ".";
import clsx from "clsx";
import Stripe from "stripe";

type Props = {
  customerId: string;
  planExists: boolean;
  agencyId:string;
};

const stripePromise = getStripe();

const SubscriptionFormWrapper = ({ customerId, planExists,agencyId }: Props) => {
  const { setClose, data } = useModal();
  const [selectedPriceId, setSelectedPriceId] = useState(
    data?.plans?.defaultPriceId || ""
  );
  const [subscription, setSubscription] = useState<{
    subscriptionId: string;
    clientSecret: string;
  }>({
    subscriptionId: "",
    clientSecret: "",
  });
  const options = useMemo(
    () => ({
      clientSecret: subscription?.clientSecret,
      appearence: {
        theme: "flat",
      },
    }),
    [subscription]
  );
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!selectedPriceId) return;
    const createOrUpdateSub = async () => {
      try {
        const res = await fetch("/api/stripe/create-subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerId: customerId,
            priceId: selectedPriceId,
          }),
        });
        const subResponse = await res.json();
        if (subResponse)
          setSubscription({
            subscriptionId: subResponse.subscriptionId,
            clientSecret: subResponse.clientSecret,
          });
        if (planExists) {
          toast({
            title: "Success!",
            description: "Subscription updated successfully",
          });
          if(data?.plans?.defaultPriceId)
            router.push(`/agency/${agencyId}/billing`);
          else router.refresh()
          setClose();
        }
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Oops!",
          description: "Could not update subscription status",
        });
      }
    };
    createOrUpdateSub();
  }, [selectedPriceId, planExists, customerId]);
  return (
    <div className="border-none transition-all">
      <div className="flex flex-col gap-4">
        {data.plans?.plans?.map((plan:Stripe.Price) => (
          <Card
            onClick={() => setSelectedPriceId(plan.id)}
            key={plan.id}
            className={clsx("relative cursor-pointer transition-all", {
              "border-primary": selectedPriceId === plan.id,
            })}
          >
            <CardHeader>
              <CardTitle>
                ${plan.unit_amount ? plan.unit_amount / 100 : 0}
                <p className="text-sm text-muted-foreground">{plan.nickname}</p>
                <p className="text-sm text-muted-foreground">
                  {
                    pricingCards.find((card) => card.priceId === plan.id)
                      ?.description
                  }
                </p>
                {plan.id === selectedPriceId && <div className="w-2 h-2 bg-emerald-500 rounded-full absolute top-4 right-4" />}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
        {options.clientSecret && !planExists ? (
            <>
            <h1  className="text-xl">Payment Method</h1>
          <Elements stripe={stripePromise} options={options}>
            <SubscriptionForm selectedPriceId={selectedPriceId} />
          </Elements>
          </>
        ) : null}
        {!options.clientSecret && selectedPriceId ? (
            <div className="flex items-center justify-center w-full h-40">
            <Loading />
            </div>
            ) : null}
      </div>
    </div>
  );
};

export default SubscriptionFormWrapper;
