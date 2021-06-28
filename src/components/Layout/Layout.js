import { Footer } from '..'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Layout = ({ classNameList, children }) => {
  return (
    <>
      <ToastContainer />
      <div className={`${classNameList} footer-height`}>{children}</div>
      <Footer />
    </>
  )
}

export { Layout }
