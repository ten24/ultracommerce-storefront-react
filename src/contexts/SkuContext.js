import { createContext, useContext } from 'react'

const SkuContext = createContext()

const SkuContextProvider = ({ children, sku }) => {
  return <SkuContext.Provider value={sku}>{children}</SkuContext.Provider>
}

const useSkuContext = () => {
  // get the context
  const context = useContext(SkuContext)

  // if `undefined`, throw an error
  if (context === undefined) {
    throw new Error('useSkuContext was used outside of its Provider')
  }

  return context
}

export { SkuContext, SkuContextProvider, useSkuContext }
