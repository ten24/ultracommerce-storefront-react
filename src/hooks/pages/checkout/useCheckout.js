import { getCurrentStep } from '../../../components'
import { useSelector } from 'react-redux'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'
import { isAuthenticated } from '../../../utils'
import { useEffect } from 'react'

const useCheckout = () => {
  const loc = useLocation()

  const navigate = useNavigate()
  const path = loc.pathname.split('/').reverse()?.at(0).toLowerCase()

  const currentStep = getCurrentStep(path)
  const { verifiedAccountFlag, isFetching, accountID } = useSelector(state => state.userReducer)
  const enforceVerifiedAccountFlag = useSelector(state => state.configuration.enforceVerifiedAccountFlag)

  const cartState = useSelector(state => state.cart) // check if there is some change in state , just to run use effect

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(`/my-account/login?redirect=${loc.pathname}`, { replace: true })
    }
  }, [navigate, loc, cartState])

  if (enforceVerifiedAccountFlag && !verifiedAccountFlag && isAuthenticated() && !isFetching && accountID.length > 0) {
    return <Navigate to="/account-verification" />
  }
  return { currentStep }
}

export { useCheckout }
