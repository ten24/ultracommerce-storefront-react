import { getCurrentStep } from '../../../components'
import { useSelector } from 'react-redux'
import { Redirect, useHistory, useLocation } from 'react-router-dom'
import { isAuthenticated } from '../../../utils'
import { useEffect } from 'react'

const useCheckout = () => {
  const loc = useLocation()
  const history = useHistory()
  const path = loc.pathname.split('/').reverse()[0].toLowerCase()
  const currentStep = getCurrentStep(path)
  const { verifiedAccountFlag, isFetching, accountID } = useSelector(state => state.userReducer)
  const enforceVerifiedAccountFlag = useSelector(state => state.configuration.enforceVerifiedAccountFlag)

  const cartState = useSelector(state => state.cart) // check if there is some change in state , just to run use effect

  useEffect(() => {
    if (!isAuthenticated()) {
      history.replace(`/my-account/login?redirect=${loc.pathname}`)
    }
  }, [history, loc, cartState])

  if (enforceVerifiedAccountFlag && !verifiedAccountFlag && isAuthenticated() && !isFetching && accountID.length > 0) {
    return <Redirect to="/account-verification" />
  }
  return { currentStep }
}

export { useCheckout }
