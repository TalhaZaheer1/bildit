'use client'
import Loading from '@/components/global/loading'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'
import { getFunnel, getSubaccountDetails } from '@/lib/queries'
import { getStripe } from '@/lib/stripe/stripeClient'
import { FunnelPageInterface } from '@/models/FunnelPage'
import { Element, useEditor } from '@/providers/editor/EditorProvider'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import clsx from 'clsx'
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'

type Props = {
  element: Element
}

const Checkout = (props: Props) => {
  const { dispatch, state,subAccountId, funnelId, pageDetails } = useEditor()
  const router = useRouter()
  const [clientSecret, setClientSecret] = useState('')
  const [livePrices, setLivePrices] = useState([])
  const [subAccountConnectAccId, setSubAccountConnectAccId] = useState('')
  const options = useMemo(() => ({ clientSecret }), [clientSecret])
  const styles = props.element.styles

  useEffect(() => {
    if (!subAccountId) return
    const fetchData = async () => {
      const subaccountDetails = await getSubaccountDetails(subAccountId)
      if (subaccountDetails) {
        if (!subaccountDetails.connectAccountId) return
        setSubAccountConnectAccId(subaccountDetails.connectAccountId)
      }
    }
    fetchData()
  }, [subAccountId])

  useEffect(() => {
    if (funnelId) {
      const fetchData = async () => {
        const funnelData = await getFunnel(funnelId)
        setLivePrices(JSON.parse(funnelData?.liveProducts || '[]'))
      }
      fetchData()
    }
  }, [funnelId])

  useEffect(() => {
    if (livePrices.length && subAccountId && subAccountConnectAccId) {
      const getClientSercet = async () => {
        try {
          const body = JSON.stringify({
            subAccountConnectAccId,
            prices: livePrices,
            subaccountId: subAccountId,
          })
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}api/stripe/create-checkout-session`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body,
            }
          )
          const responseJson = await response.json()
          if (!responseJson) throw new Error('somethign went wrong')
          if (responseJson.error) {
            throw new Error(responseJson.error)
          }
          if (responseJson.clientSecret) {
            setClientSecret(responseJson.clientSecret)
          }
        } catch (error) {
          toast({
            open: true,
            className: 'z-[100000]',
            variant: 'destructive',
            title: 'Oppse!',
            //@ts-ignore
            description: error.message,
          })
        }
      }
      getClientSercet()
    }
  }, [livePrices, subAccountId, subAccountConnectAccId])

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('component', JSON.stringify({type:"paymentForm"}))
  }

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({
      type: 'CHANGE_SELECTED_ELEMENT',
      payload: {
        elementDetails: props.element,
      },
    })
  }

  const goToNextPage = async () => {
    if (!state.editor.liveMode) return
    const funnelPages = await getFunnel(funnelId)
    if (!funnelPages || !pageDetails) return
    if (funnelPages.FunnelPages.length > pageDetails.order + 1) {
      console.log(funnelPages.FunnelPages.length, pageDetails.order + 1)
      const nextPage = funnelPages.FunnelPages.find(
        (page:FunnelPageInterface) => page.order === pageDetails.order + 1
      )
      if (!nextPage) return
      router.replace(
        `${process.env.NEXT_PUBLIC_SCHEME}${funnelPages.subDomainName}.${process.env.NEXT_PUBLIC_DOMAIN}/${nextPage.pathName}`
      )
    }
  }

  const handleDeleteElement = () => {
    dispatch({
      type: 'DELETE_ELEMENT',
      payload: { elementId: props.element.id },
    })
  }

  return (
    <div
      style={styles}
      draggable
      onDragStart={(e) => handleDragStart(e)}
      onClick={handleOnClickBody}
      className={clsx(
        'p-[2px] w-full m-[5px] relative text-[16px] transition-all flex items-center justify-center',
        {
          '!border-blue-500':
            state.editor.selectedElement.id === props.element.id,

          '!border-solid': state.editor.selectedElement.id === props.element.id,
          'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
        }
      )}
    >
      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg ">
            {state.editor.selectedElement.name}
          </Badge>
        )}

      <div className="border-none transition-all w-full">
        <div className="flex flex-col gap-4 w-full">
          {options.clientSecret && subAccountConnectAccId && (
            <div className="text-white">
              <EmbeddedCheckoutProvider
                stripe={getStripe(subAccountConnectAccId)}
                options={options}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          )}

          {!options.clientSecret && (
            <div className="flex items-center justify-center w-full h-40">
              <Loading />
            </div>
          )}
        </div>
      </div>

      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold  -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
            <Trash
              className="cursor-pointer"
              size={16}
              onClick={handleDeleteElement}
            />
          </div>
        )}
    </div>
  )
}

export default Checkout