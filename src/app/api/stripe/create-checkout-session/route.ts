import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { connectedAccountId, prices, subAccountId } = await req.json();
  if (!connectedAccountId || !prices.length) {
    return NextResponse.json(
      {
        error: {
          message: "Missing connected_account_id or prices",
        },
      },
      {
        status: 400,
      }
    );
  }
  if (
    !process.env.NEXT_PUBLIC_PLATFORM_SUBSCRIPTION_PERCENT ||
    !process.env.NEXT_PUBLIC_PLATFORM_ONETIME_FEE ||
    !process.env.NEXT_PUBLIC_PLATFORM_AGENY_PERCENT
  ) {
    return console.log("ENV VARIABLES FOR STRIPE CHECKOUT SESSION MISSING");
  }
  const subscriptionExists = prices.find((prices) => prices.recurring);
  try {
    const session = await stripe.checkout.sessions.create(
      {
        line_items: prices.map((price) => ({
          price: price.productId,
          quantity: 1,
        })),
        ...(subscriptionExists
          ? {
              subscription_data: {
                metadata: {
                  connectAccountSubscriptions: "true",
                },
                application_fee_percent:
                  +process.env.NEXT_PUBLIC_PLATFORM_SUBSCRIPTION_PERCENT,
              },
            }
          : {
              payment_intent_data: {
                metadata: {
                  connectAccountPayments: "true",
                },
                application_fee_amount:
                  +process.env.NEXT_PUBLIC_PLATFORM_ONETIME_FEE,
              },
            }),
        ui_mode: "embedded",
        mode: subscriptionExists ? "subscription" : "payment",
        redirect_on_completion: "never",
      },
      {
        stripeAccount: connectedAccountId,
      }
    );
    return NextResponse.json({
      session: session.client_secret,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        error: {
          message: "Error creating checkout session",
        },
      },
      {
        status: 400,
      }
    );
  }
}

export async function OPTIONS(req: Request) {
  const allowedOrigin = req.headers.get("origin");
  const response = new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin || "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
      "Access-Control-Max-Age": "86400",
    },
  });
  return response
}
