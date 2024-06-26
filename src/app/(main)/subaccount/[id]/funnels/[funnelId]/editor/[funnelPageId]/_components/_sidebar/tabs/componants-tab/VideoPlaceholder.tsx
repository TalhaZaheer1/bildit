import { EditorBtns } from '@/lib/constants'
import { Youtube } from 'lucide-react'
import React from 'react'

type Props = {}

const VideoPlaceholder = (props: Props) => {
  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return
    e.dataTransfer.setData('component', JSON.stringify({type:"video"}))
  }
  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, 'video')}
      className="h-14 w-14 bg-muted rounded-lg flex items-center justify-center"
    >
      <Youtube
        size={40}
        className="text-muted-foreground"
      />
    </div>
  )
}

export default VideoPlaceholder