import MediaComponant from '@/components/media/MediaComponant'
import { getMedia } from '@/lib/queries'
import React from 'react'

type Props = {
    params:{id:string}
}

const Media = async ({params}: Props) => {
  const subAccountWithMedia = await getMedia(params.id)
  return (
    <div>
      <MediaComponant data={subAccountWithMedia} subAccountId={params.id} />
    </div>
  )
}

export default Media