import React from 'react'
import TextComponent from './Text'
import Container from './Container'
// import VideoComponent from './video'
// import LinkComponent from './link-component'
// import ContactFormComponent from './contact-form-component'
// import Checkout from './checkout'
import { Element } from '@/providers/editor/EditorProvider'
import VideoComponent from './Video'
import LinkComponent from './LinkComponent'
import TwoColumns from './TwoColumns'

type Props = {
  element: Element
}

const Recursive = ({ element }: Props) => {
  switch (element.type) {
    case 'text':
      return <TextComponent element={element} />
    case 'container':
      return <Container element={element} />
    case 'video':
      return <VideoComponent element={element} />
    // case 'contactForm':
    //   return <ContactFormComponent element={element} />
    // case 'paymentForm':
    //   return <Checkout element={element} />
    case '2Col':
      return <TwoColumns element={element} />
    case '__body':
      return <Container element={element} />

    case 'link':
      return <LinkComponent element={element} />
    default:
      return null
  }
}

export default Recursive