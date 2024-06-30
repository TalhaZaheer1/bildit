import Image from "next/image";
import Link from "next/link";
import { pricingCards } from "@/lib/constants";
import { Check } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import clsx from "clsx";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import agencyModel, { AgencyInterface } from "@/models/Agency";
import dbConnect from "@/lib/db";
import { SubscriptionInterface } from "@/models/Subscription";
export default async function Home() {
  const authUser = await currentUser();
  const prices = await stripe.prices.list({
    product: process.env.NEXT_BILDIT_PRODUCT_ID,
    active: true,
  });
  let agencyDetails: AgencyInterface | null;
  if (authUser) {
    await dbConnect();
    agencyDetails = await agencyModel
      .findOne({
        companyEmail: authUser.emailAddresses[0].emailAddress,
      })
      .populate("subscription");
  }
  // @ts-ignore
  const subscription = agencyDetails?.subscription as SubscriptionInterface;
  return (
    <>
      <section className="flex h-full w-full relative flex-col items-center justify-center md:pt-[19rem]">
        <div className="absolute z-[-1] bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        <p>Run your agency, in one place</p>
        <div className=" bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text">
          <h1 className="text-9xl font-bold text-center md:text-[300px]">
            bildit
          </h1>
        </div>
        <div className="flex justify-center items-center relative md:mt-[-70px]">
          <Image
            src={"/assets/preview.png"}
            alt="banner image"
            width={1200}
            height={1200}
            className="rounded-t-2xl border-2 border-muted"
          />
          <div className="absolute right-0 left-0 top-[50%] bottom-0 bg-gradient-to-t from-[#ffffff] dark:from-background" />
        </div>
      </section>
      <section className="flex flex-col justify-center items-center gap-4 md:!mt-20 mt-[-9rem]">
        <h2 className="text-4xl text-center">Choose what fits you right</h2>
        <p className="text-muted-foreground text-center">
          Our straightforward pricing plans are tailored to meet your needs. If
          {" you're"} not <br />
          ready to commit you can get started for free.
        </p>
        <div id="pricing-plans" className="flex justify-center gap-4 flex-wrap mt-6 md:mt-[10rem]">
          {prices.data.map((card) => (
            //WIP: Wire up free product from stripe
            <Card
              key={card.nickname}
              className={clsx("w-[300px] flex flex-col justify-between", {
                "border-2 border-primary": agencyDetails
                  ? card.id === subscription?.priceId
                  : card.nickname === "Unlimited SaaS",
              })}
            >
              <CardHeader>
                <CardTitle
                  className={clsx("", {
                    "text-muted-foreground": agencyDetails
                      ? card.id !== subscription?.priceId
                      : card.nickname !== "Unlimited SaaS",
                  })}
                >
                  {card.nickname}
                </CardTitle>
                <CardDescription>
                  {
                    pricingCards.find((c) => c.title === card.nickname)
                      ?.description
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-4xl font-bold">
                  {card.unit_amount && card.unit_amount / 100}
                </span>
                <span className="text-muted-foreground">
                  <span>/ {card.recurring?.interval}</span>
                </span>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-4">
                <div>
                  {pricingCards
                    .find((c) => c.title === card.nickname)
                    ?.features.map((feature) => (
                      <div key={feature} className="flex gap-2">
                        <Check />
                        <p>{feature}</p>
                      </div>
                    ))}
                </div>
                <Link
                  href={`/agency?plan=${card.id}`}
                  className={clsx(
                    "w-full text-center bg-primary p-2 rounded-md",
                    {
                      "!bg-muted-foreground": agencyDetails
                        ? card.id !== subscription?.priceId
                        : card.nickname !== "Unlimited SaaS",
                    }
                  )}
                >
                  Get Started
                </Link>
              </CardFooter>
            </Card>
          ))}
          <Card className={clsx("w-[300px] flex flex-col justify-between")}>
            <CardHeader>
              <CardTitle
                className={clsx({
                  "text-muted-foreground": authUser
                    ? !subscription?.priceId
                    : true,
                })}
              >
                {pricingCards[0].title}
              </CardTitle>
              <CardDescription>{pricingCards[0].description}</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-4xl font-bold">$0</span>
              <span>/ month</span>
            </CardContent>
            <CardFooter className="flex flex-col  items-start gap-4 ">
              <div>
                {pricingCards
                  .find((c) => c.title === "Starter")
                  ?.features.map((feature) => (
                    <div key={feature} className="flex gap-2">
                      <Check />
                      <p>{feature}</p>
                    </div>
                  ))}
              </div>
              <Link
                href="/agency"
                className={clsx(
                  "w-full text-center bg-primary p-2 rounded-md",
                  {
                    "!bg-muted-foreground": true,
                  }
                )}
              >
                Get Started
              </Link>
            </CardFooter>
          </Card>
        </div>
        <h1 id="features" className="text-primary text-[4rem] md:mb-14 font-bold md:text-[5rem]">
          Features
        </h1>
        <div className="flex flex-col gap-14"> 
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-center text-black dark:text-primary-foreground text-xl md:text-4xl ">
              {" "}
              Your very own{"  "}
              <span className="font-extrabold text-purple-700 text-2xl md:text-4xl">Website Builder</span>
            </h1>
            <Image
              src="/assets/site-builder.png"
              alt="task-board"
              width={1200}
              height={1200}
            className="rounded-2xl border-2 border-muted"
            />
            <p className="text-muted-foreground text-center md:text-xl px-10">
                Create websites for your clients and sell their products there
                while getting all the details about each conversion along with a commission.
            </p>
          </div>
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-center text-black dark:text-primary-foreground text-xl md:text-4xl ">
              {" "}
              Task Management Board with{" "}
              <span className="font-extrabold text-primary">drag</span> and{" "}
              <span className="font-extrabold text-emerald-600">drop</span>
            </h1>
            <Image
              src="/assets/task-board.png"
              alt="task-board"
              width={1200}
              height={1200}
            className="rounded-2xl border-2 border-muted"
            />
            <p className="text-muted-foreground text-center px-10 md:text-xl">
                How can one manage an agency without a Task Manager.Our built-in Task Manager 
                Board can organize your workflows and keep your up to date.
            </p>
          </div>
          <div className="flex flex-col gap-6 items-center">
            <h1 className="text-center text-orange-500 font-bold text-xl md:text-4xl ">
              {" "}
              Team Management Section
            </h1>
            <Image
              src="/assets/team-manager.png"
              alt="team-manager"
              width={1200}
              height={1200}
            className="rounded-2xl border-2 border-muted"
            />
            <p className="text-muted-foreground text-center px-10 md:text-xl">
                Manage your team by assigning permissions to each member of your agency.
            </p>
          </div>
          <div id="about" className="flex flex-col gap-1 items-center mb-10">
            <div className="text-2xl">there&apos;s

          <div className=" bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text">
          <h1 className="text-4xl font-bold text-center md:text-5xl">
            ALOT MORE
          </h1>
        </div>
            </div>
          <Link href={"/agency"} className="bg-primary text-white p-2 px-4 rounded-md hover:bg-primary/80">
                    Login to find out
                </Link>
          </div>
        </div>
      </section>
    </>
  );
}
