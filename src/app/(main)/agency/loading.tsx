import Loading from '@/components/global/loading'
import React from 'react'

type Props = {}

const loading = (props: Props) => {
  return (
    <div className='flex items-center justify-center w-full h-full'>
    <Loading />
    </div>
  )
}

export default loading