import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getStripeAuthLink, stripe } from "@/lib/stripe";
import subAccountModel from "@/models/SubAccount";
import { CheckCircle, CheckCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  params: { id: string };
  searchParams: { code: string };
};

//TODO:Add Stripe connect feature in subaccount

const LaunchPadPage = async ({ params, searchParams }: Props) => {
  const subAccountdetails = await subAccountModel.findOne({ _id: params.id });
  if (!subAccountdetails) return;
  const stripeOAuthLink = getStripeAuthLink(
    "subaccount",
    `launchpad___${params.id}`
  );
  const allDetailsExist =
    subAccountdetails.address &&
    subAccountdetails.subAccountLogo &&
    subAccountdetails.city &&
    subAccountdetails.companyEmail &&
    subAccountdetails.companyPhone &&
    subAccountdetails.country &&
    subAccountdetails.name &&
    subAccountdetails.state &&
    subAccountdetails.zipCode;

  if (!subAccountdetails.connectAccountId) {
    if (searchParams.code) {
      const stripeDetails = await stripe.oauth.token({
        grant_type: "authorization_code",
        code: searchParams.code,
      });
      const connectAccountId = stripeDetails.stripe_user_id;
      subAccountdetails.connectAccountId = connectAccountId;
      await subAccountdetails.save();
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full h-full max-w-[800px]">
        <Card className="border-none">
          <CardHeader>
            <CardTitle>Lets get started!</CardTitle>
            <CardDescription>
              Follow the steps below to get your account setup
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex justify-between items-center w-full border p-4 rounded-lg gap-2">
              <div className="flex md:items-center gap-4 flex-col md:flex-row">
                <Image
                  src="/appstore.png"
                  alt="app logo"
                  height={80}
                  width={80}
                  className="rounded-md object-contain"
                />
                <p>Save the website as a shortcut on your mobile device</p>
              </div>
              <Button>Start</Button>
            </div>
            <div className="flex justify-between items-center w-full border p-4 rounded-lg gap-2">
              <div className="flex md:items-center gap-4 flex-col md:flex-row">
                <Image
                  src="/striplogo.png"
                  alt="app logo"
                  height={80}
                  width={80}
                  className="rounded-md object-contain"
                />
                <p>
                  Connect your strip account to accept payments and see your
                  dashboard
                </p>
              </div>
              {subAccountdetails.connectAccountId ? (
                <CheckCircleIcon
                  size={50}
                  className=" text-primary p-2 flex-shrink-0"
                />
              ) : (
                <Link
                  className="bg-primary py-2 px-4 rounded-md text-white"
                  href={stripeOAuthLink}
                >
                  Connect
                </Link>
              )}
            </div>{" "}
            <div className="flex justify-between items-center w-full border p-4 rounded-lg gap-2">
              <div className="flex md:items-center gap-4 flex-col md:flex-row">
                <Image
                  src={subAccountdetails.agencyLogo}
                  alt="app logo"
                  height={80}
                  width={80}
                  className="rounded-md object-contain"
                />
                <p>Fill in all your business details</p>
              </div>
              {allDetailsExist ? (
                <CheckCircle
                  className="text-primary p-2 flex-shrink-0"
                  size={50}
                />
              ) : (
                <Link
                  className="bg-primary py-2 px-4 rounded-md text-white"
                  href={`/agency/${params.id}/settings`}
                >
                  Start
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LaunchPadPage;
