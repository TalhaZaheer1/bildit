import { stripe } from "@/lib/stripe";
import { subscriptionCreated } from "@/lib/stripe/stripeActions";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

const allowedEventTypes = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(req: Request) {
  const rawEvent = await req.text();
  const sig = headers().get("Stripe-Signature") as string;
  let event;
  console.log("STRIPE WEBHOOK ACTIVATED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
  try {
    event = stripe.webhooks.constructEvent(rawEvent, sig, webhookSecret);
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      {
        error: {
          message: `Webhook error: ${err}`,
        },
      },
      {
        status: 400,
      }
    );
  }
  try {
    if (allowedEventTypes.has(event.type)) {
      const subscription = event.data.object as Stripe.Subscription
      if (
        !subscription.metadata.connectAccountPayments &&
        !subscription.metadata.connectAccountSubscriptions
      ) {
        console.log("WEBHOOK CHALA")
        switch (event.type) {
          case 'customer.subscription.created':
          case 'customer.subscription.updated': {
            if (subscription.status === 'active' ) {
              await subscriptionCreated(
                subscription,
                subscription.customer as string
              )
              console.log('CREATED FROM WEBHOOK 💳',)
            } else {
              console.log(
                'SKIPPED AT CREATED FROM WEBHOOK 💳 because subscription status is not active',
              )
              break
            }
          }
          default:
            console.log('👉🏻 Unhandled relevant event!', event.type)
        }
      } else {
        console.log(
          'SKIPPED FROM WEBHOOK 💳 because subscription was from a connected account not for the application',
          subscription
        )
      }
    }
    return NextResponse.json(
      {
        webhookActionReceived: true,
      },
      {
        status: 200,
      }
    )
  } catch (err) {
    console.log(err)
    return new NextResponse('🔴 Webhook Error', { status: 400 })
  }
}
