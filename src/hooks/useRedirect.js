import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
export const useRedirect = ({ shouldRedirect = false, location = '/', time = 2000 }) => {
  const navigate = useNavigate()
  const [redirect, setRedirect] = useState(shouldRedirect)

  useEffect(() => {
    if (redirect) {
      const timer = setTimeout(() => {
        navigate(location)
      }, time)
      return () => clearTimeout(timer)
    }
  }, [navigate, redirect, location, time])
  return [redirect, setRedirect]
}
export default useRedirect

export const usePush = defaults => {
  const navigate = useNavigate()
  const [redirect, setRedirect] = useState({ shouldRedirect: false, location: '/', search: '', time: 2000, ...defaults })

  useEffect(() => {
    if (redirect.shouldRedirect) {
      const timer = setTimeout(() => {
        navigate({
          pathname: redirect.location,
          search: redirect.search,
        })
      }, redirect.time)
      return () => clearTimeout(timer)
    }
  }, [navigate, redirect])
  return [redirect, setRedirect]
}
