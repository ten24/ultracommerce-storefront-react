import { useTranslation } from 'react-i18next'
import { useState } from 'react'

const CartPromoBox = ({ onApplyCode, disableInteraction = false }) => {
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
              <form
                onSubmit={e => {
                  e.preventDefault()
                  onApplyCode(promoCode, setPromoCode)
                }}
              >
                <div className="input-group input-group-lg rounded-pill">
                  <input disabled={disableInteraction} className="form-control appended-form-control rounded-pill" type="text" placeholder="Promo code" value={promoCode} required onChange={e => setPromoCode(e.target.value)} />
                  <span className="input-group-append">
                    <button
                      className="btn btn-primary"
                      onClick={e => {
                        e.preventDefault()
                        onApplyCode(promoCode, setPromoCode)
                      }}
                      type="button"
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
