import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { applyOrderTemplatePromoCode } from '../../actions'
import { useState } from 'react'
import { disableInteractionForOrderTemplateCheckoutSelector } from '../../selectors'
import { toast } from 'react-toastify'
import { getErrorMessage } from '../../utils'

const OrderTemplateCartPromoBox = () => {
  const disableInteraction = useSelector(disableInteractionForOrderTemplateCheckoutSelector)
  const dispatch = useDispatch()
  const [promoCode, setPromoCode] = useState('')
  const { orderTemplateID } = useSelector(state => state.subscriptionCart)
  const { t } = useTranslation()
  return (
    <div className="col-md-12">
      <div className="row">
        <div className="col-sm-12">
          <div className="card mb-4">
            <div className="card-header">
              <h4 className="mb-0">{t('frontend.cart.promoHeading')}</h4>
            </div>
            <div className="card-body">
              <form>
                <div className="input-group input-group-lg rounded-pill">
                  <input disabled={disableInteraction} className="form-control appended-form-control rounded-pill" type="text" placeholder="Promo code" value={promoCode} required onChange={e => setPromoCode(e.target.value)} />
                  <span className="input-group-append">
                    <button
                      className="btn btn-primary"
                      onClick={e => {
                        e.preventDefault()
                        dispatch(applyOrderTemplatePromoCode(promoCode, orderTemplateID)).then(response => {
                          if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
                          if (response.isSuccess()) toast.success(t('frontend.cart.promo_code_applied'))
                          setPromoCode('')
                        })
                      }}
                      type="submit"
                    >
                      {t('frontend.cart.apply')}
                    </button>
                  </span>
                </div>
              </form>
            </div>
            <div className="card-footer" />
          </div>
        </div>
      </div>
    </div>
  )
}
export { OrderTemplateCartPromoBox }
