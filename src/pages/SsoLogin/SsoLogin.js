import { useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Redirect } from 'react-router'
import queryString from 'query-string'
import { getUser } from '../../actions'
import { getWishlists } from '../../selectors/userSelectors'

const SsoLogin = ({ redirectPath = '/my-account' }) => {
  const dispatch = useDispatch()
  const loc = useLocation()
  const params = queryString.parse(loc.search)
  localStorage.setItem('token', params.token)
  if (!!params?.redirect) {
    redirectPath = params?.redirect
  }

  dispatch(getUser())
  dispatch(getWishlists())

  return <Redirect to={redirectPath} />
}

export default SsoLogin
