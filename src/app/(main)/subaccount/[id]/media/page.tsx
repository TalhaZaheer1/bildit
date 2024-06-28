import MediaComponant from '@/components/media/MediaComponant'
import dbConnect from '@/lib/db'
import { getMedia } from '@/lib/queries'
import React from 'react'

type Props = {
    params:{id:string}
}

const Media = async ({params}: Props) => {
  await dbConnect()
  const subAccountWithMedia = await getMedia(params.id)
  return (
    <div>
      <MediaComponant data={subAccountWithMedia} subAccountId={params.id} />
    </div>
  )
}

export default Media