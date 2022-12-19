import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'

const Layout = ({ classNameList = '', children }) => {
  const siteName = useSelector(state => state.configuration.site.siteName)
  return (
    <>
      <Helmet title={siteName} />
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className={`${classNameList} footer-height`}>
        {children}
      </div>
    </>
  )
}

export { Layout }
