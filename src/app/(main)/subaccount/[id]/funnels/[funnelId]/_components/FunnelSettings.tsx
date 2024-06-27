import FunnelForm from '@/components/forms/FunnelForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllProducts } from '@/lib/stripe/stripeActions'
import { FunnelInterface } from '@/models/Funnel'
import subAccountModel from '@/models/SubAccount'
import React, { useEffect, useMemo } from 'react'
import FunnelProductsTable from './FunnelProductsTable'
import Stripe from 'stripe'
import { getStripeAuthLink } from '@/lib/stripe'
import Link from 'next/link'

type Props = {
    funnelData:FunnelInterface
    subAccountId:string
}

const FunnelSettings = async ({
    funnelData,
    subAccountId
}: Props) => {
    const subAccountDetails = await subAccountModel.findById(subAccountId);
    if(!subAccountDetails) return
    
    let stripeProducts;
    if(subAccountDetails.connectAccountId){
        stripeProducts = await getAllProducts(subAccountDetails.connectAccountId)
    }
    const stripeOAuthLink = getStripeAuthLink(
      "subaccount",
      `launchpad___${subAccountId}`
    )
  return (
    <div className="flex g-4 flex-col xl:!flex-row">
      <Card className="flex-1 flex-shrink">
        <CardHeader>
          <CardTitle>Funnel Products</CardTitle>
          <CardDescription>
            Select the products and services you wish to sell on this funnel.
            You can sell one time and recurring products too.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <>
            {subAccountDetails.connectAccountId ? (
              <FunnelProductsTable
                defaultData={funnelData}
                products={stripeProducts as Stripe.Product[]}
              />
            ) : (
              <Link href={stripeOAuthLink}>Connect your stripe account to sell products.</Link>
            )}
          </>
        </CardContent>
      </Card>

      <FunnelForm
        subAccountId={subAccountId}
        defaultData={funnelData}
      />
    </div>
  )
}

export default FunnelSettings