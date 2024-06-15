"use client"

import { Children, createContext, useContext, useEffect, useState } from "react"

interface ModalProviderProps {
    children: React.ReactNode
  }

type ModalContextType ={
    data:any,
    isOpen:boolean,
    setOpen:(modal:React.ReactNode,fetchData?:() => Promise<any>) => void,
    setClose:() => void
}

const ModalContext = createContext<ModalContextType>({
    data:{},
    isOpen:false,
    setOpen:(modal:React.ReactNode,fetchData?:() => Promise<any>) => {},
    setClose:() => {}
})

export const ModalProvider = ({children}:ModalProviderProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState({});
    const [showingModal, setShowingModal] = useState<React.ReactNode>(null)
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        setIsMounted(true)
    },[])

    const setOpen = async (modal:React.ReactNode,fetchData?:() => Promise<any>) => {
        if(modal){
            console.log(fetchData)
            if(fetchData){
                setData({...data,...(await fetchData())} || {})
            }
            setShowingModal(modal)
            setIsOpen(true)
        }
    }   
    const setClose = () => {
        setData({})
        setIsOpen(false)
    }



    if(!isMounted) return null

    return(
        <ModalContext.Provider value={{data,isOpen,setOpen,setClose}}>
            {children}
            {showingModal}
        </ModalContext.Provider>
    )
}


export const useModal = () => {
    const context = useContext(ModalContext)
    if(!context)
        throw new Error('useModal must be used within the modal provider')
    return context
}