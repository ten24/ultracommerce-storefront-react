import { useEffect } from 'react'
import { useHistory } from 'react-router'

const RedirectWithReplace = ({ pathname, search }) => {
  let history = useHistory()
  useEffect(() => {
    history.replace({
      pathname,
      search,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}
export { RedirectWithReplace }
