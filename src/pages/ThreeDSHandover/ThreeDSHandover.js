import queryString from 'query-string'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Layout } from '../../components'

const ACCOUNT = 'ACCOUNT'
const CHECKOUT_PAYMENT = 'CHECKOUT_PAYMENT'
const CHECKOUT_PLACE_ORDER = 'CHECKOUT_PLACE_ORDER'

const SUCCESS = 'SUCCESS'
const ERROR = 'ERROR'

const ThreeDSHandover = () => {
  const loc = useLocation()
  const MySwal = withReactContent(Swal)

  let qParams = queryString.parse(loc.search, { arrayFormat: 'separator', arrayFormatSeparator: ',' })
  const { action, status } = qParams
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    const title = status === SUCCESS ? t('frontend.core.threeds.success') : t('frontend.core.threeds.fail')
    let timerInterval
    MySwal.fire({
      title,
      html: t('frontend.core.threeds.redirect'),
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        MySwal.showLoading()
        const b = MySwal.getHtmlContainer().querySelector('b')
        timerInterval = setInterval(() => {
          b.textContent = Math.ceil(MySwal.getTimerLeft() / 1000)
        }, 100)
      },
      willClose: () => {
        clearInterval(timerInterval)
      },
    }).then(result => {
      if (action === ACCOUNT) navigate('/my-account/cards')
      if (action === CHECKOUT_PLACE_ORDER && status === SUCCESS) navigate('/order-confirmation')
      if (action === CHECKOUT_PLACE_ORDER && status === ERROR) navigate('/checkout/review')
      if (action === CHECKOUT_PAYMENT) navigate('/checkout/payment')
    })

    return () => {
      clearInterval(timerInterval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout>
      <div className="container py-5 mb-lg-3">
        <div className="row justify-content-center pt-lg-4 text-center">
          <div className="col-lg-5 col-md-7 col-sm-9">{/* <h1 className="display-ThreeDSHandover"></h1> */}</div>
        </div>
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-10">{/* <pre>{stringParams}</pre> */}</div>
        </div>
      </div>
    </Layout>
  )
}

export default ThreeDSHandover
