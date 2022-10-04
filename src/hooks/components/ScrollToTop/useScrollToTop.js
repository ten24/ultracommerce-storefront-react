import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const useScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    if (!pathname.includes('/product/')) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }, [pathname])

  return {}
}

export { useScrollToTop }
