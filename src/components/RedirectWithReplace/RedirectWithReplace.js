import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const RedirectWithReplace = ({ pathname, search }) => {
  const navigate = useNavigate()
  useEffect(() => {
    navigate(
      {
        pathname,
        search,
      },
      { replace: true }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}
export { RedirectWithReplace }
