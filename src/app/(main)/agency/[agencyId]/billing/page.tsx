import { Separator } from "@/components/ui/separator";
import { addOnProducts, pricingCards } from "@/lib/constants";
import { stripe } from "@/lib/stripe";
import agencyModel from "@/models/Agency";
import "@/models/Subscription";
import subscriptionModel from "@/models/Subscription";
import React from "react";
import PricingCard from "./_componants/PricingCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import clsx from "clsx";

type Props = {
  params: { agencyId: string };
};

const Billing = async ({ params }: Props) => {
  const allAddOns = await stripe.products.list({
    ids: addOnProducts.map((addon) => addon.id),
    expand: ["data.default_price"],
  });

  const allPrices = await stripe.prices.list({
    product: process.env.NEXT_BILDIT_PRODUCT_ID,
  });
  const agency = await agencyModel
    .findOne({
      _id: params.agencyId,
    })
    .populate("subscription");

  const currentSubscriptionPlan = pricingCards.find(
    (card) => card.priceId === agency.subscription?.priceId
  );

  const charges = await stripe.charges.list({
    customer: agency.customerId,
  });

  const allChargesData = charges.data.map((charge) => ({
    description: charge.description,
    id: charge.id,
    date: `${new Date(charge.created * 1000).toLocaleDateString()} ${new Date(
      charge.created * 1000
    ).toLocaleDateString()}`,
    status: "Paid",
    amount: `${charge.amount / 100}`,
  }));

  const isActive = agency.subscription?.active;
  return (
    <>
      <h1>Billing</h1>
      <Separator />
      <h2 className="text-2xl p-4">Current Plan</h2>
      <div className="flex flex-col lg:!flex-row justify-between gap-8">
        <PricingCard
          title={
            isActive ? currentSubscriptionPlan?.title || "Starter" : "Starter"
          }
          description={
            isActive
              ? currentSubscriptionPlan?.description || "Lets get started"
              : "Lets get started! Pick a plan thats best for you"
          }
          highlightTitle="Plan Options"
          highlightDescription="Want to modify your plan? You can do this here. If you have
    further question contact support@plura-app.com"
          prices={allPrices.data}
          amount={isActive ? currentSubscriptionPlan?.price || "$0" : "$0"}
          features={
            isActive
              ? currentSubscriptionPlan?.features || pricingCards[0].features
              : pricingCards[0].features
          }
          buttonText={isActive ? "Change your plan" : "Get started!"}
          customerId={agency.customerId}
          duration={"/ month"}
          planExists={isActive}
        />
        {allAddOns.data?.map((addon) => (
          <PricingCard
            planExists={isActive}
            title={addon.name}
            description={addon.description || ""}
            prices={allPrices.data}
            amount={ addon.default_price?.unit_amount ? `$${addon.default_price?.unit_amount / 100}` : "$0"}
            buttonText="Subscribe"
            duration="/ month"
            features={[]}
            customerId={agency.customerId}
            highlightTitle="Get support now!"
            highlightDescription="Get priority support and skip the long long with the click of a button."
          />
        ))}
      </div>
      <Table className="bg-card border-[1px] border-border rounded-md">
        <TableHeader className="rounded-md">
          <TableRow>
            <TableHead className="w-[200px]">Description</TableHead>
            <TableHead className="w-[200px]">Invoice Id</TableHead>
            <TableHead className="w-[300px]">Date</TableHead>
            <TableHead className="w-[200px]">Paid</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="font-medium truncate">
          {allChargesData.map((charge) => (
            <TableRow key={charge.id}>
              <TableCell>{charge.description}</TableCell>
              <TableCell className="text-muted-foreground">
                {charge.id}
              </TableCell>
              <TableCell>{charge.date}</TableCell>
              <TableCell>
                <p
                  className={clsx('', {
                    'text-emerald-500': charge.status.toLowerCase() === 'paid',
                    'text-orange-600':
                      charge.status.toLowerCase() === 'pending',
                    'text-red-600': charge.status.toLowerCase() === 'failed',
                  })}
                >
                  {charge.status.toUpperCase()}
                </p>
              </TableCell>
              <TableCell className="text-right">{charge.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default Billing;
