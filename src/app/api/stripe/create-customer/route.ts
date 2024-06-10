import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { StripeCustomerType } from "@/lib/types";

export async function POST(req: Request) {
  const { email, name, address, shipping }: StripeCustomerType =
    await req.json();

  if (!email || !address || !name || !shipping)
    return new NextResponse("Missing data", {
      status: 400,
    });
    try{
        const customer = await stripe.customers.create({
            email,
            name,
            address,
            shipping
        })
        if(customer)
            return Response.json({customerId:customer.id})
    }catch(err){
        console.log('🔴 Error', err)
        return new NextResponse("Internal Server Error",{status:500})
    }
}
