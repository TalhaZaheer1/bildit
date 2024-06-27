import Image from "next/image";
import Link from "next/link";
import { pricingCards } from "@/lib/constants";
import { Check } from "lucide-react";
import { Card,CardHeader,CardTitle,CardContent,CardDescription,CardFooter } from "@/components/ui/card";
import clsx from 'clsx';
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import agencyModel, { AgencyInterface } from "@/models/Agency";
import dbConnect from "@/lib/db";
import { SubscriptionInterface } from "@/models/Subscription";
export default async function Home() {
  const authUser = await currentUser()
  const prices = await stripe.prices.list({
    product:process.env.NEXT_BILDIT_PRODUCT_ID,
    active:true
  })
  let agencyDetails:AgencyInterface | null;
  if(authUser){
    await dbConnect()
    agencyDetails = await agencyModel.findOne({
      companyEmail:authUser.emailAddresses[0].emailAddress
    }).populate("subscription");
  }
  // @ts-ignore
  const subscription = agencyDetails?.subscription as SubscriptionInterface
  return (
    <>
    <section className="flex h-full w-full relative flex-col items-center justify-center md:pt-36">
      <div className="absolute z-[-1] bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      <p>Run your agency, in one place</p>
      <div className=" bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text">
        <h1 className="text-9xl font-bold text-center md:text-[300px]" >Plura</h1>
      </div>
      <div className="flex justify-center items-center relative md:mt-[-70px]">
        <Image src={"/assets/preview.png"} alt="banner image" width={1200} height={1200}
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
      <div className="flex justify-center gap-4 flex-wrap mt-6">
      {prices.data.map((card) => (
            //WIP: Wire up free product from stripe
            <Card
              key={card.nickname}
              className={clsx('w-[300px] flex flex-col justify-between', {
                'border-2 border-primary': agencyDetails ? card.id === subscription?.priceId : card.nickname === "Unlimited SaaS",
              })}
            >
              <CardHeader>
                <CardTitle
                  className={clsx('', {
                    'text-muted-foreground': agencyDetails ? card.id !== subscription?.priceId : card.nickname !== "Unlimited SaaS",
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
                      <div
                        key={feature}
                        className="flex gap-2"
                      >
                        <Check />
                        <p>{feature}</p>
                      </div>
                    ))}
                </div>
                <Link
                  href={`/agency?plan=${card.id}`}
                  className={clsx(
                    'w-full text-center bg-primary p-2 rounded-md',
                    {
                      '!bg-muted-foreground':
                      agencyDetails ? card.id !== subscription?.priceId : card.nickname !== "Unlimited SaaS",
                    }
                  )}
                >
                  Get Started
                </Link>
              </CardFooter>
            </Card>
          ))}
           <Card className={clsx('w-[300px] flex flex-col justify-between')}>
            <CardHeader>
              <CardTitle
                className={clsx({
                  'text-muted-foreground': authUser ? !subscription?.priceId : true,
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
                  .find((c) => c.title === 'Starter')
                  ?.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex gap-2"
                    >
                      <Check />
                      <p>{feature}</p>
                    </div>
                  ))}
              </div>
              <Link
                href="/agency"
                className={clsx(
                  'w-full text-center bg-primary p-2 rounded-md',
                  {
                    '!bg-muted-foreground': true,
                  }
                )}
              >
                Get Started
              </Link>
            </CardFooter>
          </Card>
      </div>
    </section>
    </>
  );
}