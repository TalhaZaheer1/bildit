"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { pricingCards } from "@/lib/constants";
import { Check } from "lucide-react";
import { Card,CardHeader,CardTitle,CardContent,CardDescription,CardFooter } from "@/components/ui/card";
import clsx from 'clsx';
export default function Home() {
  const [user, setUser] = useState({ name: "Jon" });

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
        {pricingCards.map(card => (
          <Card key={card.title}
            className={clsx("w-[300px] flex flex-col justify-between", {
              "border-2 border-primary" : card.title === "Unlimited Saas"
            })}
          >
            <CardHeader>
              <CardTitle className={clsx("",{
                "text-muted-foreground": card.title !== "Unlimited Saas"
              })}>
                {card.title}
              </CardTitle>
              <CardDescription>
                {card.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-4xl font-bold">{card.price}</span>
              <span className="text-muted-foreground">/m</span>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <div>
                {card.features.map(feature => (
                  <div
                  className="flex gap-2"
                  key={feature}>
                    <Check className="text-muted-foreground" />
                    <p>{feature}</p>
                  </div>
                ))}
              </div>
              <Link
              className={clsx("bg-primary p-2 w-full text-center rounded-md",{
                "!bg-muted-foreground":card.title == "Unlimited Saas"
              })}
              href={`/agency?plan=${card.priceId}`}>Get Started</Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
    </>
  );
}