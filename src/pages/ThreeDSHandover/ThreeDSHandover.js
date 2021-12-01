import queryString from 'query-string'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router'
import { toast } from 'react-toastify'

const ACCOUNT = 'ACCOUNT'
const CHECKOUT_PAYMENT = 'CHECKOUT_PAYMENT'
const CHECKOUT_PLACE_ORDER = 'CHECKOUT_PLACE_ORDER'

const SUCCESS = 'SUCCESS'
const ERROR = 'ERROR'

const ThreeDSHandover = () => {
  const loc = useLocation()
  let qParams = queryString.parse(loc.search, { arrayFormat: 'separator', arrayFormatSeparator: ',' })
  const { action, status } = qParams
  const stringParams = JSON.stringify(qParams, null, 4)
  const history = useHistory()
  const { t } = useTranslation()

  useEffect(() => {
    if (status === SUCCESS) {
      toast.success(t('frontend.core.threeds.success'))
    } else {
      toast.error(t('frontend.core.threeds.fail'))
    }
    const rTimer = setTimeout(() => {
      if (action === ACCOUNT) history.push('/my-account/cards')
      if (action === CHECKOUT_PLACE_ORDER && status === SUCCESS) history.push('/order-confirmation')
      if (action === CHECKOUT_PLACE_ORDER && status === ERROR) history.push('/checkout/review')
      if (action === CHECKOUT_PAYMENT && status === SUCCESS) history.push('/checkout/payment')
    }, 3000)
    return () => {
      clearTimeout(rTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="container py-5 mb-lg-3">
      <div className="row justify-content-center pt-lg-4 text-center">
        <div className="col-lg-5 col-md-7 col-sm-9">
          <h1 className="display-ThreeDSHandover">ThreeDS Handover</h1>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-xl-8 col-lg-10">
          <pre>{stringParams}</pre>
        </div>
      </div>
    </div>
  )
}

export default ThreeDSHandover
