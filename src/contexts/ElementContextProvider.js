import { createContext, useContext } from 'react'
import { SkuRow, ProductRow } from '../components/Listing/SearchDisplayModes'
import { ProductCard, SkuCard } from '../components/ProductCard/ProductCard'

const coreComponents = {
  SkuCard,
  SkuRow,
  ProductCard,
  ProductRow,
}
const ElementContext = createContext()

const ElementContextProvider = ({ children, customComponents = {} }) => {
  return <ElementContext.Provider value={{ ...coreComponents, ...customComponents }}>{children}</ElementContext.Provider>
}

const useElementContext = () => {
  // get the context
  const context = useContext(ElementContext)
  // if `undefined`, throw an error
  if (!context === undefined) {
    throw new Error('useElementContext was used outside of its Provider')
  }

  return context
}

/*
 * we return ElementContext because a user may want to bypass the API call if th
 * user got the Content data from another spot and wants to Hydrate Manually.
 */
export { ElementContext, ElementContextProvider, useElementContext }
