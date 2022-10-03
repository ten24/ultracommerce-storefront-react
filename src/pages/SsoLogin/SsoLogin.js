import { Navigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import queryString from 'query-string'
import { getUser } from '../../actions'
import { getWishlists } from '../../selectors/userSelectors'

const SsoLogin = ({ redirectPath = '/my-account/overview' }) => {
  const dispatch = useDispatch()
  const loc = useLocation()
  const params = queryString.parse(loc.search)
  localStorage.setItem('token', params.token)
  if (!!params?.redirect) {
    redirectPath = params?.redirect
  }

  dispatch(getUser()).then(() => {
    dispatch(getWishlists())
  })

  return <Navigate to={redirectPath} />
}

export default SsoLogin
