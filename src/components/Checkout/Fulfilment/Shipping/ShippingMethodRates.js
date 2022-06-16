import { useTranslation } from 'react-i18next'
import { SwRadioSelect } from '../../../SwRadioSelect/SwRadioSelect'

const ShippingMethodRates = ({ fulfillment, onSelection }) => {
  const { t } = useTranslation()

  const { shippingMethod, shippingMethodOptions } = fulfillment
  if (!fulfillment?.shippingAddress?.addressID?.length) return null
  return (
    <div className=" row shippingMethodRates">
      <h5 className="h5 pt-1 pb-2 mb-3 border-bottom">{t('frontend.checkout.delivery_option')}</h5>
      <SwRadioSelect
        options={shippingMethodOptions}
        onChange={value => {
          onSelection(value)
        }}
        selectedValue={shippingMethod?.shippingMethodID}
      />
      {shippingMethodOptions?.length === 0 && (
        <div className="alert alert-info" role="alert">
          {t('frontend.checkout.fulfilment.shipping.no_eligible_options')}
        </div>
      )}
    </div>
  )
}
export { ShippingMethodRates }
