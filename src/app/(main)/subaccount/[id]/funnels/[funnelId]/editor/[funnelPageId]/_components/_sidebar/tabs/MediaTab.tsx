'use client'
import MediaComponant from '@/components/media/MediaComponant'
import { getMedia } from '@/lib/queries'
import { SubAccountInterfaceWithMedia } from '@/lib/types'
import React, { useEffect, useState } from 'react'

type Props = {
  subAccountId: string
}

const MediaBucketTab = (props: Props) => {
  const [data, setdata] = useState<SubAccountInterfaceWithMedia | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const response = await getMedia(props.subAccountId)
      setdata(response)
    }
    fetchData()
  }, [props.subAccountId])

  return (
    <div className="h-[900px] overflow-scroll p-4">
      <MediaComponant
        data={data as SubAccountInterfaceWithMedia}
        subAccountId={props.subAccountId}
      />
    </div>
  )
}

export default MediaBucketTab