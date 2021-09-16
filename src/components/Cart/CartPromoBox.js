import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { applyPromoCode } from '../../actions/'
import { useState } from 'react'
import { disableInteractionSelector } from '../../selectors'

const CartPromoBox = () => {
  const disableInteraction = useSelector(disableInteractionSelector)
  const dispatch = useDispatch()
  const [promoCode, setPromoCode] = useState('')
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
                        dispatch(applyPromoCode(promoCode))
                        setPromoCode('')
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
export { CartPromoBox }
