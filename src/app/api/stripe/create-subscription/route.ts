import { stripe } from "@/lib/stripe/index";
import { subscriptionCreated } from "@/lib/stripe/stripeActions";
import agencyModel from "@/models/Agency";
import subscriptionModel from "@/models/Subscription";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { customerId, priceId } = await req.json();
    const agency = await agencyModel.findOne({ customerId });
    const price = await stripe.prices.retrieve(priceId);
    if (!agency)
      return NextResponse.json(
        {
          error: {
            message: "Customer ID does not match any agency",
          },
        },
        {
          status: 404,
        }
      );
    const subscriptionExists = await subscriptionModel.findOne({ customerId:customerId });
    console.log(subscriptionExists)
    if (!subscriptionExists && subscriptionExists?.active !== "active") {
      console.log("subscription CREATED!!!!!!!!!!!!!!!!!!!!!!!!!")
      const newSubscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        payment_behavior:"default_incomplete",
        payment_settings:{
            save_default_payment_method:"on_subscription",
        },
        expand:["latest_invoice.payment_intent"]
      });

      return NextResponse.json(
        {
            subscriptionId:newSubscription.id,
            //@ts-ignore
            clientSecret:newSubscription?.latest_invoice?.payment_intent?.client_secret
        },
        {
          status: 200,
        }
      );
    } else {
      console.log("SUB UPDATEDDDDD!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
      const stripeSubscriptionData = await stripe.subscriptions.retrieve(
        subscriptionExists.subscriptionId.toString()
      );
      const subscription = await stripe.subscriptions.update(
        subscriptionExists.subscriptionId.toString(),
        {
          items: [
            {
              id: stripeSubscriptionData.items.data[0].id,
              deleted: true,
            },
            {
              price: priceId,
            },
          ],
          expand: ["latest_invoice.payment_intent"],
        }
      );
      return NextResponse.json(
        {
            subscriptionId:subscription.id,
            //@ts-ignore
            clientSecret:subscription?.latest_invoice?.payment_intent?.client_secret
        },
        {
          status: 200,
        }
      );
    }
  } catch (err) {
    console.log("🔴 Stripe create-subscription API error 🔴", err);
    return NextResponse.json(
      {
        error: {
          message: "Error in create-subscription",
        },
      },
      {
        status: 404,
      }
    );
  }
}
